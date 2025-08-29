import { auth } from "@/auth"
import { prisma } from "@/config/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    });

    return NextResponse.json({ role: user?.role || 'user' }, { status: 200 });
}