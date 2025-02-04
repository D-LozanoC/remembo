'use client'

import { AuthForm } from "@/components/AuthForm"
import { Button } from "@/components/Button"
import FormErrorMessage from "@/components/FormErrorMessage"
import { InputField } from "@/components/InputField"
import { Separator } from "@/components/Separator"
import { SocialLogin } from "@/components/SocialLogin"
import Link from "next/link"
import { useForm } from "react-hook-form"

export default function Login() {
    const { register, formState: { errors }, handleSubmit } = useForm()

    const onSubmit = handleSubmit(data => {
        console.log(data)
    })
    return (
        <AuthForm title="¡Bienvenido de nuevo!" subtitle="Inicia sesión en tu cuenta">
            <form onSubmit={onSubmit}>
                <div className="space-y-2">
                    <InputField
                        {...register('email', { required: { message: 'El correo electrónico es requerido', value: true } })}
                        label="Correo electrónico"
                    />
                    {errors.email && <FormErrorMessage>{errors.email.message as string}</FormErrorMessage>}
                </div>
                <div className="space-y-2">
                    <InputField
                        {...register('password', { required: { message: 'La contraseña es requerida', value: true } })}
                        label="Contraseña"
                    />
                    {errors.password && <FormErrorMessage>{errors.password.message as string}</FormErrorMessage>}
                </div>
                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                            Recordarme
                        </label>
                    </div>
                    <div className="text-sm">
                        <Link href="/auth/forgot-pass" className="font-medium text-indigo-600 hover:text-indigo-500">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                </div>
                <Button
                    type="submit"
                    className="w-full bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 rounded-md py-3 mt-6 text-lg"
                >
                    Iniciar sesión
                </Button>
            </form>
            <Separator text="o" />
            <SocialLogin />
            <p className="mt-4 text-center text-sm text-gray-600">
                ¿No tienes una cuenta?{" "}
                <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Regístrate
                </Link>
            </p>
        </AuthForm>
    );
}
