// app/api/validate-note/route.ts
import { auth } from '@/auth'
import { prisma } from '@/config/prisma'
import { Note } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import removeMd from 'remove-markdown'
import { parseResponse, ValidationResponse } from './utils'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { content, subject, title, topic, id } = await req.json() as Note

  if (!content || !subject || !title || !topic) return NextResponse.json({ error: 'No note provided' }, { status: 400 })

  // prompt para validar la nota
  const prompt = `
  Eres un evaluador que determina si una nota contiene suficiente información para crear flashcards de estudio. Responde SIEMPRE con un JSON en el siguiente formato:

  json
  {
    "apta": boolean,
    "razon": string,
    "divisiones": [] o [
      {
        "tema": string,
        "texto": string
      }
    ]
  }
    
  Para que una nota sea considerada apta, debe cumplir TODOS los criterios siguientes:

  - Tener al menos 50 palabras.
  - Incluir un mínimo de 2 ideas o temas claramente diferenciados.
  - Presentar conceptos o hechos específicos que puedan transformarse en preguntas y respuestas.

  Si la nota no cumple alguno de estos criterios:

  - "apta" será false
  - "razon" explicará claramente cuál o cuáles criterios no se cumplen
  - "divisiones" será un arreglo vacío []

  Proporciona divisiones temáticas con sus textos relacionados solo si la nota es apta.

  Ejemplo no apto: "Nota de prueba para validar".
  Ejemplo apto: texto extenso con múltiples conceptos y temas claros.
  Nota:
  ${title}
  Tema: ${topic}
  Asignatura: ${subject}

  ${removeMd(content)}
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
          { role: "system", content: "Eres un evaluador que determina si una nota contiene suficiente información para crear flashcards de estudio." },
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


    const output = parseResponse(content) as ValidationResponse
    if (!output || typeof output.apta !== 'boolean' || typeof output.razon !== 'string' || !Array.isArray(output.divisiones)) {
      return NextResponse.json({ error: 'Invalid output format from API' }, { status: 500 })
    }

    const updated = await prisma.note.update({
      where: {
        id: id
      },
      data: {
        validated: output.apta,
        divisions: output.divisiones,
        reason: output.razon
      },
      select: {
        id: true,
        subject: true,
        content: true,
        title: true,
        topic: true,
        createdAt: true,
        updatedAt: true,
        divisions: true,
        validated: true,
        reason: true,
        _count: true,
        flashcards: {
          include: {
            Note: true,
          }
        }
      }
    })

    if (!updated) { return NextResponse.json({ error: 'Error updating note in database' }, { status: 500 }) }

    return NextResponse.json({ ...updated }, { status: 200 })
  }
  catch (error) {
    console.error('Error in /api/validate-note:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}


