'use client'

// Components
import FormErrorMessage from '@/shared/atoms/FormErrorMessage'
import { InputField } from '@/shared/atoms/InputField'
import { Button } from '@/shared/atoms/Button'
// Next.js
import Link from 'next/link'
import Image from 'next/image'
// Schemas
import { UpdateProfileFormData, updateProfileSchema } from '@/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
// Hooks
import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'


function useImagePreview(initialUrl: string | null) {
    const [preview, setPreview] = useState<string | null>(initialUrl)
    const [file, setFile] = useState<File | null>(null)
    const originalImageRef = useRef(initialUrl)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0]
        if (selected && selected.type.startsWith('image/')) {
            const objectUrl = URL.createObjectURL(selected)
            setFile(selected)
            setPreview(objectUrl)
        }
    }

    const reset = () => {
        if (preview?.startsWith('blob:')) {
            URL.revokeObjectURL(preview)
        }
        setFile(null)
        setPreview(originalImageRef.current)
    }

    useEffect(() => {
        return () => {
            if (preview?.startsWith('blob:')) {
                URL.revokeObjectURL(preview)
            }
        }
    }, [preview])

    return { preview, file, handleChange, reset }
}

export default function UpdateProfilePage() {
    const { data: session, status, update } = useSession()
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)

    const user = session?.user
    const { preview, file: selectedImage, handleChange, reset } = useImagePreview(user?.image || null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<UpdateProfileFormData>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: { fullname: user?.name || '' },
    })

    useEffect(() => {
        if (user?.name) {
            setValue('fullname', user.name)
        }
    }, [user, setValue])

    if (status === 'loading') return <p className="text-gray-600">Cargando...</p>
    if (!session) return <p className="text-gray-600">No autenticado</p>

    const onSubmit = handleSubmit(async (formData) => {

        if (formData.fullname === user?.name && !selectedImage) {
            router.push('/home/account')
            return
        }

        try {
            const data = new FormData()
            data.append('fullname', formData.fullname)
            if (selectedImage) {
                data.append('image', selectedImage)
            }

            const res = await fetch('/api/user/update', {
                method: 'PUT',
                body: data,
            })

            if (!res.ok) {
                let msg = 'Error al actualizar el perfil'
                try {
                    const err = await res.json()
                    msg = err?.error || msg
                } catch { }
                throw new Error(msg)
            }

            await update({ user: { name: formData.fullname } })
            setError(null)
            router.push('/home/account')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido')
        }
    })

    return (
        <div className="max-w-2xl mx-auto px-6 py-8 bg-white rounded-xl shadow-md space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Actualizar Información</h2>

            <form onSubmit={onSubmit} className="space-y-6">
                {/* Imagen de perfil */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-28 h-28">
                        <Image
                            src={preview || `/api/user/image?ts=${Date.now()}`}
                            alt="Imagen de perfil"
                            fill
                            className="rounded-full object-cover border-2 border-gray-300"
                        />
                    </div>
                    <InputField
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full text-sm text-gray-700"
                        label="Cambiar imagen"
                    />
                </div>

                {/* Campos del formulario */}
                <div className="space-y-2">
                    <InputField
                        {...register('fullname')}
                        type="text"
                        label="Nombre completo"
                    />
                    {errors.fullname && (
                        <FormErrorMessage>{errors.fullname.message}</FormErrorMessage>
                    )}
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                </div>

                {/* Botones */}
                <div className="flex justify-end gap-4 pt-4">
                    <Link href="/home/account" onClick={() => reset()}>
                        <Button variant="secondary" disabled={isSubmitting}>
                            Cancelar
                        </Button>
                    </Link>
                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
