'use client'

import { AuthForm } from "@/components/AuthForm"
import { Button } from "@/components/Button"
import FormErrorMessage from "@/components/FormErrorMessage"
import { InputField } from "@/components/InputField"
import Link from "next/link"

import { useForm } from "react-hook-form"

export default function ForgotPassword() {
    const { register, formState: { errors }, handleSubmit } = useForm()

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
                    <InputField {...register('email', { required: { message: 'El correo electrónico es requerido', value: true } })} label="Correo electrónico" />
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

