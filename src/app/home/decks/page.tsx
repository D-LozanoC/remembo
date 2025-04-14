import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

import { Button } from '@/shared/components'
import { getGreetingByTime } from '@/utils/time'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/shared/atoms'

const mockDecks = [
    {
        id: 1,
        name: 'Anatomía Humana',
        cards: 120,
        lastStudied: '2024-03-15',
        progress: 75
    },
    {
        id: 2,
        name: 'Historia del Arte',
        cards: 85,
        lastStudied: '2024-03-14',
        progress: 40
    },
    {
        id: 3,
        name: 'Física Cuántica',
        cards: 200,
        lastStudied: '2024-03-10',
        progress: 90
    }
]

export default async function DecksPage() {
    const session = await auth()
    if (!session?.user) redirect('/auth/login')

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {getGreetingByTime()} {session.user.name || session.user.email}
                    </h1>
                    <Button>
                        <Link href="/decks/new">Nuevo Mazo</Link>
                    </Button>
                </div>

                {mockDecks.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">Aún no tienes ningún mazo creado</p>
                        <Button>
                            <Link href="/decks/new">Crear primer mazo</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockDecks.map((deck) => (
                            <Card key={deck.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="text-lg">{deck.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Tarjetas:</span>
                                            <span className="text-gray-800">{deck.cards}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Último estudio:</span>
                                            <span className="text-gray-800">
                                                {new Date(deck.lastStudied).toLocaleDateString('es-ES')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Progreso:</span>
                                            <span className="text-gray-800">{deck.progress}%</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between gap-2">
                                    <Button variant="ghost" className="w-full">
                                        <Link href={`/decks/${deck.id}/edit`}>Editar</Link>
                                    </Button>
                                    <Button className="w-full">
                                        <Link href={`/decks/${deck.id}/study`}>Estudiar</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}