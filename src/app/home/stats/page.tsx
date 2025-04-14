'use client'

// app/stats/page.tsx
import { redirect } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/atoms'
import { ProgressLine } from '@/shared/atoms/ProgressLine'
import { getGreetingByTime } from '@/utils/time'
import dynamic from 'next/dynamic'
import { BsBarChartFill as BarChart } from "react-icons/bs";
import { PiBookOpenFill as BookOpen } from "react-icons/pi";
import { GoClockFill as Clock } from "react-icons/go";
import { IoPieChartSharp as PieChart } from "react-icons/io5";
import { useSession } from 'next-auth/react'

const StudyProgressChart = dynamic(
  () => import('@/shared/sections/home/StudyCharts').then(mod => mod.StudyProgressChart),
  { ssr: false }
)

const DeckDistributionChart = dynamic(
  () => import('@/shared/sections/home/StudyCharts').then(mod => mod.DeckDistributionChart),
  { ssr: false }
)

const mockStats = {
  totalStudy: {
    hours: '45h 30m',
    sessions: 28,
    daysStreak: 14
  },
  accuracy: {
    average: 82,
    bestSubject: 'Anatomía',
    worstSubject: 'Física'
  },
  progress: [
    { date: 'Mar 1', cards: 20 },
    { date: 'Mar 8', cards: 45 },
    { date: 'Mar 15', cards: 75 },
    { date: 'Mar 22', cards: 110 }
  ],
  deckDistribution: [
    { subject: 'Anatomía', value: 40 },
    { subject: 'Historia', value: 25 },
    { subject: 'Física', value: 35 }
  ],
  recentActivity: [
    { time: '2h ago', action: 'Completaste 20 tarjetas de Anatomía', score: 95 },
    { time: '5h ago', action: 'Nuevo récord en Física: 80%', score: 80 },
    { time: '1d ago', action: 'Creaste el mazo de Historia', score: null }
  ]
}

export default function StatsPage() {
  const session = useSession()
  if (!session?.data?.user) redirect('/auth/login')

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {getGreetingByTime()} {session.data.user.name || session.data.user.email}
            </h1>
            <p className="text-gray-600 mt-1">Tus estadísticas de estudio</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 text-gray-600">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo total</CardTitle>
              <Clock className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalStudy.hours}</div>
              <p className="text-xs text-gray-500 mt-2">
                {mockStats.totalStudy.sessions} sesiones de estudio
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Precisión promedio</CardTitle>
              <BarChart className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.accuracy.average}%</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-green-600">↑ {mockStats.accuracy.bestSubject}</span>
                <span className="text-xs text-red-600">↓ {mockStats.accuracy.worstSubject}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Racha actual</CardTitle>
              <BookOpen className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalStudy.daysStreak} días</div>
              <ProgressLine value={100} className="h-2 mt-2 bg-green-100" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-gray-600">
          <Card className="p-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart className="h-5 w-5" /> Progreso semanal
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <StudyProgressChart data={mockStats.progress} />
            </CardContent>
          </Card>

          <Card className="p-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="h-5 w-5" /> Distribución de estudio
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <DeckDistributionChart data={mockStats.deckDistribution} />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Actividad reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockStats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start justify-between p-3 hover:bg-gray-50 rounded-lg group">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                    {activity.score && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${activity.score >= 80 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {activity.score}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}