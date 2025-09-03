// src/app/api/study-session/answer/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/config/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { sessionId, flashcardId, deckId, isCorrect, timeSpent } = body as {
            sessionId: string;
            flashcardId: string;
            deckId: string;
            isCorrect: boolean;
            timeSpent: number;
        };

        if (!sessionId || !flashcardId || !deckId) {
            return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
        }

        // Asegurarse de que exista el registro antes de update
        const existing = await prisma.studySessionFlashcard.findUnique({
            where: { studySessionId_flashcardId: { studySessionId: sessionId, flashcardId } },
        });

        if (!existing) {
            // Si no existe, crear (caso raro si start no creó el registro)
            const created = await prisma.studySessionFlashcard.create({
                data: {
                    studySessionId: sessionId,
                    deckId,
                    flashcardId,
                    isCorrect: !!isCorrect,
                    timeSpent: timeSpent ?? 0,
                },
            });
            return NextResponse.json({ created });
        }

        const updated = await prisma.studySessionFlashcard.update({
            where: { studySessionId_flashcardId: { studySessionId: sessionId, flashcardId } },
            data: { isCorrect: !!isCorrect, timeSpent: timeSpent ?? 0 },
        });

        return NextResponse.json({ updated });
    } catch (err) {
        console.error("answer error:", err);
        return NextResponse.json({ error: "Error guardando respuesta" }, { status: 500 });
    }
}
