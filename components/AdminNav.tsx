'use client'

import { useRouter, usePathname } from 'next/navigation'
import { logout } from '@/lib/api'

const links = [
  { href: '/admin/dashboard', label: 'Resumen' },
  { href: '/admin/dashboard/companies', label: 'Empresas' },
  { href: '/admin/dashboard/users', label: 'Usuarios' },
  { href: '/admin/dashboard/orders', label: 'Órdenes' },
]

export default function AdminNav() {
  const router = useRouter()
  const pathname = usePathname()

  function handleLogout() {
    logout()
    router.push('/admin/login')
  }

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center flex-wrap gap-3">
      <div className="flex items-center gap-6 flex-wrap">
        <h1 className="text-xl font-bold text-gray-800">Volquetes — Panel Admin</h1>
        <div className="flex gap-4">
          {links.map((link) => (
            <button
              key={link.href}
              onClick={() => router.push(link.href)}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="text-sm text-red-600 hover:text-red-800 transition-colors"
      >
        Cerrar sesión
      </button>
    </nav>
  )
}
