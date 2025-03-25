import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/config/prisma'
import { updateProfileSchema } from '@/utils/schemas'

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
        const email = formData.get('email') as string

        // Validate the form data
        const validatedData = updateProfileSchema.parse({ fullname, email })

        // Prepare the update data
        const updateData: any = {
            name: validatedData.fullname,
            email: validatedData.email,
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
                image: updatedUser.imageUrl // Prefer URL if exists
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
