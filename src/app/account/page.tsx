export default function DashboardPage() {
    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumen de tu cuenta</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-blue-600">Información Básica</h3>
                    <p className="mt-2 text-gray-600">Verifica y actualiza tu información personal</p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-green-600">Actividad Reciente</h3>
                    <p className="mt-2 text-gray-600">No hay actividad reciente</p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-purple-600">Estado de Cuenta</h3>
                    <p className="mt-2 text-gray-600">Cuenta verificada</p>
                </div>
            </div>
        </div>
    )
}