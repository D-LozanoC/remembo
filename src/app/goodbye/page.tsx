import Link from "next/link"
import { FaArrowLeft as ArrowLeft } from "react-icons/fa"

export default function GoodbyePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white px-4">
            <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md text-center border border-gray-200">
                <div className="mb-6">
                    <h1 className="text-3xl font-extrabold text-red-600 tracking-tight">
                        Cuenta eliminada
                    </h1>
                    <p className="text-gray-700 mt-2 text-base leading-relaxed">
                        Tu cuenta y todos tus datos han sido eliminados de forma permanente.
                    </p>
                </div>

                <div className="text-sm text-gray-500 mb-8">
                    Gracias por haber sido parte de nuestra comunidad. Esperamos verte de nuevo algún día.
                </div>

                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    <ArrowLeft size={18} />
                    Volver al inicio
                </Link>
            </div>
        </div>
    )
}

