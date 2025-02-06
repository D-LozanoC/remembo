export default function BillingPage() {
    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Gestión de Facturación</h2>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Método de Pago</h3>
                    <p className="text-gray-600">Visa **** 1234</p>
                    <button className="mt-4 text-blue-600 hover:text-blue-700">
                        Cambiar método de pago
                    </button>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Historial de Pagos</h3>
                    <p className="text-gray-600">No hay pagos recientes</p>
                </div>
            </div>
        </div>
    )
}