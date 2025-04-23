import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/config/prisma'

export async function PUT(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            )
        }

        const formData = await req.formData()
        const image = formData.get('image') as File | null
        const fullname = formData.get('fullname') as string

        const updateData: any = {
            name: fullname,
        }

        // Handle image upload
        if (image) {
            const bytes = await image.arrayBuffer()
            updateData.imageBlob = Buffer.from(bytes)
            updateData.imageUrl = null // Clear any existing URL when uploading a blob
        }

        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: updateData
        })

        return NextResponse.json({
            user: {
                name: updatedUser.name,
                email: updatedUser.email,
                image: updatedUser.image || updatedUser.imageBlob// Prefer URL if exists
            }
        })
    } catch (error) {
        console.error('Error al actualizar el perfil:', error)
        return NextResponse.json(
            { error: 'Error al actualizar el perfil' },
            { status: 500 }
        )
    }
}
