// src/app/api/study-session/start/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/config/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const { userId, deckId } = body as { userId: string; deckId: string };

        if (!userId || !deckId || deckId.length === 0) {
            return NextResponse.json({ error: "Datos incompletos (userId y deckId son requeridos)" }, { status: 400 });
        }

        const start = prisma.$transaction(async (tx) => {
            // Verificar si ya existe una sesión activa para el usuario y el mazo
            let session = await tx.studySession.findFirst({ where: { userId, deckId, status: { in: ["En_Curso", "Programada"] } } });
            // Si existe, devolverla
            if (session) return session;
            // Si no existe, crear una nueva sesión
            session = await tx.studySession.create({ data: { userId, deckId } });
            // Crear las conexiones intermedias entre sesión, mazo y flashcards
            const flashcards = await tx.flashcard.findMany({
                where: {
                    DeckFlashcard: {
                        some: { deckId }
                    }
                },
                select: {
                    id: true
                },
            })

            await tx.studySessionFlashcard.createMany({
                data: flashcards.map(fc => ({ studySessionId: session.id, deckId, flashcardId: fc.id }))
            })

            return session;
        })

        return NextResponse.json({
            session: await start
        });
    } catch (err: unknown) {
        console.error("POST /api/study-session/start error:", err);
        return NextResponse.json({ error: "Error iniciando la sesión" }, { status: 500 });
    }
}
