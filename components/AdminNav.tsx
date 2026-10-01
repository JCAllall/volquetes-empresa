'use client'

import { useRouter, usePathname } from 'next/navigation'
import { logout } from '@/lib/api'
import Logo from '@/components/Logo'

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
    <nav className="bg-brand-700 px-6 py-4 flex justify-between items-center flex-wrap gap-3">
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-2">
          <Logo variant="light" size={30} />
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-200 border-l border-brand-500 pl-2">
            Admin
          </span>
        </div>
        <div className="flex gap-4">
          {links.map((link) => (
            <button
              key={link.href}
              onClick={() => router.push(link.href)}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'text-accent-400'
                  : 'text-brand-200 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="text-sm text-red-400 hover:text-red-300 transition-colors"
      >
        Cerrar sesión
      </button>
    </nav>
  )
}
