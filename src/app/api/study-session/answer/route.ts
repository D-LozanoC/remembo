// src/app/api/study-session/answer/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/config/prisma";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";

export interface AnswerPayload {
    questions: Prisma.StudySessionFlashcardCreateManyInput[]
}

export async function PATCH(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return new Response("Unauthorized", { status: 401 });
    }
    try {
        const body = await req.json();
        const { questions } = body as AnswerPayload
        if (questions.length == 0) {
            return new Response("Faltan datos.", { status: 400 })
        }

        const success = await prisma.$transaction(async (tx) => {
            const session = await tx.studySession.findUnique({
                where: { id: questions[0].studySessionId },
                select: { id: true },
            });

            if (!session) {
                // ojo: mejor lanza un error y maneja fuera, no devuelvas Response aquí
                throw new Error("SESSION_NOT_FOUND");
            }

            // ejecuta todas las updates y espera resultados
            const updates = await Promise.all(
                questions.map(async (q) => {
                    const s = await tx.studySessionFlashcard.update({
                        where: {
                            studySessionId_flashcardId: {
                                flashcardId: q.flashcardId,
                                studySessionId: q.studySessionId,
                            },
                        },
                        data: {
                            isCorrect: q.isCorrect,
                            timeSpent: q.timeSpent,
                        },
                        select: {
                            flashcardId: true,
                        },
                    });

                    return !!s.flashcardId;
                })
            );

            // ahora puedes usar every normal (ya tienes boolean[])
            return updates.every((v) => v);
        });

        return NextResponse.json({ success }, { status: 200 });
    } catch (err: unknown) {
        console.error("answer error:", err);

        if (err instanceof Error) {
            if (err.message === "SESSION_NOT_FOUND") {
                return NextResponse.json(
                    { error: "La sesión no existe." },
                    { status: 404 }
                );
            }
        }

        return NextResponse.json(
            { error: "Error guardando respuesta" },
            { status: 500 }
        );
    }
}
