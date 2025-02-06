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
import { ForgotFormData, forgotSchema } from "@/utils/schemas"

export default function ForgotPassword() {
    const { register, formState: { errors }, handleSubmit } = useForm<ForgotFormData>({ resolver: zodResolver(forgotSchema) })

    const onSubmit = handleSubmit(data => {
        console.log(data)
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
                </div>

                <Button type="submit">Recuperar contraseña</Button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
                <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                    Volver al inicio de sesión
                </Link>
            </p>
        </AuthForm>
    )
}

