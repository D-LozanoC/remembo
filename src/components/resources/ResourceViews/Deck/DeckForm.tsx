// src/components/resources/ResourceViews/Deck/DeckRelate.tsx
import { useState, useEffect } from "react";
import { FullDeck } from "@/types/resources";
import { Flashcard } from "@prisma/client";
import FormErrorMessage from "@/components/FormErrorMessage";
import { Button } from "@/components/Button";
import FeedbackMessage from "../../common/FeedbackMessage";

export default function DeckRelate({
    deck,
    handleRelate,
}: {
    deck: FullDeck;
    handleRelate: (args: {
        deckId: string;
        flashcards: Partial<Flashcard>[];
    }) => Promise<void>;
}) {
    const [related, setRelated] = useState<Flashcard[]>(deck.flashcards || []);
    const [allCards, setAllCards] = useState<Flashcard[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState("");
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    // 1. Carga todas las flashcards del usuario
    useEffect(() => {
        setLoading(true);
        fetch("/api/flashcards")
            .then((res) => {
                if (!res.ok) throw new Error("Error al cargar flashcards");
                return res.json();
            })
            .then((data: { items: Flashcard[]; totalCount: number }) => {
                setAllCards(data.items);
            })
            .catch((err) => setFetchError(err.message))
            .finally(() => setLoading(false));
    }, []);

    // 2. Filtrar las flashcards no relacionadas
    const available = allCards.filter(
        (fc) => !related.find((r) => r.id === fc.id)
    );

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    // 3. Envío al backend y actualización local
    const onSubmit = async () => {
        if (selectedIds.size === 0) {
            setMessage("Selecciona al menos una flashcard");
            setIsSuccess(false);
            return;
        }
        const toRelate = available.filter((fc) => selectedIds.has(fc.id));
        try {
            await handleRelate({ deckId: deck.id, flashcards: toRelate });
            setRelated((prev) => [...prev, ...toRelate]);
            setModalOpen(false);
            setSelectedIds(new Set());
            setMessage("Flashcards vinculadas correctamente");
            setIsSuccess(true);
        } catch (err: any) {
            setMessage(err.message || "Error al relacionar flashcards");
            setIsSuccess(false);
        }
    };

    return (
        <div className="p-4">
            {/* Flashcards actualmente relacionadas */}
            <h2 className="text-xl font-bold text-gray-900 mb-4">
                Flashcards en “{deck.title}”
            </h2>
            {related.length === 0 ? (
                <p className="text-gray-700">No hay flashcards relacionadas.</p>
            ) : (
                <div className="grid gap-4">
                    {related.map((fc) => (
                        <div
                            key={fc.id}
                            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md border hover:border-indigo-100 transition"
                        >
                            <h3 className="text-base text-gray-800 sm:text-lg font-semibold mb-2 flex items-center">
                                <span className="mr-2">❓</span>
                                {fc.question}
                            </h3>
                            <ul className="list-disc list-inside text-sm sm:text-base space-y-1 ml-4 mb-4 text-gray-700">
                                {fc.answers.map((ans, i) => (
                                    <li key={i}>{ans}</li>
                                ))}
                            </ul>
                            <div className="text-xs sm:text-sm text-gray-700 text-right">
                                ⏳ Próxima revisión:{" "}
                                {new Date(fc.nextReview).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Botón para abrir modal */}
            <div className="mt-6">
                <Button onClick={() => setModalOpen(true)} className="w-full">
                    Relacionar flashcards
                </Button>
            </div>

            {/* Feedback general */}
            {message && (
                <div className="mt-4">
                    <FeedbackMessage
                        type={isSuccess ? "success" : "error"}
                        message={message}
                        onDismiss={() => setMessage("")}
                    />
                </div>
            )}

            {/* Modal de selección múltiple */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            Selecciona flashcards para “{deck.title}”
                        </h3>

                        {loading ? (
                            <p>Cargando flashcards...</p>
                        ) : fetchError ? (
                            <FormErrorMessage>{fetchError}</FormErrorMessage>
                        ) : available.length === 0 ? (
                            <p className="text-gray-700">No quedan flashcards disponibles.</p>
                        ) : (
                            <ul className="max-h-80 overflow-y-auto space-y-2">
                                {available.map((fc) => (
                                    <li key={fc.id}>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(fc.id)}
                                                onChange={() => toggleSelect(fc.id)}
                                                className="form-checkbox h-5 w-5 text-purple-600"
                                            />
                                            <span>{fc.question}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="mt-6 flex justify-end space-x-3">
                            <Button
                                variant="secondary"
                                onClick={() => setModalOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button onClick={onSubmit} disabled={loading}>
                                Relacionar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
