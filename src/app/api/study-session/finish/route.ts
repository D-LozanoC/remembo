// src/app/api/study-session/finish/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/config/prisma";

interface FlashcardAnswerPayload {
    flashcardId: string;
    deckId: string;
    isCorrect: boolean;
    timeSpent: number;
    position?: number;
}

interface FinishSessionPayload {
    sessionId: string;
    userId: string;
    flashcards: FlashcardAnswerPayload[];
    startedAt?: string;
    endedAt?: string;
}

const MIN_PRIORITY = 0;
const MAX_PRIORITY = 100;

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as FinishSessionPayload;
        const { sessionId, userId, flashcards, endedAt } = body;

        if (!sessionId || !userId || !Array.isArray(flashcards) || flashcards.length === 0) {
            return NextResponse.json({ error: "Payload incompleto" }, { status: 400 });
        }

        // 1) Actualizar/guardar respuestas de StudySessionFlashcard en batch
        const updateFlashcardOps = flashcards.map((fc) =>
            prisma.studySessionFlashcard.upsert({
                where: { studySessionId_flashcardId: { studySessionId: sessionId, flashcardId: fc.flashcardId } },
                create: {
                    studySessionId: sessionId,
                    deckId: fc.deckId,
                    flashcardId: fc.flashcardId,
                    isCorrect: !!fc.isCorrect,
                    timeSpent: fc.timeSpent ?? 0,
                    position: fc.position ?? undefined,
                },
                update: {
                    deckId: fc.deckId,
                    isCorrect: !!fc.isCorrect,
                    timeSpent: fc.timeSpent ?? 0,
                    position: fc.position ?? undefined,
                },
            })
        );

        await prisma.$transaction(updateFlashcardOps);

        // 2) Agrupar por deck y procesar cada mazo
        const deckGroups: Record<string, FlashcardAnswerPayload[]> = {};
        flashcards.forEach((fc) => {
            if (!deckGroups[fc.deckId]) deckGroups[fc.deckId] = [];
            deckGroups[fc.deckId].push(fc);
        });

        const nextSessions: { deckId: string; nextSessionId: string; scheduledAt: Date }[] = [];

        for (const deckId of Object.keys(deckGroups)) {
            const deckFlashcards = deckGroups[deckId];

            // Cálculo de accuracy
            const correctCount = deckFlashcards.filter((fc) => fc.isCorrect).length;
            const accuracy = Math.round((correctCount / deckFlashcards.length) * 100);

            // Tiempo promedio en segundos
            const avgTimeSec =
                deckFlashcards.reduce((sum, fc) => sum + (fc.timeSpent ?? 0), 0) / deckFlashcards.length / 1000;

            // Obtener estado actual del mazo
            const state = await prisma.deckAlgorithmState.findUnique({ where: { deckId } });
            if (!state) {
                // Si no hay estado, saltar (o crear uno por defecto si prefieres)
                console.warn(`DeckAlgorithmState no existe para deckId=${deckId}, se omite procesamiento de este mazo.`);
                continue;
            }

            // Calcular score q (0..5) - versión simplificada
            const q = Math.round(
                Math.max(0, Math.min(5, (accuracy / 100) * 5 * Math.min(1, state.targetSecondsPerItem / Math.max(0.001, avgTimeSec))))
            );

            // 3) Actualizar prioridad de las flashcards del deck en batch
            const updatePriorities = deckFlashcards.map((fc) =>
                prisma.deckFlashcard.update({
                    where: { deckId_flashcardId: { deckId, flashcardId: fc.flashcardId } },
                    data: {
                        priority: Math.min(MAX_PRIORITY, Math.max(MIN_PRIORITY, Math.round((q / 5) * 100))),
                        lastSeenAt: endedAt ? new Date(endedAt) : new Date(),
                    },
                })
            );
            await prisma.$transaction(updatePriorities);

            // 4) Actualizar estado del mazo (SM-5 simplificado)
            const newRepetitions = state.repetitions + 1;
            const newEasiness = Math.max(
                1.3,
                state.easiness + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)
            );

            let newInterval: number;
            if (newRepetitions === 1) newInterval = 1;
            else if (newRepetitions === 2) newInterval = 6;
            else newInterval = Math.max(1, Math.round((state.interval || 1) * newEasiness));

            const nextReview = new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000);

            await prisma.deckAlgorithmState.update({
                where: { deckId },
                data: {
                    lastScore: q,
                    repetitions: newRepetitions,
                    easiness: newEasiness,
                    interval: newInterval,
                    nextReview,
                },
            });

            // 5) Upsert StudySessionDeck (actualizar la fila de esta sesión para el mazo)
            const durationSeconds = Math.round(
                deckFlashcards.reduce((sum, fc) => sum + (fc.timeSpent ?? 0), 0) / 1000
            );

            await prisma.studySessionDeck.upsert({
                where: { studySessionId_deckId: { studySessionId: sessionId, deckId } },
                create: {
                    studySessionId: sessionId,
                    deckId,
                    accuracy,
                    score: q,
                    duration: durationSeconds,
                    nextReview,
                },
                update: {
                    accuracy,
                    score: q,
                    duration: durationSeconds,
                    nextReview,
                },
            });

            // 6) Crear próxima sesión programada para el usuario (si aplica)
            const nextSession = await prisma.studySession.create({
                data: {
                    userId,
                    status: "Programada",
                    scheduledAt: nextReview,
                    StudySessionDeck: { create: { deckId, accuracy: 0, score: 0, duration: 0 } },
                },
            });

            nextSessions.push({ deckId, nextSessionId: nextSession.id, scheduledAt: nextReview });
        }

        return NextResponse.json({ nextSessions });
    } catch (err) {
        console.error("finish error:", err);
        return NextResponse.json({ error: "Error procesando la sesión" }, { status: 500 });
    }
}
