'use client'

import { Button } from "@/components/Button";
import { Loader } from "@/components/Loader";
import { Tab } from "@/types/enums";
import { FullDeck, FullFlashcard, FullNote } from "@/types/resources";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

// Definimos el tipo real esperado en divisions
type Division = { tema: string; texto: string };

export default function NoteValidate({
    data,
    handleValidate,
    setItem
}: {
    data: FullNote;
    handleValidate: (data: FullNote) => Promise<FullNote>;
    setItem: Dispatch<
        SetStateAction<{
            data: FullNote | FullDeck | FullFlashcard | null;
            dataType: Tab.Decks | Tab.Flashcards | Tab.Notes;
        } | null>
    >;
}) {
    const [loading, setLoading] = useState(false);
    const [note, setNote] = useState<FullNote>(data);
    const [divisions, setDivisions] = useState<Division[]>([]);

    useEffect(() => {
        const newDivisions: Division[] = Array.isArray(note.divisions)
            ? (note.divisions as { tema: string, texto: string }[]).filter(
                (d): d is Division =>
                    d && typeof d === "object" && "tema" in d && "texto" in d
            )
            : [];

        setDivisions(newDivisions);
    }, [note])

    const handleValidation = async () => {
        if (note.validated || loading) return;
        setLoading(true);
        const validatedNote = await handleValidate(note);
        setNote(validatedNote);
        setItem({ data: validatedNote, dataType: Tab.Notes });
        setLoading(false);
    };

    return (
        <section>
            {/* Encabezado con estado de validación */}
            <div className="flex items-center justify-between mb-6">
                <h1
                    className={`text-2xl font-bold tracking-tight ${note.validated ? "text-green-700" : "text-red-700"
                        }`}
                >
                    {note.validated ? "Nota validada" : "Nota sin validar"}
                </h1>

                <span
                    className={`inline-block px-4 py-1 text-sm font-medium rounded-full border transition-colors
                    ${note.validated
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-red-100 text-red-700 border-red-200"
                        }`}
                >
                    {note.validated ? "Validada" : "Sin validar"}
                </span>
            </div>

            {/* Mostrar reason si existe y no está validada */}
            {!note.validated && note.reason && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h2 className="text-sm font-semibold text-yellow-800 mb-1">
                        Motivo:
                    </h2>
                    <p className="text-sm text-yellow-700">{note.reason}</p>
                </div>
            )}

            {/* Botón de validar */}
            {
                !note.validated && divisions.length === 0 && (
                    <div className="mb-6">
                        <Button
                            onClick={!note.validated ? handleValidation : undefined}
                            disabled={note.validated || loading}
                            className={`px-6 py-2 rounded-lg shadow font-medium transition-colors duration-200
                    ${note.validated
                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed hover:bg-gray-300"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800"
                                }`}
                        >
                            {note.validated ? "Validada" : loading ? "Validando..." : "Validar"}
                        </Button>
                    </div>
                )
            }


            {/* Loader centrado */}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-xl">
                    <Loader />
                </div>
            )}

            {/* Divisiones */}
            {divisions.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Divisiones detectadas
                    </h2>
                    <ul className="space-y-4">
                        {divisions.map((division, index) => (
                            <li
                                key={index}
                                className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
                            >
                                <h3 className="text-base font-semibold text-gray-700 mb-1">
                                    {division.tema}
                                </h3>
                                <p className="text-sm text-gray-600">{division.texto}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
}
