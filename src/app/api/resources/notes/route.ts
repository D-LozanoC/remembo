import { auth } from '@/auth';
import { prisma } from '@/config/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

    const url = new URL(req.url);
    const search = url.searchParams.get('search') ?? '';
    const subjectFilter = url.searchParams.get('subject') ?? '';
    const order = url.searchParams.get('order') === 'desc' ? 'desc' : 'asc';
    const pageNum = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10));
    const take = Math.max(1, parseInt(url.searchParams.get('perPage') ?? '12', 10));
    const skip = (pageNum - 1) * take;

    const whereClause: any = {
        userId: session.user.id,
        ...(search ? { title: { contains: search, mode: 'insensitive' } } : {})

    };

    if (subjectFilter) whereClause.subject = subjectFilter;

    const [items, totalCount] = await Promise.all([
        prisma.note.findMany({
            where: whereClause,
            orderBy: { title: order },
            skip,
            take,
            select: {
                id: true,
                subject: true,
                content: true,
                title: true,
                topic: true,
                createdAt: true,
                updatedAt: true,
                _count: true,
                flashcards: {
                    include: {
                        Note: true,
                        decks: true
                    }
                }
            }
        }),
        prisma.note.count({ where: whereClause })
    ]);

    return NextResponse.json({ items, totalCount });
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

    const { subject, content, title, topic } = await req.json();

    if (!subject || !content || !title || !topic) return NextResponse.error();

    const creationData = {
        subject,
        content,
        title,
        topic,
        userId: session.user.id
    }

    // const note = await prisma.note.create({
    //     data: creationData
    // });



    return NextResponse.json(creationData, { status: 200 });
}

