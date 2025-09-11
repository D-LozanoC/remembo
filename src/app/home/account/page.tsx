import { Button } from '@/shared/atoms/Button'
import { getUser } from '@/utils/getUser'
import Link from 'next/link'
import Image from 'next/image'

export default async function ProfilePage() {
    const user = await getUser()

    if (!user) {
        return (
            <div className="max-w-2xl mx-auto py-4">
                <h2 className="text-2xl font-semibold text-gray-800">Tu Perfil</h2>
                <p className="text-gray-600">No se encontró un usuario autenticado.</p>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Encabezado */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">Tu Perfil</h2>
            </div>

            {/* Tarjeta de Información */}
            <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex items-center space-x-4">
                    {/* Imagen de perfil */}
                    <div className="relative w-16 h-16">
                        <Image
                            src={`/api/user/image?ts=${Date.now()}`}
                            alt="Foto de perfil"
                            className="rounded-full border"
                            fill
                        />
                    </div>

                    {/* Información Básica */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">{user?.name || "Nombre no disponible"}</h3>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Información Adicional */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700">Estado de la Cuenta</h3>
                <p className="text-gray-600">{user?.emailVerified ? "Verificada ✅" : "No verificada ❌"}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700">Rol de Usuario</h3>
                <p className="text-gray-600">{user?.role === 'user' ? "Usuario estándar" : "Administrador"}</p>
            </div>
            <div className="py-4">
                <Link href="/home/account/update">
                    <Button>Editar Perfil</Button>
                </Link>
            </div>
        </div>
    )
}
