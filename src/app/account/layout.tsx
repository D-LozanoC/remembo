import { Metadata } from 'next'
import Link from 'next/link'
import { Inter } from 'next/font/google'

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
    <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
      <div className="md:flex">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 md:min-h-screen bg-white shadow-lg md:shadow-none">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Mi Cuenta</h2>
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/account"
                    className="flex items-center p-3 rounded-lg hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <span className="mr-2">🏠</span> Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account/profile"
                    className="flex items-center p-3 rounded-lg hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <span className="mr-2">👤</span> Perfil
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account/settings"
                    className="flex items-center p-3 rounded-lg hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <span className="mr-2">⚙️</span> Configuración
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account/billing"
                    className="flex items-center p-3 rounded-lg hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <span className="mr-2">💳</span> Facturación
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account/security"
                    className="flex items-center p-3 rounded-lg hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <span className="mr-2">🔒</span> Seguridad
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

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