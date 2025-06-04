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
import { useRouter, useSearchParams } from "next/navigation"

// Actions
import { doCredentialsLogin } from "@/actions"

// Schemas and Utils
import { zodResolver } from "@hookform/resolvers/zod"
import { SignInFormData, signInSchema } from "@/schemas/auth"
import MagicLinkLogin from "@/components/MagicLinkLogin"
import Captcha from "@/components/Captcha"

export default function Login() {
    const { register, formState: { errors }, handleSubmit } = useForm<SignInFormData>({ resolver: zodResolver(signInSchema) })
    const [error, setError] = useState<string | null>(null)
    const [captchaToken, setCaptchaToken] = useState<string | null>(null)
    const router = useRouter()
    const searchParams = useSearchParams()
    const message = searchParams.get('message')

    const onSubmit = handleSubmit(async data => {
        try {
            if (!captchaToken) {
                setError('Debes completar el captcha')
                return
            }

            const response = await doCredentialsLogin({
                email: data.email,
                password: data.password,
                rememberMe: data.rememberMe,
                captchaToken: captchaToken
            })

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
            {message && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                    {message}
                </div>
            )}
            <form onSubmit={onSubmit}>
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error === 'INVALID_CREDENTIALS' && 'El email o la contraseña son incorrectos'}
                        {error === 'EMAIL_NOT_VERIFIED' && (
                            <div>
                                <p className="font-medium">Tu email aún no está verificado</p>
                                <p className="text-sm mt-1">
                                    Te hemos enviado un nuevo correo de verificación.
                                    Por favor, revisa tu bandeja de entrada y sigue las instrucciones.
                                </p>
                                <p className="text-sm mt-1">
                                    Si no encuentras el correo, revisa tu carpeta de spam.
                                </p>
                            </div>
                        )}
                        {error !== 'INVALID_CREDENTIALS' && error !== 'EMAIL_NOT_VERIFIED' && error}
                    </div>
                )}
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
                <Captcha onVerify={(token) => setCaptchaToken(token)} />
                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                        <input
                            {...register('rememberMe')}
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="rememberMe" className="ml-2 text-sm text-white">
                            Recordarme
                        </label>
                    </div>
                    <div className="text-sm">
                        <Link href="/auth/forgot-pass" className="font-medium text-white underline hover:opacity-100 ease-in-out transition-all opacity-90">
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
            <MagicLinkLogin />
            <p className="mt-4 text-center text-sm text-white">
                ¿No tienes una cuenta?{" "}
                <Link href="/auth/register" className="font-medium text-white underline hover:opacity-100 ease-in-out transition-all opacity-90">
                    Regístrate
                </Link>
            </p>
        </AuthForm>
    );
}
