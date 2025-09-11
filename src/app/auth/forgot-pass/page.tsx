'use client'

// Components
import Link from "next/link"
import { Button } from "@/shared/atoms/Button"
import { AuthForm } from "@/shared/sections/auth/components/AuthForm"
import { InputField } from "@/shared/atoms/InputField"
import FormErrorMessage from "@/shared/atoms/FormErrorMessage"

// Hooks
import { useForm } from "react-hook-form"

// Schemas and Utils
import { zodResolver } from "@hookform/resolvers/zod"
import { ForgotFormData, forgotSchema } from "@/schemas/auth"
import { useState } from "react"
import { forgotPassword } from "@/actions/auth"
import { redirect } from "next/navigation"

export default function ForgotPassword() {
    const { register, formState: { errors }, handleSubmit } = useForm<ForgotFormData>({ resolver: zodResolver(forgotSchema) })
    const [error, setError] = useState<string | null>(null)

    const onSubmit = handleSubmit(async data => {
        const response = await forgotPassword(data.email)
        if (!response.success) {
            setError(response.message)
            return
        }
        redirect('/verify-request')
    })


    return (
        <AuthForm
            title="¿Olvidaste tu contraseña?"
            subtitle="Ingresa tu correo electrónico y te enviaremos instrucciones para recuperar tu cuenta"
        >
            <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                <div>
                    <InputField {...register('email')} label="Correo electrónico" />
                    {errors.email && <FormErrorMessage>{errors.email.message as string}</FormErrorMessage>}
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                </div>

                <Button type="submit">Recuperar contraseña</Button>
            </form>
            <p className="mt-4 text-center text-sm">
                <Link href="/auth/login" className="font-medium text-white underline hover:opacity-100 ease-in-out transition-all opacity-90">
                    Volver al inicio de sesión
                </Link>
            </p>
        </AuthForm>
    )
}

