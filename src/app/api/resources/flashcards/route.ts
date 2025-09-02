// /api/resources/flashcards/route.ts
import { auth } from '@/auth';
import { prisma } from '@/config/prisma';
import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
        }

        const userId = session.user.id;

        const url = new URL(req.url);

        const search = (url.searchParams.get('search') ?? '').trim();
        const orderParam = url.searchParams.get('order');
        const order: 'asc' | 'desc' = orderParam === 'desc' ? 'desc' : 'asc';

        const pageNum = Math.max(1, Number(url.searchParams.get('page') ?? 1));
        const take = Math.min(
            100,
            Math.max(1, Number(url.searchParams.get('perPage') ?? 12))
        );
        const skip = (pageNum - 1) * take;

        const all = url.searchParams.get('all') === 'true';

        const allowedOrderFields = ['question', 'createdAt', 'updatedAt'];
        const orderByField = allowedOrderFields.includes(url.searchParams.get('orderBy') ?? '')
            ? (url.searchParams.get('orderBy') as keyof Prisma.FlashcardOrderByWithRelationInput)
            : 'question';

        if (all) {
            const items = await prisma.flashcard.findMany({
                where: { userId },
                orderBy: { [orderByField]: order }
            });

            return NextResponse.json({
                items,
                totalCount: items.length,
                all: true
            });
        }

        const whereClause: Prisma.FlashcardWhereInput = {
            userId,
            ...(search
                ? { question: { contains: search, mode: 'insensitive' } }
                : {})
        };

        const [items, totalCount] = await Promise.all([
            prisma.flashcard.findMany({
                where: whereClause,
                orderBy: { [orderByField]: order },
                skip,
                take,
                include: {
                    Note: true,
                    decks: true,
                    _count: true
                }
            }),
            prisma.flashcard.count({ where: whereClause })
        ]);

        return NextResponse.json({
            items,
            totalCount,
            page: pageNum,
            perPage: take,
            totalPages: Math.ceil(totalCount / take)
        });
    } catch (error) {
        console.error('Error in GET /api/resources/flashcards:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}


export async function POST(request: Request) {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })

    const req = await request.json()
    const payload = {
        question: req.question,
        answers: req.answers,
        correctAnswers: req.correctAnswers
    };
    const flashcard = await prisma.flashcard.create({
        data: { 
            ...payload, userId: session.user.id, 
            decks: { connect: {id: req.deckId} } 
        },

    })

    if (!flashcard) {
        return NextResponse.json({ error: 'Error creating flashcard' }, { status: 500 });
    }

    return NextResponse.json(flashcard, { status: 201 })
}

