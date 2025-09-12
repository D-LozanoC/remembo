'use client'

// Components

// Hooks
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter, useSearchParams } from "next/navigation"

// Actions
import { doCredentialsLogin } from "@/actions"

// Schemas and Utils
import { zodResolver } from "@hookform/resolvers/zod"
import { SignInFormData, signInSchema } from "@/schemas/auth"
import { AuthForm } from "./AuthForm"
import { InputField } from "@/components/InputField"
import Captcha from "./Captcha"
import { DecoratedLink } from "@/shared/atoms/DecoratedLink"
import { Button } from "@/components/Button"
import MagicLinkLogin from "./MagicLinkLogin"
import { SocialLogin } from "./SocialLogin"

export default function LoginForm() {
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
            console.error('Login error:', error)
        }
    })

    return (
        <AuthForm title="¡Bienvenido de nuevo!" subtitle="Inicia sesión en tu cuenta">
            {message && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                    {message}
                </div>
            )}
            <form onSubmit={onSubmit} className="pt-4 space-y-3">
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
                <InputField
                    {...register('email')}
                    type="email"
                    label="Correo electrónico"
                    error={errors.email}
                />
                <InputField
                    {...register('password')}
                    type="password"
                    label="Contraseña"
                    error={errors.password}
                />
                <Captcha onVerify={(token) => setCaptchaToken(token)} />
                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                        <input
                            {...register('rememberMe')}
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="rememberMe" className="ml-2 text-sm text-black">
                            Recordarme
                        </label>
                    </div>
                    <div className="text-sm">
                        <DecoratedLink href="/auth/forgot-pass">
                            ¿Olvidaste tu contraseña?
                        </DecoratedLink>
                    </div>
                </div>
                <Button
                    type="submit"
                    name="action"
                    value="credentials"
                >
                    Iniciar sesión
                </Button>
            </form>
            <MagicLinkLogin />
            <SocialLogin />
            <p className="mt-4 text-center text-sm text-gray-600">
                ¿No tienes una cuenta?{" "}
                <DecoratedLink href="/auth/register">
                    Regístrate aquí
                </DecoratedLink>
            </p>
        </AuthForm>
    );
}