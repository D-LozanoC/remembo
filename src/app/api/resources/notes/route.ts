import { auth } from '@/auth';
import { prisma } from '@/config/prisma';
import { Prisma, Subjects } from '@prisma/client';
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

    const whereClause: Prisma.NoteWhereInput = {
        userId: session.user.id,
        ...(search ? { title: { contains: search, mode: 'insensitive' } } : {})

    };

    if (subjectFilter) whereClause.subject = subjectFilter as Subjects;

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
                divisions: true,
                validated: true,
                reason: true,
                _count: true,
                flashcards: {
                    include: {
                        Note: true,
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

    try {
        const note = await prisma.note.create({
            data: creationData,
            select: {
                id: true,
                subject: true,
                content: true,
                title: true,
                topic: true,
                createdAt: true,
                updatedAt: true,
                divisions: true,
                validated: true,
                reason: true,
                _count: true,
                flashcards: {
                    include: {
                        Note: true,
                    }
                }
            }
        });
        if (!note) return NextResponse.json({ error: 'Error creating note' }, { status: 500 });

        return NextResponse.json(note, { status: 200 });
    } catch (error: unknown) {
        console.error('Error creating note:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }




}

