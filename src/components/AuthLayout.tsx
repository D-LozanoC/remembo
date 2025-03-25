import type React from "react"
import Link from 'next/link'
import Image from "next/image"
import { Text } from "@/components/Text"

interface LayoutProps {
  children: React.ReactNode
  pattern?: boolean
}

export default function AuthLayout({ children, pattern = true }: LayoutProps) {
  return (
    <div className={`min-h-screen bg-blue_100`}>
      <div className="flex min-h-screen bg-blue_100 flex-col lg:flex-row">
        {/* Sección izquierda con diseño */}
        <div className="hidden w-full lg:flex lg:h-screen lg:w-1/2 lg:flex-col lg:justify-between p-12 relative">
          {pattern && (
            <div className="absolute inset-0 bg-gradient-to-br from-yellow_300 via-blue_200 to-blue_100 opacity-95">
              <div className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/oriental-tiles.png')] opacity-15 mix-blend-soft-light"></div>
            </div>
          )}

          <Link href="/" className="z-10 text-2xl font-bold text-white">
            Remembo
          </Link>

          <div className="z-10 space-y-4 text-white flex flex-col items-start justify-start">
            <Image src="/logo.svg" alt="Logo" width={100} height={100} />
            <Text size="large">Domina tu aprendizaje</Text>
            <Text size="small">Únete a miles de estudiantes mejorando sus resultados con nuestro sistema inteligente</Text>
          </div>
        </div>

        {/* Sección derecha del formulario */}
        <div className="flex flex-1 items-center justify-center p-4 sm:p-8 lg:p-12">
          <div className="w-full max-w-md space-y-8 rounded-2xl bg-blue_100 px-8 py-6 shadow-xl border border-yellow_300">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}