import React from 'react'
import { FaEnvelope as EnvelopeIcon } from "react-icons/fa";

const Page = () => {
    return (
        <div className="min-h-screen bg-indigo-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full space-y-6 transition-all">
                {/* Icono principal */}
                <div className="flex justify-center">
                    <EnvelopeIcon className="h-16 w-16 text-indigo-600" />
                </div>

                {/* Contenido principal */}
                <div className="space-y-4 text-center">
                    <h1 className="text-3xl font-bold text-indigo-900">Revisa tu correo</h1>
                    <p className="text-indigo-700">
                        Un enlace de acceso ha sido enviado a
                        <span className="font-semibold text-indigo-900 block mt-1">
                            tu dirección de correo electrónico
                        </span>
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
                <p className="text-sm text-indigo-400">Remembo</p>
            </div>
        </div>
    )
}

export default Page
