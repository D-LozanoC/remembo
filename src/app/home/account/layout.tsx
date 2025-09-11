import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getUser } from '@/utils/getUser'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/atoms/Avatar'
import { AccountNav } from '@/shared/sections/components/AccountNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mi Cuenta',
  description: 'Administra tu cuenta y configuración personal',
}

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Tu Perfil</h2>
        <p className="text-gray-600">No se encontró un usuario autenticado.</p>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
      <div className="md:flex">
        <AccountNav />

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 lg:p-12">
          {/* Header */}
          <header className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Bienvenido, {user?.name || 'Usuario'}
                </h1>
                <p className="text-gray-600 mt-1">
                  Administra tu cuenta y configuración
                </p>
              </div>
              <Avatar className="h-24 w-24">
                {user?.image ? (
                  <AvatarImage
                    src={`/api/user/image?ts=${Date.now()}`}
                    alt={`Avatar de ${user.name}`}
                    className="border-2 border-primary"
                  />
                ) : (
                  <AvatarFallback className="bg-indigo-100 text-3xl font-semibold text-indigo-600">
                    {user?.name?.[0] || user?.email?.[0] || 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
          </header>

          {/* Page Content */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            {children}
          </div>

          {/* Footer */}
          <footer className="mt-8 text-center text-gray-600 text-sm">
            <p> 2024 Remembo. Todos los derechos reservados.</p>
          </footer>
        </main>
      </div>
    </div>
  )
}
