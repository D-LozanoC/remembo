'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface AccountNavProps {
  className?: string
}

export function AccountNav({ className = '' }: AccountNavProps) {
  const pathname = usePathname()

  const links = [
    { href: '/home/account', label: 'Perfil', emoji: '👤' },
    { href: '/home/account/settings', label: 'Ajustes', emoji: '⚙️' },
    { href: '/home/account/security', label: 'Seguridad', emoji: '🔒' },
  ].map((link) => ({
    ...link,
    current: pathname === link.href,
  }))

  return (
    <aside className={`w-full md:w-64 md:min-h-screen bg-white shadow-lg md:shadow-none ${className}`}>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Mi Cuenta</h2>
        <nav>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 ease-in-out transform ${
                    link.current
                      ? 'bg-blue-100 text-blue-600 font-semibold shadow-md translate-x-1 border-r-4 border-blue-600'
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm hover:translate-x-1'
                  }`}
                >
                  <span className="mr-2">{link.emoji}</span> {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
