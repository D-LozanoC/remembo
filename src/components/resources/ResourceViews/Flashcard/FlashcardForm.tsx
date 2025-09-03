import { Button } from "@/components/Button";
import FormErrorMessage from "@/components/FormErrorMessage";
import { InputField } from "@/components/InputField";
import { FlashcardFormData, flashcardSchema } from "@/schemas/resources";
import { FullFlashcard } from "@/types/resources";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, useFieldArray } from "react-hook-form";
import { useState, useMemo } from "react";
import FeedbackMessage from "../../common/FeedbackMessage";

export default function FlashcardEditor({
    data,
    handleUpdate
}: {
    data: FullFlashcard;
    handleUpdate: (data: Partial<FullFlashcard>) => void;
}) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<FlashcardFormData>({
        resolver: zodResolver(flashcardSchema),
        defaultValues: {
            question: data.question,
            answers: data.answers.length ? data.answers : [""],
            correctAnswers: data.correctAnswers.length ? data.correctAnswers : [""],
            deckId: data.decks?.[0]?.id || ""
        }
    });

    const {
        fields: answerFields,
        append: appendAnswer,
        remove: removeAnswer
    } = useFieldArray<FlashcardFormData>({
        control,
        name: "answers" as never
    });

    const {
        fields: correctFields,
        append: appendCorrect,
        remove: removeCorrect
    } = useFieldArray<FlashcardFormData>({
        control,
        name: "correctAnswers" as never
    });

    const answers = useWatch({ control, name: "answers" });
    const correctAnswers = useWatch({ control, name: "correctAnswers" });

    const validOptions = useMemo(
        () => answers.filter((a) => a.trim() !== ""),
        [answers]
    );

    const maxAnswersReached = answerFields.length >= 4;
    const maxCorrectAnswersReached = correctFields.length >= 4 || correctFields.length >= validOptions.length;

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

            const updateData: Partial<FullFlashcard> = {
                id: data.id,
                question: formData.question.trim(),
                answers,
                correctAnswers: formData.correctAnswers.filter((a) => a.trim() !== "")
            };

            const response = await fetch(`/api/resources/flashcards/${data.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                const { error } = await response.json();
                setMessage(error || 'Error al guardar la tarjeta');
                return;
            }

            handleUpdate(updateData);
            setMessage('Tarjeta actualizada exitosamente');
            setIsSuccess(true);
        } catch (err) {
            console.error('Error al guardar la tarjeta:', err);
            setMessage('Error al guardar la tarjeta');
            setIsSuccess(false);
        } finally {
            setLoading(false);
        }
    });

    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col gap-6 "
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
                    aria-invalid={!!errors.question}
                    aria-describedby={errors.question ? "error-question" : undefined}
                    className="border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 rounded-lg transition-all duration-200 w-full p-3 text-gray-700"
                />
                {errors.question && (
                    <FormErrorMessage className="text-red-700 font-medium">{errors.question.message}</FormErrorMessage>
                )}
            </div>

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

                                {answerFields.length > 1 && (
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
                aria-label={loading ? "Guardando..." : "Guardar cambios"}
                className="w-full py-3 font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-wait focus:ring-4 focus:ring-indigo-200 transition-colors"
            >
                {loading ? "Guardando..." : "Guardar cambios"}
            </Button>
        </form>
    );
}