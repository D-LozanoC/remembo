// src/components/resources/ResourceViews/Deck/DeckRelate.tsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FullDeck } from "@/types/resources";
import { Deck, Flashcard } from "@prisma/client";
import FormErrorMessage from "@/components/FormErrorMessage";
import FeedbackMessage from "../../common/FeedbackMessage";
import { Button } from "@/components/Button";
import Dialog from "../../common/Dialog";

type FormValues = {
    flashcards: string[];
};

export default function DeckRelate({
    deck,
    handleRelate,
}: {
    deck: FullDeck;
    handleRelate: (args: {
        deck: Partial<Deck>;
        flashcards: Partial<Flashcard>[];
    }) => Promise<void>;
}) {
    const [related, setRelated] = useState<Flashcard[]>(deck.flashcards || []);
    const [allCards, setAllCards] = useState<Flashcard[]>([]);
    const [loadingFetch, setLoadingFetch] = useState(false);
    const [fetchError, setFetchError] = useState("");
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormValues>({ defaultValues: { flashcards: [] } });

    useEffect(() => {
        setLoadingFetch(true);
        fetch("/api/resources/flashcards?all=true")
            .then((res) => {
                if (!res.ok) throw new Error("Error al cargar flashcards");
                return res.json();
            })
            .then((data: { items: Flashcard[]; totalCount: number }) => {
                setAllCards(data.items);
            })
            .catch((err) => setFetchError(err.message))
            .finally(() => setLoadingFetch(false));
    }, []);

    const available = allCards.filter(
        (fc) => !related.some((r) => r.id === fc.id)
    );

    const onSubmit = handleSubmit(async (values) => {
        if (values.flashcards.length === 0) return;
        const toRelate = available.filter((fc) =>
            values.flashcards.includes(fc.id)
        );

        try {
            await handleRelate({ deck, flashcards: toRelate });
            setRelated((prev) => [...prev, ...toRelate]);
            setModalOpen(false);
            reset();
            setMessage("Flashcards vinculadas correctamente");
            setIsSuccess(true);
        } catch (err: any) {
            setMessage(err.message || "Error al relacionar flashcards");
            setIsSuccess(false);
        }
    });

    return (
        <div className="p-4">
            {/* Flashcards relacionadas */}
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
                                ⏳ Próxima revisión: {new Date(fc.nextReview).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-6">
                <Button onClick={() => setModalOpen(true)} className="w-full">
                    Relacionar flashcards
                </Button>
            </div>

            {message && (
                <div className="mt-4">
                    <FeedbackMessage
                        type={isSuccess ? "success" : "error"}
                        message={message}
                        onDismiss={() => setMessage("")}
                    />
                </div>
            )}

            {/* Modal usando Dialog */}
            <Dialog isOpen={isModalOpen} style="">
                <form
                    onSubmit={onSubmit}
                    className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 mx-auto"
                >
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                        Selecciona flashcards para “{deck.title}”
                    </h3>

                    {loadingFetch ? (
                        <p>Cargando flashcards...</p>
                    ) : fetchError ? (
                        <FormErrorMessage>{fetchError}</FormErrorMessage>
                    ) : available.length === 0 ? (
                        <p className="text-gray-700">No quedan flashcards disponibles.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
                            {available.map((fc) => (
                                <label
                                    key={fc.id}
                                    className="relative block p-3 bg-white rounded-lg shadow-sm border hover:shadow-md hover:border-indigo-100 transition"
                                >
                                    {/* Checkbox en esquina */}
                                    <input
                                        type="checkbox"
                                        value={fc.id}
                                        {...register("flashcards", {
                                            required: "Debes seleccionar al menos una flashcard",
                                        })}
                                        className="absolute top-2 right-2 h-4 w-4 text-indigo-600"
                                    />

                                    {/* Pregunta */}
                                    <h4 className="text-sm font-semibold text-gray-800 mb-1 flex items-center">
                                        <span className="mr-1">❓</span>
                                        {fc.question}
                                    </h4>

                                    {/* Respuestas (hasta 3) */}
                                    <ul className="list-disc list-inside text-xs space-y-1 ml-3 mb-2 text-gray-700">
                                        {fc.answers.slice(0, 3).map((ans, i) => (
                                            <li key={i}>{ans}</li>
                                        ))}
                                        {fc.answers.length > 3 && <li>…</li>}
                                    </ul>

                                    {/* Próxima revisión */}
                                    <div className="text-[10px] text-gray-700 text-right">
                                        ⏳ {new Date(fc.nextReview).toLocaleDateString()}
                                    </div>
                                </label>
                            ))}

                            {/* Error de validación */}
                            {errors.flashcards && (
                                <div className="col-span-full">
                                    <FormErrorMessage>
                                        {errors.flashcards.message}
                                    </FormErrorMessage>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-6 flex justify-end space-x-3">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => {
                                setModalOpen(false);
                                reset();
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting || loadingFetch}>
                            Relacionar
                        </Button>
                    </div>
                </form>
            </Dialog>
        </div>
    );
}