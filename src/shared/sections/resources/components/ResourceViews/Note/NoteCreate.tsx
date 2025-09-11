import { Button } from "@/shared/atoms/Button";
import FormErrorMessage from "@/shared/atoms/FormErrorMessage";
import { InputField } from "@/shared/atoms/InputField";
import { NoteFormData, noteSchema } from "@/schemas/resources";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import FeedbackMessage from "../../common/FeedbackMessage";
import { Note, Subjects } from "@prisma/client";


export default function NoteCreate ({
    handleCreate
}: {
    handleCreate: (data: Partial<Note>) => void;
}) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors }, control } = useForm<NoteFormData>({
        resolver: zodResolver(noteSchema)
    });

    const onSubmit = handleSubmit(async data => {
        try {
            setLoading(true)
            setMessage('')
            setIsSuccess(false)
            
            const response = await fetch('/api/resources/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            
            const result = await response.json()
            console.log(result)
            handleCreate(data)
            setMessage('¡Nota creada exitosamente!')
            setIsSuccess(true)
        } catch (error) {
            console.error('Error al guardar la nota:', error)
            setMessage('Error al guardar la nota')
            setIsSuccess(false)
        } finally {
            setLoading(false)
        }
    })

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

            {/* Contenido */}
            <div className="flex flex-col gap-2">
                <label htmlFor="content" className="text-lg font-bold text-gray-900">Contenido</label>
                <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                        <div data-color-mode="light" className="border border-indigo-300 rounded-2xl overflow-hidden shadow-inner">
                            <MDEditor
                                value={field.value}
                                onChange={(val) => field.onChange(val)}
                                onBlur={field.onBlur}
                            />
                        </div>
                    )}
                />
                {errors.content && <FormErrorMessage>{errors.content.message as string}</FormErrorMessage>}
            </div>

            {/* Mensajes de feedback */}
            <FeedbackMessage
                type={isSuccess ? 'success' : 'error'}
                message={message}
                onDismiss={() => setMessage('')}
            />

            {/* Botón de guardar */}
            <Button
                type="submit"
                className="w-full min-h-[44px] px-6 py-3 text-lg font-semibold rounded-2xl bg-indigo-600 
                text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 
                disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors 
                duration-200"
            >
                {loading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
        </form>
    )
}