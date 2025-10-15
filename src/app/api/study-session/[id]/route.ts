import { auth } from "@/auth";
import { prisma } from "@/config/prisma";
import { StudySession } from "@prisma/client";
import { NextRequest } from "next/server";

type StudySessionUpdateData = Partial<StudySession>;


export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user?.id) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await context.params;
    const updateData = await req.json();

    try {
        const existing = await prisma.studySession.findUnique({
            where: { id },
            select: { userId: true },
        });

        if (!existing) {
            return new Response("Not found", { status: 404 });
        }

        if (existing.userId !== session.user.id) {
            return new Response("Forbidden", { status: 403 });
        }

        const allowedFields = ["accuracy", "duration", "status", "dateReview", "deckId", "nextSessionId", "previousSessionId"];
        const dataToUpdate: StudySessionUpdateData = {};

        for (const key of allowedFields) {
            if (key in updateData) {
                dataToUpdate[key as keyof StudySession] = updateData[key];
            }
        }


        const updated = await prisma.studySession.update({
            where: { id },
            data: dataToUpdate,
            select: {
                id: true
            }
        });

        return new Response(JSON.stringify({ success: !!updated }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: unknown) {
        console.error(error);
        return new Response("Internal Server Error", { status: 500 });
    }
}