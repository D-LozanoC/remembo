import { Button } from "@/components/Button";
import FormErrorMessage from "@/components/FormErrorMessage";
import { InputField } from "@/components/InputField";
import { FlashcardFormData, flashcardSchema } from "@/schemas/resources";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, useFieldArray } from "react-hook-form";
import { useState, useMemo } from "react";
import * as React from "react";
import { Deck, Flashcard } from "@prisma/client";
import FeedbackMessage from "../../common/FeedbackMessage";

export default function FlashcardCreator({
    handleCreate
}: {
    handleCreate: (data: Partial<Flashcard>) => void;
}) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [decks, setDecks] = useState<Deck[]>([]);

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FlashcardFormData>({
        resolver: zodResolver(flashcardSchema),
        defaultValues: {
            question: "",
            answers: ["Respuesta 1", "Respuesta 2"], // Dos strings vacíos para garantizar 2 campos
            correctAnswers: [""]
        }
    });

    const {
        fields: answerFields,
        append: appendAnswer,
        remove: removeAnswer
    } = useFieldArray<FlashcardFormData>({
        control,
        name: "answers" as never,
        // Asegurar que siempre tenga al menos 2 campos
    });

    const {
        fields: correctFields,
        append: appendCorrect,
        remove: removeCorrect
    } = useFieldArray<FlashcardFormData>({
        control,
        name: "correctAnswers" as never
    });

    // Forzar la inicialización de 2 campos si no existen
    React.useEffect(() => {
        // Si hay menos de 2 campos, agregar los faltantes
        const currentLength = answerFields.length;
        if (currentLength === 0) {
            appendAnswer("");
            appendAnswer("");
        } else if (currentLength === 1) {
            appendAnswer("");
        }
    }); // Solo ejecutar una vez al montar

    const answers = useWatch({ control, name: "answers" });
    const correctAnswers = useWatch({ control, name: "correctAnswers" });

    const validOptions = useMemo(
        () => answers.filter((a) => a.trim() !== ""),
        [answers]
    );

    const maxAnswersReached = answerFields.length >= 4;
    const maxCorrectAnswersReached = correctFields.length >= 4 || correctFields.length >= validOptions.length;

    React.useEffect(() => {
        fetch('/api/resources/decks?all=true')
            .then((res) => res.json())
            .then((data) => {
                setDecks(data.items);
            })
            .catch((err) => {
                console.error('Error fetching decks:', err);
            });
    }, [])

    const onSubmit = handleSubmit(async (formData) => {
        try {
            setLoading(true);
            setMessage('');
            setIsSuccess(false);

            const answers = formData.answers.filter((a) => a.trim() !== "");

            if (answers.length < 2) {
                setIsSuccess(false);
                setMessage("Debes tener al menos 2 respuestas.");
                return;
            }

            const createData = {
                question: formData.question.trim(),
                answers,
                correctAnswers: formData.correctAnswers.filter((a) => a.trim() !== ""),
                deckId: formData.deckId || null
            };

            if (createData.correctAnswers?.length === 0) {
                setIsSuccess(false);
                setMessage("Debes seleccionar al menos una respuesta correcta.");
                return;
            }

            handleCreate(createData);

            setMessage('Tarjeta creada exitosamente');
            setIsSuccess(true);

            // Resetear el formulario después de crear exitosamente
            reset({
                question: "",
                answers: ["", ""],
                correctAnswers: [""],
                deckId: ""
            });

        } catch (err) {
            console.error('Error al crear la tarjeta:', err);
            setMessage('Error al crear la tarjeta');
            setIsSuccess(false);
        } finally {
            setLoading(false);
        }
    });

    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col gap-6"
            aria-describedby={message ? "form-error" : undefined}
        >
            {/* Pregunta */}
            <div className="flex flex-col gap-2">
                <label htmlFor="question" className="text-lg font-bold text-gray-900">
                    Pregunta
                </label>
                <InputField
                    id="question"
                    label="Escribe la pregunta..."
                    type="text"
                    {...register("question")}
                    className="border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-lg transition-all duration-200 w-full p-3 text-gray-700"
                />
                {errors.question && (
                    <FormErrorMessage className="text-red-700 font-medium">{errors.question.message}</FormErrorMessage>
                )}
            </div>

            {/* Selección de Mazos */}
            <div className="flex flex-col gap-2">

            </div>

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="deck-id"
                    className="text-lg font-bold text-gray-900"
                >
                    Mazos
                </label>
                <select
                    id="deck-id"
                    {...register("deckId")}
                    className={`border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 px-3 py-2 rounded-lg w-full transition-all duration-200 text-gray-700`}
                >
                    <option value="">Selecciona un mazo...</option>
                    {decks.map((d) => (
                        <option key={d.id} value={d.id}>
                            {d.title}
                        </option>
                    ))}
                </select>
            </div>
            {errors.deckId && (
                <FormErrorMessage className="text-red-700 font-medium">{errors.deckId.message}</FormErrorMessage>
            )}


            {/* Respuestas dinámicas */}
            <div className="flex flex-col gap-2">
                <label className="text-lg font-bold text-gray-900">Respuestas</label>
                <div className="space-y-3">
                    {answerFields.map((field, idx) => {
                        const hasError = !!errors.answers?.[idx];
                        return (
                            <div key={field.id} className="flex items-center gap-2">
                                <InputField
                                    id={`answer-${idx}`}
                                    label={`Respuesta ${idx + 1}`}
                                    type="text"
                                    {...register(`answers.${idx}` as const)}
                                    aria-invalid={hasError}
                                    className={`border-2 ${hasError ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-indigo-500 rounded-lg flex-1 transition-all duration-200 w-full p-3 text-gray-700`}
                                />
                                {errors.answers && errors.answers[idx] && <FormErrorMessage className="text-red-700 font-medium">{errors.answers[idx].message}</FormErrorMessage>}

                                {answerFields.length > 2 && idx >= 2 && (
                                    <button
                                        type="button"
                                        onClick={() => removeAnswer(idx)}
                                        aria-label={`Eliminar respuesta ${idx + 1}`}
                                        className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
                <button
                    type="button"
                    onClick={() => appendAnswer("")}
                    disabled={maxAnswersReached}
                    className="self-start px-4 py-2 border-2 border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {maxAnswersReached ? "Máximo alcanzado (4)" : "+ Añadir respuesta"}
                </button>
                {errors.answers && <FormErrorMessage className="text-red-700 font-medium">{errors.answers.message}</FormErrorMessage>}
            </div>

            {/* Respuestas correctas dinámicas */}
            <div className="flex flex-col gap-2">
                <label className="text-lg font-bold text-gray-900">Respuestas correctas</label>
                <div className="space-y-3">
                    {correctFields.map((field, idx) => {
                        const availableOptions = validOptions.filter(opt =>
                            !correctAnswers.some((ca, index) =>
                                index !== idx && ca === opt
                            )
                        );
                        const hasError = !!errors.correctAnswers?.[idx];

                        return (
                            <div key={field.id} className="flex items-center gap-2">
                                <select
                                    id={`correct-${idx}`}
                                    {...register(`correctAnswers.${idx}` as const)}
                                    aria-invalid={hasError}
                                    className={`border-2 ${hasError ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-indigo-500 px-3 py-2 rounded-lg w-full transition-all duration-200 text-gray-700`}
                                >
                                    <option value="">Selecciona una respuesta...</option>
                                    {availableOptions.map((opt, i) => (
                                        <option key={i} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                                {errors.correctAnswers && errors.correctAnswers[idx] && <FormErrorMessage className="text-red-700 font-medium">{errors.correctAnswers[idx].message}</FormErrorMessage>}

                                {correctFields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeCorrect(idx)}
                                        aria-label={`Eliminar respuesta correcta ${idx + 1}`}
                                        className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
                <button
                    type="button"
                    onClick={() => appendCorrect("")}
                    disabled={maxCorrectAnswersReached}
                    className="self-start px-4 py-2 border-2 border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {maxCorrectAnswersReached
                        ? validOptions.length <= correctFields.length
                            ? "No hay más opciones válidas"
                            : "Máximo alcanzado (4)"
                        : "+ Añadir respuesta correcta"}
                </button>
                {errors.correctAnswers && (
                    <FormErrorMessage className="text-red-700 font-medium">{errors.correctAnswers.message}</FormErrorMessage>
                )}
            </div>

            {/* Mensajes de feedback */}
            <FeedbackMessage
                type={isSuccess ? 'success' : 'error'}
                message={message}
                onDismiss={() => setMessage('')}
            />

            <Button
                type="submit"
                disabled={loading}
                aria-disabled={loading}
                aria-label={loading ? "Creando..." : "Crear tarjeta"}
                className="w-full py-3 font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-wait focus:ring-4 focus:ring-indigo-200 transition-colors"
            >
                {loading ? "Creando..." : "Crear tarjeta"}
            </Button>
        </form>
    );
}