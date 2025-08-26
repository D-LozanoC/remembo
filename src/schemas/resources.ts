import { $Enums } from '@prisma/client'
import { z } from 'zod'

export const noteSchema = z.object({
    title: z.string({
        required_error: "El título es obligatorio.",
        invalid_type_error: "El título debe ser un texto.",
    }).min(3, { message: "El título debe tener al menos 3 caracteres." }),

    topic: z.string({
        required_error: "El tema es obligatorio.",
        invalid_type_error: "El tema debe ser un texto.",
    }).min(3, { message: "El tema debe tener al menos 3 caracteres." }),

    content: z.string({
        required_error: "El contenido es obligatorio.",
        invalid_type_error: "El contenido debe ser un texto.",
    }).min(10, { message: "El contenido debe tener al menos 10 caracteres." }),

    subject: z.nativeEnum($Enums.Subjects)
})

export type NoteFormData = z.infer<typeof noteSchema>

export const deckSchema = z.object({
    title: z.string().min(3, { message: "El título debe tener al menos 3 caracteres." }),
    topic: z.string().min(3, { message: "El tema debe tener al menos 3 caracteres." }),
    subject: z.nativeEnum($Enums.Subjects),
})

export type DeckFormData = z.infer<typeof deckSchema>

export const flashcardSchema = z.object({
    question: z.string().min(3, {
        message: "La pregunta debe tener al menos 3 caracteres.",
    }),
    answers: z
        .array(
            z.string().min(3, {
                message: "La respuesta debe tener al menos 3 caracteres.",
            })
        )
        .min(1, {
            message: "La tarjeta debe tener al menos 2 respuestas.",
        })
        .max(4, {
            message: "La tarjeta debe tener como máximo 4 respuestas.",
        }),
    correctAnswers: z
        .array(z.string().min(1, {
            message: "La respuesta correcta es obligatoria.",
        }))
        .max(4, {
            message: "La tarjeta debe tener como máximo 4 respuestas correctas.",
        }),
    deckId: z.string().cuid({
        message: "El ID del mazo es obligatorio.",
    }),
}).refine(
    (data) =>
        data.correctAnswers.every((correct) => data.answers.includes(correct)),
    {
        message: "Todas las respuestas correctas deben estar entre las respuestas.",
        path: ["correctAnswers"],
    }
);


export type FlashcardFormData = z.infer<typeof flashcardSchema>
