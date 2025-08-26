import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/config/prisma'

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await context.params
    const fc = await prisma.flashcard.findUnique({
        where: { id },
        include: { Note: true, decks: true, user: { select: { name: true, email: true } } }
    })
    if (!fc) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(fc)
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await context.params
    const data = await request.json()
    const updated = await prisma.flashcard.updateMany({
        where: { id, userId: session.user.id },
        data
    })
    if (updated.count === 0) return NextResponse.json({ error: 'Not found or no permission' }, { status: 404 })
    return NextResponse.json({ updated: true })
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await context.params
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    await prisma.flashcard.deleteMany({ where: { id, userId: session.user.id } })
    return NextResponse.json({ deleted: true })
}
