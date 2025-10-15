import { auth } from "@/auth";
import { prisma } from "@/config/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const sessionId = req.nextUrl.searchParams.get("sessionId");
        if (!sessionId) {
            return new Response("sessionId is required", { status: 400 });
        }

        const sessionData = await prisma.studySession.findUnique({
            where: { id: sessionId, userId: session.user.id },
            select: {
                StudySessionFlashcard: {
                    select: {
                        flashcardId: true,
                        flashcard: {
                            select: {
                                question: true,
                                answers: true,
                                correctAnswers: true
                            }
                        },
                        deck: {
                            select: {
                                title: true,
                                id: true
                            }
                        }

                    }
                },
                previousSessionId: true,
                nextSessionId: true
            }
        })

        let lastSession = null;
        if (sessionData?.previousSessionId) {
            lastSession = await prisma.studySession.findUnique({
                where: { id: sessionData.previousSessionId },
                select: {
                    accuracy: true,
                    dateReview: true
                }
            })
        }

        let idx = 0;

        const payload = {
            questions: sessionData?.StudySessionFlashcard.map(s => {
                return {
                    id: s.flashcardId,
                    idx: idx++,
                    question: s.flashcard.question,
                    answer: s.flashcard.correctAnswers[0],
                    options: s.flashcard.answers
                }
            }),
            mallet: sessionData?.StudySessionFlashcard[0]?.deck?.title,
            deckId: sessionData?.StudySessionFlashcard[0]?.deck?.id,
            lastSession
        }

        return new Response(JSON.stringify(payload), { status: 200 });
    } catch (error: unknown) {
        console.error("Error fetching study session:", error);
    }
}