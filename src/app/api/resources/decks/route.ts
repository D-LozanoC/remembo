import { auth } from '@/auth';
import { prisma } from '@/config/prisma';
import { Prisma, Subjects } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const session = await auth();
    if (!session) return NextResponse.error();
    if (!session.user) return NextResponse.error();

    const url = new URL(req.url);
    const search = url.searchParams.get('search') ?? '';
    const subjectFilter = url.searchParams.get('subject') ?? '';
    const order = url.searchParams.get('order') === 'desc' ? 'desc' : 'asc';
    const pageNum = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10));
    const take = Math.max(1, parseInt(url.searchParams.get('perPage') ?? '12', 10));
    const skip = (pageNum - 1) * take;
    const allItems = url.searchParams.get('all') === 'true';

    if (allItems) {
        const items = await prisma.deck.findMany({
            where: { userId: session.user.id },
            orderBy: { title: order }
        });
        return NextResponse.json({ items, totalCount: items.length });
    }

    const whereClause: Prisma.DeckWhereInput | undefined = {
        userId: session.user.id,
        ...(search ? { title: { contains: search, mode: 'insensitive' } } : {})
    };

    if (subjectFilter) whereClause.subject = subjectFilter as Subjects;


    const [items, totalCount] = await Promise.all([
        prisma.deck.findMany({
            where: whereClause,
            orderBy: { title: order },
            skip,
            take,
            include: {
                flashcards: true
            }
        }),
        prisma.deck.count({ where: whereClause })
    ]);

    return NextResponse.json({ items, totalCount });
}

export async function POST(request: Request) {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { title, topic, subject } = await request.json()

    if (!title || !topic || !subject) {
        return NextResponse.json({ error: 'Faltan campos por llenar' }, { status: 400 })
    }

    const deck = await prisma.deck.create({
        data: { title, topic, subject, userId: session.user.id }
    })

    return NextResponse.json(deck, { status: 201 })
}

export async function PATCH(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

    const { id, subject, title, topic } = await req.json();

    if (!id || !subject || !title || !topic) return NextResponse.json({ error: 'Faltan campos por llenar' }, { status: 400 });

    const updateData = {
        subject,
        title,
        topic
    };

    const deck = await prisma.deck.update({
        where: { id },
        data: updateData
    });

    return NextResponse.json(deck, { status: 200 });
}
