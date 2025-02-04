'use client'

import Link from "next/link"
import { AuthForm } from "@/components/AuthForm"
import { InputField } from "@/components/InputField"
import { Button } from "@/components/Button"
import { useForm } from "react-hook-form"
import FormErrorMessage from "@/components/FormErrorMessage"

export default function ResetPassword() {
    const { register, formState: { errors }, handleSubmit } = useForm()

    const onSubmit = handleSubmit(data => {
        console.log(data)
    })

    return (
        <AuthForm title="Restablecer contraseña" subtitle="Ingresa tu nueva contraseña">
            <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                <div className="space-y-2">
                    <InputField
                        {...register('password', { required: { message: 'La nueva contraseña es requerida', value: true } })}
                        label="Nueva contraseña"
                    />
                    {errors.password && <FormErrorMessage>{errors.password.message as string}</FormErrorMessage>}
                </div>
                <div className="space-y-2">
                    <InputField
                        {...register('confirmPassword', { required: { message: 'La confirmación de la nueva contraseña es requerida', value: true } })}
                        label="Confirmar nueva contraseña"
                    />
                    {errors.confirmPassword && <FormErrorMessage>{errors.confirmPassword.message as string}</FormErrorMessage>}
                </div>
                <Button type="submit">Restablecer contraseña</Button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
                <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                    Volver al inicio de sesión
                </Link>
            </p>
        </AuthForm>
    )
}

