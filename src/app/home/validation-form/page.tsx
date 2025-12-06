import { auth } from "@/auth";

export default async function ValidationForm() {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <p className="p-4 bg-blue-100 text-blue-800 rounded-xl shadow-sm text-center">
                    Por favor, inicia sesión para realizar el formulario de validación.
                </p>
            </div>
        )
    }
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
            <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-8 border border-gray-200">

                <h1 className="text-3xl font-semibold text-gray-800 text-center mb-3">
                    Formulario de Validación Tecnológica
                </h1>

                <p className="text-gray-600 text-center mb-6">
                    Este formulario utiliza la metodología <span className="font-medium">TAM (Technology Acceptance Model) </span>
                    para evaluar la aceptación y percepción sobre la tecnología desarrollada.
                </p>

                <div className="rounded-xl overflow-hidden border border-gray-300 shadow-inner">
                    <iframe
                        src="https://docs.google.com/forms/d/e/1FAIpQLSfo6kX6gOXW7mP2s2KfHqBdlwGsfZguVw3sJuZMqfkXh6hmLQ/viewform?embedded=true"
                        width="100%"
                        height="1500"
                        className="w-full"
                    >
                        Loading…
                    </iframe>
                </div>
            </div>
        </div>
    );
}
