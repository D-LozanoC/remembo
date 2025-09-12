'use client'

import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { HiMenu, HiX } from 'react-icons/hi'
import { LogoutButton } from './LogoutButton'

export function MainLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession()
    const pathname = usePathname()
    const [isAdmin, setIsAdmin] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    const navigation = [
        { name: 'Repositorio', href: '/home/repository', protected: true, admin: false },
        { name: 'Sesiones de Estudio', href: '/home/study', protected: true, admin: false },
        { name: 'Admin stats', href: '/home/general-stats', protected: true, admin: true },
        { name: 'Información del proyecto', href: '/home/project-info', protected: false, admin: false },
    ]

    useEffect(() => {
        async function fetchUserRole() {
            try {
                const response = await fetch('/api/user/admin')
                const data = await response.json()
                setIsAdmin(data.role === 'admin')
            } catch (error) {
                console.error('Error fetching user role:', error)
            }
        }

        if (session?.user) {
            fetchUserRole()
        } else {
            setIsAdmin(false)
        }
    }, [session?.user])

    if (status === 'loading') return <div>Cargando...</div>

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Barra de navegación */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link href="/" className="text-xl font-bold text-indigo-600">
                            Remembo
                        </Link>

                        {/* Botón móvil */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="text-gray-600 hover:text-indigo-600"
                            >
                                {mobileOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
                            </button>
                        </div>

                        {/* Menú central (desktop) */}
                        <div className="hidden md:flex space-x-8">
                            {navigation.map((item) => (
                                (((session || !item.protected) && !item.admin) || (isAdmin && item.admin)) && (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`${pathname === item.href
                                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                                            : 'text-gray-600 hover:text-indigo-600'
                                            } px-3 py-2 text-sm font-medium transition-colors`}
                                    >
                                        {item.name}
                                    </Link>
                                )
                            ))}
                        </div>

                        {/* Acciones de usuario (desktop) */}
                        <div className="hidden md:flex items-center gap-4">
                            {session?.user ? (
                                <>
                                    <Link
                                        href="/home/account"
                                        className="text-gray-600 hover:text-indigo-600 text-sm"
                                    >
                                        Mi Cuenta
                                    </Link>
                                    <LogoutButton />
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/auth/login"
                                        className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm"
                                    >
                                        Iniciar sesión
                                    </Link>
                                    <Link
                                        href="/auth/register"
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm"
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Menú móvil con animación */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                        mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className="px-4 pb-3 space-y-2">
                        {navigation.map((item) => (
                            (((session || !item.protected) && !item.admin) || (isAdmin && item.admin)) && (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`${pathname === item.href
                                        ? 'text-indigo-600 font-semibold'
                                        : 'text-gray-600 hover:text-indigo-600'
                                        } block px-3 py-2 text-sm transition-colors`}
                                >
                                    {item.name}
                                </Link>
                            )
                        ))}

                        <div className="border-t pt-3">
                            {session?.user ? (
                                <>
                                    <Link
                                        href="/home/account"
                                        onClick={() => setMobileOpen(false)}
                                        className="block text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm"
                                    >
                                        Mi Cuenta
                                    </Link>
                                    <LogoutButton />
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/auth/login"
                                        onClick={() => setMobileOpen(false)}
                                        className="block text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm"
                                    >
                                        Iniciar sesión
                                    </Link>
                                    <Link
                                        href="/auth/register"
                                        onClick={() => setMobileOpen(false)}
                                        className="block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm"
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Contenido principal */}
            <main>{children}</main>
        </div>
    )
}
