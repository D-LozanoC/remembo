import FormErrorMessage from "@/components/FormErrorMessage";
import { InputField } from "@/components/InputField";
import { DeckFormData, deckSchema } from "@/schemas/resources";
import { zodResolver } from "@hookform/resolvers/zod";
import { Deck, Subjects } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/Button";
import { Loader } from "@/components/Loader";
import FeedbackMessage from "../../common/FeedbackMessage";

export default function DeckCreate ({
    handleCreate
}: {
    handleCreate: (data: Partial<Deck>) => void;
}) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<DeckFormData>({
        resolver: zodResolver(deckSchema)
    });

    const onSubmit = handleSubmit(async (formData) => {
        try {
            setLoading(true)
            setMessage('')
            setIsSuccess(false)

            const { title, topic, subject } = formData
            const creationData = {
                title,
                topic,
                subject
            }

            handleCreate(creationData)

            reset();
            setMessage('¡Deck creado exitosamente!')
            setIsSuccess(true)
        } catch (error) {
            console.error('Error al guardar el deck:', error)
            setMessage('Error al guardar el deck')
            setIsSuccess(false)
        } finally {
            setLoading(false)
        }
    });

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-8">
            <div className="flex flex-row justify-between gap-4">
                {/* Título */}
                <div className="flex flex-col gap-2 grow">
                    <label htmlFor="title" className="text-lg font-bold text-gray-900">Título</label>
                    <InputField
                        label="Escribe el título..."
                        type="text"
                        {...register('title')}
                        className="w-full rounded-xl border border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 p-3 text-base bg-white shadow-inner text-gray-900"
                    />
                    {errors.title && <FormErrorMessage>{errors.title.message as string}</FormErrorMessage>}
                </div>

                {/* Tema */}
                <div className="flex flex-col gap-2 grow">
                    <label htmlFor="topic" className="text-lg font-bold text-gray-900">Tema</label>
                    <InputField
                        label="Escribe el tema..."
                        type="text"
                        {...register('topic')}
                        className="w-full rounded-xl border border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 p-3 text-base bg-white shadow-inner text-gray-900"
                    />
                    {errors.topic && <FormErrorMessage>{errors.topic.message as string}</FormErrorMessage>}
                </div>
            </div>

            {/* Materia */}
            <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-lg font-bold text-gray-900">Materia</label>
                <select
                    id="subject"
                    {...register('subject')}
                    className="w-full rounded-xl border border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 p-3 text-base bg-white shadow-inner text-gray-900"
                >
                    {Object.entries(Subjects).map(([key, value]) => (
                        <option key={key} value={value}>
                            {value}
                        </option>
                    ))}
                </select>
                {errors.subject && <FormErrorMessage>{errors.subject.message as string}</FormErrorMessage>}
            </div>

            {/* Mensajes de feedback */}
            <FeedbackMessage
                type={isSuccess ? 'success' : 'error'}
                message={message}
                onDismiss={() => setMessage('')}
            />

            {loading && (
                <Loader/>
            )}

            <Button
                type="submit"
                className="w-full min-h-[44px] px-6 py-3 text-lg font-semibold rounded-2xl bg-indigo-600 
                    text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 
                    disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors 
                    duration-200"
            >
                Guardar cambios
            </Button>
        </form>
    );
}