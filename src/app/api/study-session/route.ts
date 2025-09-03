// src/app/api/study-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/config/prisma";
import { auth } from "@/auth";
import { Flashcard, Prisma, StudySessionFlashcard, StudySessionStatus } from "@prisma/client";


export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get("sessionId");
    const userIdQuery = url.searchParams.get("userId");
    const statusFilter = url.searchParams.get("status");
    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
    const perPage = Math.max(1, parseInt(url.searchParams.get("perPage") ?? "20", 10));
    const skip = (page - 1) * perPage;
    const includeFlashcards = url.searchParams.get("includeFlashcards") === "true";
    const includeDecks = url.searchParams.get("includeDecks") === "true";

    const session = await auth();

    const authUserId = session?.user?.id;

    const effectiveUserId = userIdQuery ?? authUserId ?? null;

    try {
        // --- Detalle de sesión ---
        if (sessionId) {
            const session = await prisma.studySession.findUnique({
                where: { id: sessionId },
                include: {
                    StudySessionDeck: true,
                    StudySessionFlashcard: {
                        include: {
                            flashcard: true,
                            deck: true,
                        },
                        orderBy: { position: "asc" },
                    },
                },
            });

            if (!session) {
                return NextResponse.json({ error: "Session not found" }, { status: 404 });
            }

            if (effectiveUserId && session.userId !== effectiveUserId) {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }

            const out = {
                id: session.id,
                userId: session.userId,
                status: session.status,
                createdAt: session.createdAt,
                updatedAt: session.updatedAt,
                accuracy: session.accuracy,
                duration: session.duration,
                scheduledAt: session.scheduledAt ?? null,
                decks: session.StudySessionDeck ?? [],
                flashcards: (session.StudySessionFlashcard ?? []).map((sfc) => ({
                    studySessionId: sfc.studySessionId,
                    flashcardId: sfc.flashcardId,
                    deckId: sfc.deckId,
                    isCorrect: sfc.isCorrect,
                    timeSpent: sfc.timeSpent,
                    position: sfc.position,
                    question: sfc.flashcard?.question ?? null,
                    answers: Array.isArray(sfc.flashcard?.answers) ? sfc.flashcard?.answers : [],
                    correctAnswers: Array.isArray(sfc.flashcard?.correctAnswers) ? sfc.flashcard?.correctAnswers : [],
                    deck: sfc.deck ? { id: sfc.deck.id, title: sfc.deck.title, topic: sfc.deck.topic } : null,
                })),
            };

            return NextResponse.json(out);
        }

        // --- Lista de sesiones ---
        if (!effectiveUserId) {
            return NextResponse.json({ error: "Unauthenticated or missing userId" }, { status: 401 });
        }

        const whereClause: Prisma.StudySessionWhereInput = { userId: effectiveUserId };
        if (statusFilter) whereClause.status = statusFilter as StudySessionStatus;

        const [items, totalCount] = await Promise.all([
            prisma.studySession.findMany({
                where: whereClause,
                orderBy: { createdAt: "desc" },
                skip,
                take: perPage,
                include: {
                    StudySessionDeck: includeDecks ? true : false,
                    StudySessionFlashcard: includeFlashcards
                        ? { include: { flashcard: true } }
                        : false,
                },
            }),
            prisma.studySession.count({ where: whereClause }),
        ]);

        type FlashcardWithDetails = Partial<StudySessionFlashcard> & {
            flashcard?: Partial<Flashcard>;
        };

        const normalized = items.map((s) => ({
            id: s.id,
            userId: s.userId,
            status: s.status,
            createdAt: s.createdAt,
            updatedAt: s.updatedAt,
            accuracy: s.accuracy ?? null,
            duration: s.duration ?? null,
            scheduledAt: s.scheduledAt ?? null,
            decks: includeDecks ? s.StudySessionDeck : undefined,
            flashcards: includeFlashcards
                ? s.StudySessionFlashcard.map((sf: FlashcardWithDetails) => ({
                    flashcardId: sf.flashcardId,
                    deckId: sf.deckId,
                    isCorrect: sf.isCorrect,
                    timeSpent: sf.timeSpent,
                    position: sf.position,
                    question: sf.flashcard?.question ?? null,
                    answers: Array.isArray(sf.flashcard?.answers) ? sf.flashcard?.answers : [],
                    correctAnswers: Array.isArray(sf.flashcard?.correctAnswers) ? sf.flashcard?.correctAnswers : [],
                }))
                : undefined,
        }));

        return NextResponse.json({ items: normalized, totalCount });
    } catch (err) {
        console.error("GET /api/study-session error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
