// app/dashboard/page.tsx
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/atoms/Card'
import { Button } from '@/shared/components/Button'
import { Progress } from '@/shared/atoms/ProgressLine'
import { getGreetingByTime } from '@/utils/time'
import Link from 'next/link'
import { PiBookOpenFill as BookOpen } from "react-icons/pi";
import { LuBrainCircuit as BrainCircuit } from "react-icons/lu";
import { BsBarChartFill as BarChart } from "react-icons/bs";

const mockData = {
    stats: {
        dailyStreak: 5,
        weeklyStudyTime: '12h 45m',
        accuracy: 82
    },
    decks: [
        { id: 1, name: 'Anatomía', progress: 65, cards: 120 },
        { id: 2, name: 'Física Cuántica', progress: 40, cards: 85 },
        { id: 3, name: 'Historia del Arte', progress: 90, cards: 200 }
    ],
    dailyQuiz: {
        completed: false,
        progress: 45,
        questions: 10
    }
}

export default async function DashboardPage() {
    const session = await auth()
    if (!session?.user) redirect('/auth/login')

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {getGreetingByTime()} {session.user.name || session.user.email}
                        </h1>
                        <p className="text-gray-600 mt-1">Tu progreso de hoy</p>
                    </div>
                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                        <Button variant="ghost">
                            <Link href="/stats">
                                <BarChart className="w-4 h-4 mr-2" />
                                Ver estadísticas completas
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Grid principal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sección de Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Racha diaria</CardTitle>
                                    <BrainCircuit className="w-6 h-6 text-green-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-green-600">
                                    {mockData.stats.dailyStreak} días
                                </div>
                                <p className="text-sm text-gray-500 mt-2">Mantén tu racha estudiando hoy</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Precisión semanal</CardTitle>
                                    <span className="text-2xl font-bold text-purple-600">
                                        {mockData.stats.accuracy}%
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Progress value={mockData.stats.accuracy} className="h-2" />
                                <p className="text-sm text-gray-500 mt-2">Promedio de respuestas correctas</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sección de Daily Quiz */}
                    <div className="lg:col-span-1">
                        <Card className="h-full bg-indigo-50 border-indigo-100">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Quiz diario</CardTitle>
                                    <BrainCircuit className="w-6 h-6 text-indigo-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-6">
                                    <div className="text-4xl font-bold text-indigo-600 mb-4">
                                        {mockData.dailyQuiz.progress}%
                                    </div>
                                    <Progress value={mockData.dailyQuiz.progress} className="h-2 mb-4" />
                                    <Button className="w-full">
                                        <Link href="/quiz/daily">
                                            {mockData.dailyQuiz.completed ? 'Ver resultados' : 'Comenzar quiz'}
                                        </Link>
                                    </Button>
                                    <p className="text-sm text-gray-600 mt-4">
                                        {mockData.dailyQuiz.questions} preguntas disponibles
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sección de Decks */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Tus mazos</CardTitle>
                                    <BookOpen className="w-6 h-6 text-blue-600" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {mockData.decks.map((deck) => (
                                    <div key={deck.id} className="group hover:bg-gray-50 p-3 rounded-lg transition-colors">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="font-medium">{deck.name}</h3>
                                                <p className="text-sm text-gray-600">{deck.cards} tarjetas</p>
                                            </div>
                                            <span className="text-sm font-medium text-blue-600">
                                                {deck.progress}%
                                            </span>
                                        </div>
                                        <Progress value={deck.progress} className="h-2 mt-2" />
                                    </div>
                                ))}
                                <Button variant="ghost" className="w-full mt-4">
                                    <Link href="/decks">Ver todos los mazos</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}