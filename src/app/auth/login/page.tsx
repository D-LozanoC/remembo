'use client'

// Components
import Link from "next/link"
import { Button } from "@/components/Button"
import { AuthForm } from "@/components/AuthForm"
import { Separator } from "@/components/Separator"
import { InputField } from "@/components/InputField"
import { SocialLogin } from "@/components/SocialLogin"
import FormErrorMessage from "@/components/FormErrorMessage"

// Hooks
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

// Actions
import { doCredentialsLogin } from "@/actions"

// Schemas and Utils
import { zodResolver } from "@hookform/resolvers/zod"
import { SignInFormData, signInSchema } from "@/utils/schemas"

export default function Login() {
    const { register, formState: { errors }, handleSubmit } = useForm<SignInFormData>({ resolver: zodResolver(signInSchema) })
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const onSubmit = handleSubmit(async data => {
        try {
            const response = await doCredentialsLogin({ email: data.email, password: data.password })
            if (response.error) {
                setError(response.error)
                return
            }

            router.push('/home')
        } catch (error) {
            setError('Hubo un error iniciando sesión')
        }
    })

    return (
        <AuthForm title="¡Bienvenido de nuevo!" subtitle="Inicia sesión en tu cuenta">
            <form onSubmit={onSubmit}>
                {error && <div className="text-red-500 text-xs">{error}</div>}
                <div className="space-y-2">
                    <InputField
                        {...register('email')}
                        type="email"
                        label="Correo electrónico"
                    />
                    {errors.email && <FormErrorMessage>{errors.email.message as string}</FormErrorMessage>}
                </div>
                <div className="space-y-2">
                    <InputField
                        {...register('password')}
                        type="password"
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
                    name="action"
                    value="credentials"
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
