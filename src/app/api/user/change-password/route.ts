import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/config/prisma'
import { compare, hash } from 'bcrypt'

export async function PATCH(req: Request) {
    const url = new URL(req.url)
    const firstTime = url.searchParams.get('firstTime') === 'true'
    const session = await auth()

    if (firstTime) {
        try {
            const id = session?.user?.id
            if (id) {
                await prisma.account.create({
                    data: {
                        userId: id,
                        provider: "credentials",
                        type: "credentials",
                        providerAccountId: id
                    }
                })
            }

            const { newPassword } = await req.json()
            if (!newPassword) {
                return NextResponse.json(
                    { error: 'Faltan datos requeridos' },
                    { status: 400 }
                )
            }

            await prisma.user.update({
                where: { id: id },
                data: { password: await hash(newPassword, 10) }
            })

            return NextResponse.json(
                { message: 'Contraseña actualizada correctamente' },
                { status: 200 }
            )
        } catch (error) {
            console.error('Error al actualizar la contraseña:', error)
            return NextResponse.json(
                { error: 'Error al actualizar la contraseña' },
                { status: 500 }
            )
        }
    }
    try {
        // 1. Autenticación: obtenemos la sesión y verificamos usuario
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            )
        }

        // 2. Extraer y validar datos del body
        const { currentPassword, newPassword } = await req.json()
        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: 'Faltan datos requeridos' },
                { status: 400 }
            )
        }

        // 3. Recuperar usuario de la base de datos
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { password: true }
        })
        if (!user) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 404 }
            )
        }

        // 4. Verificar contraseña actual
        const isValid = await compare(currentPassword, user.password as string)
        if (!isValid) {
            return NextResponse.json(
                { error: 'Contraseña actual incorrecta' },
                { status: 400 }
            )
        }

        // 5. Hashear nueva contraseña y actualizar en la base de datos
        const newHash = await hash(newPassword, 12)
        await prisma.user.update({
            where: { email: session.user.email },
            data: { password: newHash }
        })

        // 6. Retornar respuesta exitosa
        return NextResponse.json(
            { message: 'Contraseña actualizada correctamente' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error)
        return NextResponse.json(
            { error: 'Error al actualizar la contraseña' },
            { status: 500 }
        )
    }
}
