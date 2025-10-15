// src/app/api/study-session/finish/route.ts

import { auth } from "@/auth";
import { NextRequest } from "next/server";
import { prisma } from "@/config/prisma";
import { I, scheduleAtNoon } from "@/shared/sections/study-session/utils";

export interface FinishPayload {
    deckId: string,
    sessionId: string,
    accuracy: number,
    duration: number,
    q: number,
    flashcardsIds: string[]
}

export async function PATCH(req: NextRequest) {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) {
        return new Response("Unauthorized", { status: 401 })
    }

    const {
        accuracy,
        duration,
        sessionId,
        q,
        deckId,
        flashcardsIds
    } = await req.json() as FinishPayload

    if (
        accuracy === undefined ||
        duration === undefined ||
        !sessionId ||
        q === undefined ||
        !deckId ||
        !flashcardsIds?.length
    ) {
        return new Response("Data incomplete", { status: 400 });
    }
    // Envió de accuracy, duration, nextReview, easiness, interval, repetitions++
    // En deckFlashcard priority
    try {
        const transaction = await prisma.$transaction(async tx => {
            // Se obtiene easiness y reps del estado del algoritmo del deck, 
            // si no existe lo crea con datos default
            const { easiness, repetitions } = await tx.deckAlgorithmState.upsert({
                where: { deckId },
                create: { deckId },
                update: {},
                select: { easiness: true, repetitions: true }
            });
            // Obtenemos el easiness factor para la proxima sesión de estudio
            let ef = easiness + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
            if (ef < 1.3) ef = 1.3;
            if (ef > 2.5) ef = 2.5;
            // Obtenemos el intervalo que habrá entre la sesión que se acaba de realizar y la siguiente
            const interval = I(repetitions, ef, q);
            const nextReview = scheduleAtNoon(new Date(), interval)
            // Actualizamos el estado del algoritmo del mazo
            await tx.deckAlgorithmState.update({
                where: { deckId },
                data: { easiness: ef, repetitions: repetitions + 1 }
            })
            // Creamos una nueva sesión 
            const { id } = await tx.studySession.create({
                data: {
                    userId,
                    deckId,
                    status: "Programada",
                    dateReview: nextReview,
                    previousSessionId: sessionId,
                    StudySessionFlashcard: {
                        createMany: {
                            data: flashcardsIds.map(fid => ({ flashcardId: fid, deckId }))
                        }
                    }
                },
                select: {
                    id: true
                }
            })
            // Actualizamos la sesión de estudio finalizada
            await tx.studySession.update({
                where: {
                    id: sessionId
                },
                data: {
                    nextSessionId: id,
                    duration, accuracy,
                    status: "Finalizada",
                    dateReview: new Date()
                }
            })
            // Actualizamos la ultima revisión de las flashcards de la sesión
            await tx.deckFlashcard.updateMany({
                data: { lastSeenAt: new Date() },
                where: { flashcardId: { in: flashcardsIds }, deckId }
            })

            return {
                success: true,
                nextReview
            };
        })

        return new Response(JSON.stringify(transaction), { status: transaction ? 200 : 500 })

    } catch (error: unknown) {
        console.error("Error en /api/study-session/finish: ", error)
        return new Response("Internal Server Error", { status: 500 })
    }
}
