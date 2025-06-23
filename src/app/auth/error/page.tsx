'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/Button'
import { DecoratedLink } from '@/shared/atoms/DecoratedLink'

export default function ErrorPage() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    let errorMessage = 'Ha ocurrido un error durante la autenticación'
    let action = null

    // Personalizar mensajes según el tipo de error
    switch (error) {
        case 'EMAIL_NOT_VERIFIED':
            errorMessage = 'Tu email aún no está verificado'
            action = (
                <div className="mt-4 space-y-4">
                    <p className="text-sm text-gray-600">
                        Te hemos enviado un nuevo correo de verificación.
                        Por favor, revisa tu bandeja de entrada y sigue las instrucciones para verificar tu cuenta.
                    </p>
                    <p className="text-sm text-gray-600">
                        Si no encuentras el correo, revisa tu carpeta de spam.
                    </p>
                    <p className="text-sm text-gray-600">
                        ¿No recibiste el correo?{' '}
                        <Link href="/auth/resend-verification" className="text-indigo-600 hover:text-indigo-500">
                            Enviar de nuevo
                        </Link>
                    </p>
                </div>
            )
            break
        case 'INVALID_CREDENTIALS':
            errorMessage = 'El email o la contraseña son incorrectos'
            action = (
                <p className="mt-2 text-sm text-gray-600">
                    ¿Olvidaste tu contraseña?{' '}
                    <DecoratedLink href="/auth/forgot-password">
                        Recuperar contraseña
                    </DecoratedLink>
                </p>
            )
            break
        // Agregar más casos según sea necesario
    }

    return (
        <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Error de Autenticación
                    </h2>
                    <div className="mt-4 text-center">
                        <p className="font-medium text-red-600">
                            {errorMessage}
                        </p>
                        {action}
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <Link href="/auth/login">
                        <Button variant="primary">
                            Volver al inicio de sesión
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
