import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/config/prisma'

export async function GET() {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const reviews = await prisma.flashcardReview.findMany({
        where: { flashcard: { userId: session.user.id } }
    })
    return NextResponse.json(reviews)
}

export async function POST(request: Request) {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { flashcardId, score, previousInterval, nextInterval } = await request.json()
    const review = await prisma.flashcardReview.create({
        data: { flashcardId, score, previousInterval, nextInterval }
    })
    return NextResponse.json(review, { status: 201 })
}
