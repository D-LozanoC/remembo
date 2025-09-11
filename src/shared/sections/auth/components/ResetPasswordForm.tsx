'use client'

// Components
import { Button } from "@/shared/atoms/Button"
import { AuthForm } from "@/shared/sections/auth/components/AuthForm"
import { InputField } from "@/shared/atoms/InputField"
import FormErrorMessage from "@/shared/atoms/FormErrorMessage"
import { DecoratedLink } from "@/shared/atoms/DecoratedLink"

// Hooks
import { useForm } from "react-hook-form"

// Schemas and Utils
import { zodResolver } from "@hookform/resolvers/zod"
import { ResetFormData, resetSchema } from "@/schemas/auth"
import { useState } from "react"
import { redirect, useSearchParams } from "next/navigation"
import { resetPassword } from "@/actions/auth"
import SuccessAlert from "@/shared/sections/auth/components/SuccessAlert"
export default function ResetPasswordForm() {

    const { register, formState: { errors }, handleSubmit } = useForm<ResetFormData>({ resolver: zodResolver(resetSchema) })

    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    if (!token) redirect("/auth/login")

    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

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
                <InputField
                    {...register('password')}
                    type="password"
                    label="Nueva contraseña"
                    error={errors.password}
                />
                <InputField
                    {...register('confirmPassword')}
                    type="password"
                    label="Confirmar nueva contraseña"
                    error={errors.confirmPassword}
                />
                {errors.confirmPassword && <FormErrorMessage>{errors.confirmPassword.message as string}</FormErrorMessage>}
                <Button type="submit">Restablecer contraseña</Button>
            </form>

            {error && <FormErrorMessage>{error}</FormErrorMessage>}
            {message && <p>{message}</p>}

            <p className="mt-4 text-center text-sm text-gray-600">
                <DecoratedLink href="/auth/login">
                    Volver al inicio de sesión
                </DecoratedLink>
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