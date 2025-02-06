import Link from 'next/link'

export default function ProfilePage() {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Tu Perfil</h2>
                <Link
                    href="/account/profile/update"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Editar Perfil
                </Link>
            </div>

            <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700">Nombre completo</h3>
                    <p className="text-gray-600">John Doe</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700">Correo electrónico</h3>
                    <p className="text-gray-600">john@example.com</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700">Teléfono</h3>
                    <p className="text-gray-600">+1 234 567 890</p>
                </div>
            </div>
        </div>
    )
}