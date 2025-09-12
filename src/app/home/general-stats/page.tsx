'use client'

// app/stats/page.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card'
import dynamic from 'next/dynamic'
import { BsBarChartFill as BarChart } from "react-icons/bs";
import { PiBookOpenFill as BookOpen } from "react-icons/pi";
import { GoClockFill as Clock } from "react-icons/go";

const StudyProgressChart = dynamic(
  () => import('@/components/StudyCharts').then(mod => mod.StudyProgressChart),
  { ssr: false }
)

const mockStats = {
  totalStudy: {
    totalStudyTime: '45h 30m',
    averageStudyTime: '1h 30m',
    totalUsers: 300,
    longestStreak: 14,
    sessions: 28,
    studyNotes: 120,
    studiedFlashcards: 150,
  },
  newUsers: [
    { date: 'Mar 3 - 9', newUsers: 3 },
    { date: 'Mar 10 - 16', newUsers: 9 },
    { date: 'Mar 17 - 23', newUsers: 7 },
    { date: 'Mar 24 - 30', newUsers: 5 }
  ],
  progress: [
    { date: 'Mar 3 - 9', cards: 20 },
    { date: 'Mar 10 - 16', cards: 45 },
    { date: 'Mar 17 - 23', cards: 75 },
    { date: 'Mar 24 - 30', cards: 110 }
  ],
}

export default function GeneralStatsPage() {

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Estadísticas generales de uso
            </h1>
            <p className="text-gray-600 mt-1">Estas son las estadísticas generales de la aplicación Remembo</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 text-gray-600">
          <Card>
            <CardHeader flexCol={false} className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo total</CardTitle>
              <Clock className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalStudy.totalStudyTime}</div>
              <p className="text-xs text-gray-500 mt-2">
                {mockStats.totalStudy.averageStudyTime} en promedio
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader flexCol={false} className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Flashcards estudiadas</CardTitle>
              <BookOpen className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalStudy.studiedFlashcards}</div>
              <p className="text-xs text-gray-500 mt-2">
                {mockStats.totalStudy.studyNotes} notas de estudio
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader flexCol={false} className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de usuarios</CardTitle>
              <BarChart className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalStudy.totalUsers}</div>
              <p className="text-xs text-gray-500 mt-2">
                Racha más larga: {mockStats.totalStudy.longestStreak} días
              </p>
            </CardContent>
          </Card>
        </div>

        <h1 className="text-xl font-bold text-gray-800 mb-4">
          Estadísticas del último mes
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-gray-600">
          <Card className="p-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart className="h-5 w-5" /> Creación de flashcards
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <StudyProgressChart data={mockStats.progress} />
            </CardContent>
          </Card>

          <Card className="p-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart className="h-5 w-5" /> Nuevos usuarios
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <StudyProgressChart data={mockStats.newUsers} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}