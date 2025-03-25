import type React from "react"
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

interface LayoutProps {
  children: React.ReactNode
  pattern?: boolean
}

export default function AuthLayout({ children, pattern = true }: LayoutProps) {
  return (
    <div className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50`}>
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Sección izquierda con diseño */}
        <div className="hidden w-full lg:flex lg:h-screen lg:w-1/2 lg:flex-col lg:justify-between p-12 relative">
          {pattern && (
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-95">
              <div className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/oriental-tiles.png')] opacity-15 mix-blend-soft-light"></div>
            </div>
          )}

          <Link href="/" className="z-10 text-2xl font-bold text-white">
            Remembo
          </Link>

          <div className="z-10 space-y-4 text-white">
            <h2 className="text-4xl font-bold">Domina tu aprendizaje</h2>
            <p className="text-lg opacity-90">
              Únete a miles de estudiantes mejorando sus resultados con nuestro sistema inteligente
            </p>
          </div>
        </div>

        {/* Sección derecha del formulario */}
        <div className="flex flex-1 items-center justify-center p-4 sm:p-8 lg:p-12">
          <div className="w-full max-w-md space-y-8 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 backdrop-blur-lg p-8 shadow-xl border border-white/20">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}