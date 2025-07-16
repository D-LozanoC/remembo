import { auth } from '@/auth'
import { prisma } from '@/config/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    const session = await auth()

    if (!session?.user?.email) {
        return NextResponse.json(
            { error: 'No autorizado' },
            { status: 401 }
        )
    }

    const id = session.user.id

    const user = await prisma.user.findUnique({
        where: { id },
        select: { imageBlob: true, image: true },
    })

    if (!user) {
        return new NextResponse('Usuario no encontrado', { status: 404 })
    }

    if (user.imageBlob) {
        return new NextResponse(user.imageBlob, {
            headers: {
                'Content-Type': 'image/png',
                'Content-Length': (user.imageBlob as Buffer).length.toString()
            },
        })
    }

    // Condicional que prioriza la imagen URL
    if (user.image) {
        const res = await fetch(user.image)
        if (!res.ok) {
            return new NextResponse('Error al obtener la imagen externa', { status: 502 })
        }

        const buffer = await res.arrayBuffer()

        return new NextResponse(Buffer.from(buffer), {
            headers: {
                'Content-Type': res.headers.get('Content-Type') || 'image/jpeg',
            },
        })
    }

    return new NextResponse('Imagen no encontrada', { status: 404 })
}