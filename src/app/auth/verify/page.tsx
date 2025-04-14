'use client'

import { Button, CircleLoader } from '@/shared/components'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function VerifyPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [error, setError] = useState<string | null>(null)
    const token = searchParams.get('token')

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setError('Token no proporcionado')
                setStatus('error')
                return
            }

            try {
                const response = await fetch(`/api/auth/verify?token=${token}`)
                const data = await response.json()

                if (!response.ok) {
                    setError(data.error || 'Error al verificar el email')
                    setStatus('error')
                    return
                }

                setStatus('success')

                // Redirigir al login después de 5 segundos
                setTimeout(() => {
                    router.push('/auth/login?message=Email verificado correctamente. Por favor, inicia sesión.')
                }, 5000)
            } catch (err) {
                console.error('Error al verificar el email:', err)
                setError('Error al verificar el email')
                setStatus('error')
            }
        }

        verifyEmail()
    }, [token, router])

    if (status === 'error') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Error de Verificación
                        </h2>
                        <p className="mt-2 text-center text-sm text-red-600">
                            {error}
                        </p>
                        <div className="mt-4 text-center">
                            <Link href="/auth/login">
                                <Button variant="primary">
                                    Volver al inicio de sesión
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            ¡Email Verificado!
                        </h2>
                        <div className="mt-4 space-y-4 text-center">
                            <div className="flex justify-center">
                                <svg className="h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-600">
                                Tu email ha sido verificado correctamente.
                            </p>
                            <p className="text-sm text-gray-600">
                                Te hemos enviado un email de bienvenida.
                            </p>
                            <p className="text-sm text-gray-600">
                                Serás redirigido al inicio de sesión en unos segundos...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Verificando tu email
                    </h2>
                    <div className="mt-4 flex justify-center">
                        <CircleLoader />
                    </div>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Por favor, espera mientras verificamos tu dirección de correo electrónico...
                    </p>
                </div>
            </div>
        </div>
    )
}
