import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/config/prisma'

// Obtener una flashcard con sus decks y nota
export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    const fc = await prisma.flashcard.findUnique({
        where: { id },
        include: {
            Note: true,
            user: { select: { name: true, email: true } },
            DeckFlashcard: {
                include: { deck: true }, // para traer la info de los mazos
            },
        },
    })

    if (!fc) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const result = {
        ...fc,
        decks: fc.DeckFlashcard.map(df => df.deck),
    }

    return NextResponse.json(result)
}

// Actualizar una flashcard
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    const data = await request.json()

    try {
        const updated = await prisma.flashcard.update({
            where: { id, userId: session.user.id },
            data,
        })

        return NextResponse.json(updated)
    } catch (err) {
        return NextResponse.json({ error: 'Not found or no permission' }, { status: 404 })
    }
}


export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await context.params
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    await prisma.flashcard.deleteMany({ where: { id, userId: session.user.id } })
    return NextResponse.json({ deleted: true })
}
