import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SideBar } from '@/shared/sections/account/SideBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mi Cuenta',
  description: 'Administra tu cuenta y configuración personal',
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`min-h-screen bg-blue_100 ${inter.className}`}>
      <div className="md:flex">
        {/* Sidebar Navigation */}
        <SideBar
          tituloPrincipal="Dashboard"
          sidebarFields={[
            { text: 'Home', icon: '🏠', href: '/account' },
            { text: 'Perfil', icon: '👤', href: '/account/profile' },
            { text: 'Configuración', icon: '⚙️', href: '/account/settings' },
            { text: 'Facturación', icon: '💳', href: '/account/billing' },
            { text: 'Seguridad', icon: '🔒', href: '/account/security' },
          ]}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 lg:p-12">
          {/* Header */}
          <header className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Bienvenido, Usuario</h1>
                <p className="text-gray-600 mt-1">Administra tu cuenta y configuración</p>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold text-lg">U</span>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            {children}
          </div>

          {/* Footer */}
          <footer className="mt-8 text-center text-gray-600 text-sm">
            <p>© 2024 Mi Empresa. Todos los derechos reservados.</p>
          </footer>
        </main>
      </div>
    </div>
  )
}