export default function SecurityPage() {
    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Seguridad de la Cuenta</h2>

            <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Contraseña</h3>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        Cambiar Contraseña
                    </button>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Autenticación de Dos Factores</h3>
                    <p className="text-gray-600">2FA no activado</p>
                    <button className="mt-4 text-blue-600 hover:text-blue-700">
                        Activar Autenticación
                    </button>
                </div>
            </div>
        </div>
    )
}