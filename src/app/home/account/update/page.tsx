'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { Button, InputField, FormErrorMessage } from '@/shared/components'
import { UpdateProfileFormData, updateProfileSchema } from '@/utils/schemas'
import { zodResolver } from '@hookform/resolvers/zod'

export default function UpdateProfilePage() {
    const { register, formState: { errors }, handleSubmit } = useForm<UpdateProfileFormData>({
        resolver: zodResolver(updateProfileSchema)
    })

    const [error, setError] = useState<string | null>(null)
    const { update, data: session, status } = useSession()
    const [imagePreview, setImagePreview] = useState<string | null>(session?.user?.image || null)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const router = useRouter()

    if (status === 'loading') return <p className='text-gray-600'>Cargando...</p>
    if (!session) return <p className='text-gray-600'>No autenticado</p>
    const user = session.user

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedImage(file)
            const previewUrl = URL.createObjectURL(file)
            setImagePreview(previewUrl)
        }
    }

    const onSubmit = handleSubmit(async (formData) => {
        try {
            const data = new FormData()
            data.append('fullname', formData.fullname)
            data.append('email', formData.email)
            if (selectedImage) {
                data.append('image', selectedImage)
            }

            const response = await fetch('/api/user/update', {
                method: 'PUT',
                body: data
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Error al actualizar el perfil')
            }

            const { user } = await response.json()

            // Actualizar la sesión con los nuevos datos
            await update({
                ...session,
                user: {
                    ...session.user,
                    name: user.name,
                    email: user.email,
                    image: user.image
                }
            })

            router.push('/home/account')
            setError(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar el perfil')
        }
    })

    return (
        <div>
            <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Actualizar Información</h2>
            <form className='space-y-6' onSubmit={onSubmit}>
                {/* Imagen de perfil */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-32 h-32">
                        <Image
                            src={imagePreview || '/default-avatar.png'}
                            alt="Imagen de perfil"
                            fill
                            className="rounded-full border border-gray-300 object-cover"
                        />
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full text-sm text-gray-600"
                    />
                </div>

                {/* Campos del formulario */}
                <div>
                    <InputField
                        {...register('fullname')}
                        type='text'
                        label='Nombre completo'
                        defaultValue={user?.name as string}
                    />
                    {errors.fullname && <FormErrorMessage>{errors.fullname.message as string}</FormErrorMessage>}
                </div>
                <div>
                    <InputField
                        {...register('email')}
                        type='email'
                        label='Correo electrónico'
                        defaultValue={user?.email as string}
                    />
                    {errors.email && <FormErrorMessage>{errors.email.message as string}</FormErrorMessage>}
                </div>
                {error && <FormErrorMessage>{error}</FormErrorMessage>}

                {/* Botones */}
                <div className='flex gap-4'>
                    <Button type="submit" variant="primary" className='w-52'>
                        Guardar Cambios
                    </Button>
                    <Link href='/home/account'>
                        <Button variant="secondary">Cancelar</Button>
                    </Link>
                </div>
            </form>
        </div>
    )
}
