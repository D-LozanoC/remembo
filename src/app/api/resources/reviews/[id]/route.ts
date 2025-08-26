import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/config/prisma'

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await context.params
    const rev = await prisma.flashcardReview.findUnique({ where: { id } })
    if (!rev) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(rev)
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await context.params
    await prisma.flashcardReview.deleteMany({ where: { id } })
    return NextResponse.json({ deleted: true })
}
