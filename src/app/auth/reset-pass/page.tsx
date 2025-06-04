'use client'

// Components
import Link from "next/link"
import { Button } from "@/components/Button"
import { AuthForm } from "@/components/AuthForm"
import { InputField } from "@/components/InputField"
import FormErrorMessage from "@/components/FormErrorMessage"

// Hooks
import { useForm } from "react-hook-form"

// Schemas and Utils
import { zodResolver } from "@hookform/resolvers/zod"
import { ResetFormData, resetSchema } from "@/schemas/auth"
import { useState } from "react"
import { redirect, useSearchParams } from "next/navigation"
import { resetPassword } from "@/actions/auth"
import SuccessAlert from "@/components/SuccessAlert"

export default function ResetPassword() {
    const { register, formState: { errors }, handleSubmit } = useForm<ResetFormData>({ resolver: zodResolver(resetSchema) })

    const searchParams = useSearchParams()
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const token = searchParams.get('token')

    if (!token) redirect('/auth/login')


    const onSubmit = handleSubmit(async data => {
        const { password } = data
        const response = await resetPassword(token, password)
        if (!response.success) {
            setError(response.message)
            return
        }
        setMessage(response.message)
        setShowSuccessAlert(true)
    })

    return (
        <AuthForm title="Restablecer contraseña" subtitle="Ingresa tu nueva contraseña">
            <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                <div className="space-y-2">
                    <InputField
                        {...register('password')}
                        type="password"
                        label="Nueva contraseña"
                    />
                    {errors.password && <FormErrorMessage>{errors.password.message as string}</FormErrorMessage>}
                </div>
                <div className="space-y-2">
                    <InputField
                        {...register('confirmPassword')}
                        type="password"
                        label="Confirmar nueva contraseña"
                    />
                    {errors.confirmPassword && <FormErrorMessage>{errors.confirmPassword.message as string}</FormErrorMessage>}
                </div>
                <Button type="submit">Restablecer contraseña</Button>
            </form>

            {error && <FormErrorMessage>{error}</FormErrorMessage>}
            {message && <p>{message}</p>}

            <p className="mt-4 text-center text-sm text-gray-600">
                <Link href="/auth/login" className="font-medium text-white underline hover:opacity-100 ease-in-out transition-all opacity-90">
                    Volver al inicio de sesión
                </Link>
            </p>
            <SuccessAlert
                show={showSuccessAlert}
                title='¡Cambio de contraseña exitoso!'
                description={message ?? "Tu contraseña ha sido cambiada exitosamente"}
                buttonText='Continuar al login'
                url='/auth/login'
            />
        </AuthForm>
    )
}

