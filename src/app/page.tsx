import { Metadata } from 'next'
import Link from 'next/link'
import { FaArrowRightLong  as ArrowRightIcon } from 'react-icons/fa6'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Remembo - Tu herramienta de estudio inteligente',
  description: 'Crea flashcards, realiza quices diarios y mejora tu aprendizaje con estadísticas detalladas',
}

export default function HomePage() {
  const features = [
    {
      title: "Flashcards Personalizadas",
      description: "Crea y organiza tus propios mazos de tarjetas de estudio con texto, imágenes y formato",
      icon: "📚"
    },
    {
      title: "Quices Diarios",
      description: "Practica con tests generados automáticamente basados en tu progreso de aprendizaje",
      icon: "📝"
    },
    {
      title: "Estadísticas Detalladas",
      description: "Sigue tu progreso con gráficos y métricas de tu rendimiento de estudio",
      icon: "📊"
    },
    {
      title: "Sistema de Repetición",
      description: "Algoritmo inteligente que optimiza tu tiempo de estudio basado en tu memoria",
      icon: "⏳"
    }
  ]

  return (
    <div className={`min-h-screen ${inter.className}`}>
      {/* Hero Section */}
      <header className="bg-gradient-to-b from-indigo-600 to-purple-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Transforma tu manera de estudiar con
            <span className="block mt-3 text-purple-200">Remembo</span>
          </h1>
          <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
            La plataforma de aprendizaje inteligente que se adapta a tu ritmo y mejora tu retención de conocimientos
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/account"
              className="bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-all flex items-center"
            >
              Comenzar ahora
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Características principales
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-indigo-600 mb-2">50k+</div>
              <div className="text-gray-600">Estudiantes activos</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">10M+</div>
              <div className="text-gray-600">Flashcards creadas</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-indigo-600 mb-2">95%</div>
              <div className="text-gray-600">Mejora en retención</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para revolucionar tu estudio?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Regístrate gratis y comienza a aprender de manera más inteligente
          </p>
          <Link
            href="/account"
            className="inline-block bg-indigo-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-600 transition-colors"
          >
            Empieza ahora - Es gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">
            © 2024 Remembo. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}