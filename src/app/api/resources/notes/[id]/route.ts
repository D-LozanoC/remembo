import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/config/prisma'

export async function GET(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await context.params
    const note = await prisma.note.findUnique({
        where: { id },
        include: { flashcards: true, user: { select: { name: true, email: true } } }
    })
    if (!note) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(note)
}

export async function PATCH(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

    const { id, subject, content, title, topic } = await req.json();

    if (!id || !subject || !content || !title || !topic) return NextResponse.json({ error: 'Faltan campos por llenar' }, { status: 400 });

    const updateData = {
        subject,
        content,
        title,
        topic
    };

    const note = await prisma.note.update({
        where: { id },
        data: updateData
    });

    return NextResponse.json(note, { status: 200 });
}

export async function DELETE(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await context.params
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    await prisma.note.deleteMany({ where: { id, userId: session.user.id } })
    return NextResponse.json({ deleted: true })
}
