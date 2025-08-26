import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/config/prisma'

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id: deckId } = await context.params
    const { flashcardId } = await request.json()
    await prisma.deck.update({
        where: { id: deckId },
        data: { flashcards: { connect: { id: flashcardId } } }
    })
    const updated = await prisma.deck.findUnique({ where: { id: deckId }, include: { flashcards: true } })
    return NextResponse.json(updated)
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id: deckId } = await context.params
    const { flashcardId } = await request.json()
    await prisma.deck.update({
        where: { id: deckId },
        data: { flashcards: { disconnect: { id: flashcardId } } }
    })
    const updated = await prisma.deck.findUnique({ where: { id: deckId }, include: { flashcards: true } })
    return NextResponse.json(updated)
}
