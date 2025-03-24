import { verifyEmail } from '@/actions/auth'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const token = searchParams.get('token')

        if (!token) {
            return NextResponse.json(
                { error: 'Token no proporcionado' },
                { status: 400 }
            )
        }

        const result = await verifyEmail(token)

        if (!result.success) {
            return NextResponse.json(
                { error: result.message },
                { status: 400 }
            )
        }

        // Redirigir al usuario a la página de inicio con un mensaje de éxito
        return NextResponse.redirect(
            new URL(`/auth/login?message=${encodeURIComponent('Email verificado correctamente. Por favor, inicia sesión.')}`, 
            request.url)
        )
    } catch (error) {
        console.error('Error en la verificación de email:', error)
        return NextResponse.json(
            { error: 'Error al verificar el email' },
            { status: 500 }
        )
    }
}
