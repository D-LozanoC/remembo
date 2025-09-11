import React, { useState } from 'react'
import { Button } from '../shared/atoms/Button'
import { doMagicLinkLogin } from '@/actions'
import { ForgotFormData, forgotSchema } from '@/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { InputField } from '../shared/atoms/InputField'
import FormErrorMessage from '../shared/atoms/FormErrorMessage'
import { FaWandMagicSparkles as Magic } from "react-icons/fa6";

const MagicLinkLogin = ({ className }: { className?: string }) => {
    const { register, formState: { errors }, handleSubmit } = useForm<ForgotFormData>({ resolver: zodResolver(forgotSchema) })
    const [error, setError] = useState<string | null>(null)

    const onSubmit = handleSubmit(async data => {
        try {
            const response = await doMagicLinkLogin(data)
            if (!response.success) {
                setError(response.message)
                return
            }
            setError(response.message)
        } catch (error) {
            setError('Hubo un error iniciando sesión')
            console.error('Magic link login error:', error)
        }
    })

    return (
        <form onSubmit={onSubmit} className={className}>
            <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="space-y-2">
                    <InputField
                        {...register('email')}
                        type="email"
                        label="Correo electrónico"
                    />
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                    {errors.email && <FormErrorMessage>{errors.email.message as string}</FormErrorMessage>}
                </div>
                <Button type="submit" variant="secondary" className="flex items-center justify-center">
                    <Magic className="mr-2 h-5 w-5" />
                    <span>Magic Link</span>
                </Button>
            </div>
        </form>
    )
}

export default MagicLinkLogin
