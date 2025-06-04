'use client'

import { Button } from "@/components/Button"
import FormErrorMessage from "@/components/FormErrorMessage"
import { InputField } from "@/components/InputField"
import { Session } from "@/config/next-auth"
import { ChangePasswordForm, changePasswordSchema, deleteAccountSchema } from "@/schemas/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

export default function SecurityPage() {
    const session = useSession() as { data: Session }
    const accounts = session?.data?.accounts
    const isCredentials = accounts?.includes('credentials')
    const [showForm, setShowForm] = useState(false)
    const [showDeleteForm, setShowDeleteForm] = useState(false)
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [deleteError, setDeleteError] = useState<string | null>(null)
    const [passwordToDelete, setPasswordToDelete] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ChangePasswordForm>({
        resolver: zodResolver(changePasswordSchema),
    })

    const onSubmit = handleSubmit(async (data) => {
        setError(null)
        setSuccess(null)
        try {
            const res = await fetch(`/api/user/change-password?firstTime=${!isCredentials}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                }),
            })

            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err?.message || 'Error al cambiar la contraseña')
            }

            setSuccess('Contraseña actualizada correctamente')
            reset()
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error desconocido')
        }
    })

    const handleDeleteAccount = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setDeleteError(null)
        const formData = new FormData(event.currentTarget)
        const password = formData.get('password') as string

        if (!password) {
            setDeleteError('Por favor ingresa tu contraseña')
            return
        }

        setPasswordToDelete(password)
        setShowDeleteConfirmation(true)
    }

    const confirmDeleteAccount = async () => {
        setIsDeleting(true)
        try {
            const res = await fetch('/api/user/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: passwordToDelete }),
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err?.message || 'Error al eliminar la cuenta')
            }

            router.push('/goodbye')
        } catch (e) {
            setDeleteError(e instanceof Error ? e.message : 'Error desconocido')
            setShowDeleteConfirmation(false)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Seguridad de la Cuenta</h2>
            <div className="space-y-6 px-80">
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Contraseña</h3>

                    {!showForm ? (
                        <Button
                            onClick={() => {
                                setShowForm(true)
                                setError(null)
                                setSuccess(null)
                            }}
                        >
                            Cambiar Contraseña
                        </Button>
                    ) : (
                        <form onSubmit={onSubmit} className="space-y-4">
                            {isCredentials && (
                                <div>
                                    <InputField
                                        type="password"
                                        label="Contraseña actual"
                                        {...register('currentPassword')}
                                    />
                                </div>
                            )}

                            <div>
                                <InputField
                                    type="password"
                                    label="Nueva contraseña"
                                    {...register('newPassword')}
                                />
                                {errors.newPassword && (
                                    <FormErrorMessage>{errors.newPassword.message}</FormErrorMessage>
                                )}
                            </div>

                            <div>
                                <InputField
                                    type="password"
                                    label="Confirmar nueva contraseña"
                                    {...register('confirmPassword')}
                                />
                                {errors.confirmPassword && (
                                    <FormErrorMessage>
                                        {errors.confirmPassword.message}
                                    </FormErrorMessage>
                                )}
                            </div>

                            {error && (
                                <FormErrorMessage className="mt-2 text-sm">
                                    {error}
                                </FormErrorMessage>
                            )}
                            {success && (
                                <p className="text-green-600 font-medium mt-2">{success}</p>
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                                <Button
                                    variant="secondary"
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => {
                                        reset()
                                        setShowForm(false)
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Cambiando...' : 'Guardar'}
                                </Button>
                            </div>

                        </form>
                    )}
                    {showDeleteConfirmation && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                                <h3 className="text-lg font-semibold text-red-600 mb-4">
                                    ¿Estás absolutamente seguro?
                                </h3>
                                <p className="text-gray-700 mb-4">
                                    Esta acción no se puede deshacer. Todos tus datos serán eliminados permanentemente
                                    de nuestros servidores.
                                </p>

                                <div className="flex justify-end gap-3">
                                    <Button
                                        variant="secondary"
                                        onClick={() => setShowDeleteConfirmation(false)}
                                        disabled={isDeleting}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={confirmDeleteAccount}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? 'Eliminando...' : 'Confirmar Eliminación'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="bg-red-50 p-6 rounded-lg border border-red-200 mt-10 space-y-4">
                        <h3 className="text-lg font-semibold text-red-800">Eliminar Cuenta</h3>

                        <p className="text-red-700 text-sm leading-relaxed">
                            Esta acción eliminará <span className="font-semibold">permanentemente</span> tu cuenta y todos los datos asociados.
                        </p>

                        {!showDeleteForm ? (
                            <Button
                                variant="danger"
                                onClick={() => {
                                    setShowDeleteForm(true)
                                    setDeleteError(null)
                                }}
                            >
                                Eliminar Cuenta
                            </Button>
                        ) : (
                            <form onSubmit={handleDeleteAccount} className="space-y-4">
                                <div>
                                    <InputField
                                        type="password"
                                        label="Confirma tu contraseña para eliminar la cuenta"
                                        name="password"
                                    />
                                    {errors.currentPassword && (
                                        <FormErrorMessage>
                                            {errors.currentPassword.message}
                                        </FormErrorMessage>
                                    )}
                                </div>

                                {deleteError && (
                                    <FormErrorMessage className="text-sm">
                                        {deleteError}
                                    </FormErrorMessage>
                                )}

                                <div className="flex justify-end gap-3 pt-2">
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        onClick={() => setShowDeleteForm(false)}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button variant="danger" type="submit">
                                        Confirmar Eliminación
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}
