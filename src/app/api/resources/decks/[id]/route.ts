import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/config/prisma'

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await context.params
  if (!id) return NextResponse.json({ error: 'Falta id del Mazo' }, { status: 404 })

  const deck = await prisma.deck.findUnique({
    where: { id },
    include: { flashcards: { include: { Note: true } } }
  })

  if (!deck) return NextResponse.json({ error: 'Mazo con id ' + id + ' no encontrado' }, { status: 404 })

  return NextResponse.json(deck)
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })


  const { id } = await context.params
  const body = await request.json()

  // Desestructura y quita flashcards
  const { flashcards, updateData } = body

  try {
    const updatedDeck = await prisma.deck.update({
      where: { id, userId: session.user.id },
      data: {
        ...updateData,
        flashcards: {
          connect: flashcards.map((fc: { id: string }) => ({ id: fc.id }))
        }
      },
      include: { flashcards: { include: { Note: true } } }
    })
    return NextResponse.json(updatedDeck)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Not found or no permission' }, { status: 404 })
  }
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await context.params
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })
  await prisma.deck.deleteMany({ where: { id, userId: session.user.id } })
  return NextResponse.json({ deleted: true })
}