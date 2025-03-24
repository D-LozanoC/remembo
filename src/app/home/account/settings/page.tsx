export default function SettingsPage() {
    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Configuración de la Cuenta</h2>

            <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Preferencias</h3>
                    <p className="text-gray-600">Idioma: Español</p>
                    <p className="text-gray-600">Zona horaria: UTC-5</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Notificaciones</h3>
                    <p className="text-gray-600">Recibir notificaciones por correo electrónico</p>
                    <p className="text-gray-600">Notificaciones push activadas</p>
                </div>
            </div>
        </div>
    )
}