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
    include: {
      DeckFlashcard: {
        select: {
          flashcard: {
            include: { Note: true }
          }
        }
      }
    }
  })

  if (!deck) return NextResponse.json({ error: 'Mazo con id ' + id + ' no encontrado' }, { status: 404 })
  const fullDeck = {
    ...deck,
    flashcards: deck.DeckFlashcard.map(df => df.flashcard)
  }


  return NextResponse.json(fullDeck)
}


export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await context.params
  const body = await request.json()
  const { flashcards } = body

  

  try {

    // Si vienen flashcards, actualiza en la tabla pivote
    if (flashcards && flashcards.length > 0) {

      // Inserta nuevas relaciones
      await prisma.deckFlashcard.createMany({
        data: flashcards.map((fc: { id: string }) => ({
          deckId: id,
          flashcardId: fc.id,
        })),
        skipDuplicates: true,
      })
    }

    // Recupera deck con flashcards
    const result = await prisma.deck.findUnique({
      where: { id },
      include: {
        DeckFlashcard: {
          select: {
            flashcard: {
              include: { Note: true },
            },
          },
        },
      },
    })

    const resultDeck = {
      ...result,
      flashcards: result?.DeckFlashcard.map(df => df.flashcard) || [],
    }

    return NextResponse.json(resultDeck)
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