'use client'

import { Button } from "@/components/Button";
import FormErrorMessage from "@/components/FormErrorMessage";
import { Loader } from "@/components/Loader";
import { FullNote } from "@/types/resources";
import { Flashcard } from "@prisma/client";
import { useState } from "react";

export default function NoteDerivate({
    data,
    handleDerivateFlashcards
}: {
    data: FullNote,
    handleDerivateFlashcards: (note: FullNote) => Promise<FullNote>
}) {
    const [loading, setLoading] = useState(false)
    const [flashcards, setFlashcards] = useState(data.flashcards || [])
    const [error, setError] = useState<string>("")

    const handleOnClick = async () => {
        setLoading(true)
        try {
            const note = await handleDerivateFlashcards(data as FullNote)
            if (!note.flashcards || note.flashcards.length === 0) {
                setError("No se generaron flashcards. Intenta nuevamente.")
                return
            }
            setFlashcards(note.flashcards)
            setError("")
        } catch (error) {
            console.error("Error deriving flashcards:", error);
            setError("Error derivando flashcards. Intenta nuevamente.")
        } finally {
            setLoading(false)
        }
    }

    const handleJSONExport = () => {
        const jsonStr = JSON.stringify(flashcards, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `flashcards_${data.title}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            {/* Loader overlay */}
            {loading && (
                <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-xl">
                    <Loader />
                </div>
            )}

            {/* Header */}
            <header className="flex items-center justify-between gap-4 ">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Derivar flashcards</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Se generará exactamente <strong>1 flashcard</strong> por cada división de la nota. Solo se permite una derivación por nota.
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 text-sm font-medium bg-gray-100 rounded-full text-gray-700">
                            Divisiones: {(data.divisions as { tema: string, texto: string }[])?.length ?? 0}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 text-sm font-medium bg-violet-50 rounded-full text-violet-700">
                            Flashcards: {flashcards.length}
                        </span>
                    </div>
                </div>

                <div className="w-full flex flex-col justify-center items-center gap-4">
                    <Button
                        className="text-gray-600 hover:text-purple-600 hover:bg-purple-100 focus:ring-purple-300 transition-colors
               disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-400 disabled:bg-gray-50
               disabled:hover:text-gray-400 disabled:hover:bg-gray-50 disabled:focus:ring-0"
                        variant="secondary"
                        onClick={handleOnClick}
                        disabled={loading || flashcards.length > 0 || (data.divisions)?.length === 0}
                        aria-disabled={loading}
                    >
                        Derivar
                    </Button>
                    <Button
                        className="text-gray-600 hover:text-purple-600 hover:bg-purple-100 focus:ring-purple-300 transition-colors
               disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-400 disabled:bg-gray-50
               disabled:hover:text-gray-400 disabled:hover:bg-gray-50 disabled:focus:ring-0"
                        variant="neutral"
                        onClick={handleJSONExport}
                        disabled={loading || flashcards.length === 0}
                        aria-disabled={loading}
                    >
                        Exportar JSON
                    </Button>
                </div>

            </header>
            {error && <FormErrorMessage className="mt-4" > {error} </FormErrorMessage>}
            <hr className="my-4 border-t border-gray-100" />

            {/* Preview (collapse nativo para no añadir JS) */}
            <details className="group bg-gray-50 p-3 rounded-md" open>
                <summary className="flex items-center justify-between cursor-pointer list-none">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.655a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Vista previa de divisiones</span>
                    </div>
                    <span className="text-xs text-gray-500 transition-transform group-open:-rotate-180">▾</span>
                </summary>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-auto p-1">
                    {(data.divisions as { tema: string, texto: string }[] || []).map((d, i) => (
                        <article key={i} className="p-3 bg-white border rounded-md shadow-sm">
                            <h4 className="text-sm font-semibold text-gray-800 truncate">{d?.tema ?? "—"}</h4>
                            <p className="mt-1 text-xs text-gray-600 preview-text">{d?.texto ?? ""}</p>
                        </article>
                    ))}
                </div>
            </details>

            {/* Flashcards grid / fallback */}
            <div className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {flashcards.length > 0 ? (
                        flashcards.map((fc: Flashcard, idx: number) => (
                            <div key={fc.id ?? fc.question ?? idx} className="p-4 bg-white border rounded-lg shadow-sm">
                                <p className="text-sm font-medium text-gray-800">{fc.question}</p>

                                <ul className="mt-3 space-y-2">
                                    {fc.answers.map((a: string, ai: number) => {
                                        const isCorrect = fc.correctAnswers?.[0] === a;
                                        return (
                                            <li
                                                key={ai}
                                                className={`flex items-start gap-2 text-sm ${isCorrect ? 'font-semibold text-violet-700' : 'text-gray-600'}`}
                                            >
                                                <span className={`flex-shrink-0 w-3 h-3 mt-1 rounded-full ${isCorrect ? 'bg-violet-600' : 'bg-gray-300'}`} />
                                                <span className="leading-tight">{a}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 rounded-md bg-yellow-50 border border-yellow-100 text-yellow-700">
                            No hay flashcards derivadas aún. Presiona <strong>Derivar</strong> para generar una flashcard por división.
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
      .preview-text {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .loader-fade-enter {
        animation: fadeIn 180ms ease-out;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>
        </div>
    )

}