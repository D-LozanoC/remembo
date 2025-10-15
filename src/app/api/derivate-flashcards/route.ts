import { auth } from "@/auth";
import { FullNote } from "@/types/resources";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/config/prisma";
import { DerivationResponse, parseResponse } from "../validate-note/utils";

export async function POST(req: NextRequest) {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const note = await req.json() as FullNote;
    const divisions = note.divisions as { tema: string, texto: string }[]
    const prompt = `
Eres un asistente en ESPAÑOL que genera exactamente UNA flashcard de opción múltiple por cada división provista.
Cada división es un objeto con las claves "tema" y "texto". Usa ambos para crear la pregunta.

Salida requerida (solo JSON):
- La salida debe ser únicamente un array JSON válido.
- SIEMPRE debes validar que el JSON este correcto hasta el final.
- Cada elemento del array debe ser un objeto con EXACTAMENTE estas claves: "question", "answers", "correctAnswers".
- "answers" debe contener exactamente 4 opciones.
- "correctAnswers" debe ser un array con exactamente 1 elemento (la respuesta correcta).
- La respuesta correcta debe coincidir textualmente con uno de los elementos de "answers".
- No incluir ids, metadatos, comentarios ni texto adicional fuera del JSON.

Reglas para generar cada flashcard:
1. Genera una sola flashcard por cada objeto { "tema", "texto" } en el mismo orden.
2. La "question" debe derivarse del "tema" y del "texto".
3. Evita repetir textualmente la misma opción entre las cuatro respuestas.

Ejemplo de entrada:
[
  {
    "tema": "Regresión Lineal Simple",
    "texto": "La regresión lineal simple se expresa como y = β0 + β1 x + ε, donde y es la variable dependiente, x es la variable independiente, β0 es el intercepto, β1 es la pendiente y ε es el término de error."
  }
]

Ejemplo de salida (JSON solamente):
[
  {
    "question": "¿Qué representa β1 en la regresión lineal simple?",
    "answers": [
      "El intercepto del modelo.",
      "La pendiente que mide la relación entre x y y.",
      "El término de error aleatorio.",
      "La media de la variable dependiente."
    ],
    "correctAnswers": [
      "La pendiente que mide la relación entre x y y."
    ]
  }
]

Genera ahora las flashcards para las divisiones siguientes (una flashcard por cada objeto, en el mismo orden):

${JSON.stringify(divisions, null, 2)}
`

    try {
        process.loadEnvFile()
        const API_KEY = process.env.AZURE_API_KEY
        const API_URL = process.env.AZURE_URL
        if (!API_KEY && !API_URL) {
            console.error('API key or API URL is not set')
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
        }
        const resp = await fetch(API_URL!, {
            method: 'POST',
            headers: new Headers({
                "Content-Type": "application/json",
                "api-key": API_KEY ?? ""
            }),
            body: JSON.stringify({
                messages: [
                    { role: "system", content: "Eres un asistente en ESPAÑOL que genera exactamente UNA flashcard de opción múltiple por cada división provista." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 800,
                temperature: 0
            })
        })
        if (!resp.ok) { return NextResponse.json({ error: 'Error calling API' }, { status: 500 }) }

        const data = await resp.json()
        const content = data.choices?.[0]?.message?.content ?? ""
        if (!content) { return NextResponse.json({ error: 'No output from API' }, { status: 500 }) }
        const output = parseResponse(content) as DerivationResponse[]
        if (!output || !Array.isArray(output) || output.length !== divisions.length) {
            return NextResponse.json({ error: 'Invalid output format from API' }, { status: 500 })
        }
        const tns = await prisma.$transaction(async tx => {
            const newDeck = await tx.deck.create({
                data: {
                    title: note.title,
                    userId,
                    topic: note.topic,
                    subject: note.subject,
                    DeckAlgorithmState: { create: {} }
                }
            })

            const derivedFlashcards = await Promise.all(output.map(f => tx.flashcard.create({
                data: {
                    ...f,
                    userId,
                    isDerived: true,
                    noteId: note.id,
                    DeckFlashcard: {
                        create: {
                            deckId: newDeck.id
                        }
                    }
                }
            })))
            const updatedNote = await tx.note.update({
                where: { id: note.id },
                data: { flashcards: { connect: derivedFlashcards.map(f => ({ id: f.id })) } },
                include: {
                    flashcards: {
                        include: {

                        }
                    },
                    _count: true
                }
            })

            return updatedNote as FullNote
        })

        return NextResponse.json(tns, { status: 200 });
    } catch (error) {
        console.error("Error in derivate-flashcards:", error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}