import { auth } from '@/auth';
import { prisma } from '@/config/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

    const userId = session.user.id

    const url = new URL(req.url);
    const search = url.searchParams.get('search') ?? '';
    const order = url.searchParams.get('order') === 'desc' ? 'desc' : 'asc';
    const pageNum = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10));
    const take = Math.max(1, parseInt(url.searchParams.get('perPage') ?? '12', 10));
    const skip = (pageNum - 1) * take;
    const all = url.searchParams.get('all') === 'true';

    if (all) {
        const items = await prisma.flashcard.findMany({
            where: { userId },
            orderBy: { question: order }
        });
        return NextResponse.json({ items });
    }

    const whereClause: any = {
        userId,
        ...(search ? { question: { contains: search, mode: 'insensitive' } } : {})
    };

    const [items, totalCount] = await Promise.all([
        prisma.flashcard.findMany({
            where: whereClause,
            orderBy: { question: order },
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

    return NextResponse.json({ items, totalCount });
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

