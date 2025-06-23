import type React from "react"
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

interface LayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: LayoutProps) {
  return (
    <section className={`${inter.className} min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 backdrop-blur-lg flex flex-1 items-center justify-center p-4`}>
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white white p-8 shadow-xl border border-white/20">
        {children}
      </div>
    </section>
  )
}