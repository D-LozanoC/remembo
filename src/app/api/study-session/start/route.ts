// src/app/api/study-session/start/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/config/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, deckIds } = body as { userId: string; deckIds: string[] };

        if (!userId || !Array.isArray(deckIds) || deckIds.length === 0) {
            return NextResponse.json({ error: "Datos incompletos (userId y deckIds son requeridos)" }, { status: 400 });
        }

        // 1) Crear la StudySession (no usamos startedAt porque no existe en el modelo)
        const session = await prisma.studySession.create({
            data: { userId },
        });

        // 2) Recolectar flashcards y operaciones de creación para la transacción
        const flashcardsData: Array<{
            studySessionId: string;
            deckId: string;
            flashcardId: string;
            question: string | null;
            answers: string[] | null;
            correctAnswers: string[] | null;
            priority?: number | null;
            position?: number | null;
        }> = [];


        const ops = [];

        for (const deckId of deckIds) {
            // obtener las relaciones DeckFlashcard ordenadas por priority (desc) e incluir datos de la flashcard
            const deckFlashcards = await prisma.deckFlashcard.findMany({
                where: { deckId },
                orderBy: { priority: "desc" },
                include: { flashcard: true },
            });

            // crear/registrar StudySessionDeck para este deck dentro de la sesión
            ops.push(
                prisma.studySessionDeck.create({
                    data: {
                        studySessionId: session.id,
                        deckId,
                        accuracy: 0,
                        score: 0,
                        duration: 0,
                        // nextReview queda nulo por ahora
                    },
                })
            );

            for (const df of deckFlashcards) {
                // preparar payload legible para frontend
                flashcardsData.push({
                    studySessionId: session.id,
                    deckId,
                    flashcardId: df.flashcardId,
                    question: df.flashcard?.question ?? null,
                    answers: df.flashcard?.answers ?? null,
                    correctAnswers: df.flashcard?.correctAnswers ?? null,
                    priority: df.priority ?? 0,
                    position: null,
                });

                // crear el registro StudySessionFlashcard que guarda el estado por tarjeta dentro de la sesión
                ops.push(
                    prisma.studySessionFlashcard.create({
                        data: {
                            studySessionId: session.id,
                            deckId,
                            flashcardId: df.flashcardId,
                            isCorrect: false,
                            timeSpent: 0,
                            position: null,
                        },
                    })
                );
            }
        }

        // 3) Ejecutar todas las creaciones en una transacción atómica
        if (ops.length > 0) {
            await prisma.$transaction(ops);
        }

        // 4) Responder con la sesión (incluye createdAt) y las flashcards ya mapeadas para el frontend
        return NextResponse.json({
            session, // contiene session.id y session.createdAt (entre otros campos)
            flashcards: flashcardsData,
        });
    } catch (err) {
        console.error("POST /api/study-session/start error:", err);
        return NextResponse.json({ error: "Error iniciando la sesión" }, { status: 500 });
    }
}
