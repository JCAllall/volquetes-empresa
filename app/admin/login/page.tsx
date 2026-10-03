'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { API_URL } from '@/lib/api'
import AuthHeader from '@/components/AuthHeader'
import AuthCard from '@/components/AuthCard'
import AuthFooterNote from '@/components/AuthFooterNote'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError('Email o contraseña incorrectos')
        return
      }

      if (data.user?.role !== 'admin') {
        setError('Esta cuenta no tiene permisos de administrador')
        return
      }

      localStorage.setItem('admin_token', data.access_token)
      localStorage.setItem('admin_user', JSON.stringify(data.user))
      router.push('/admin/dashboard')

    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm flex flex-col items-center">
        <AuthHeader subtitle="Panel de administración" />

        <AuthCard label="Acceso">
          <div className="mb-4">
            <label className="block text-[11px] font-bold uppercase tracking-wide text-brand-500 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full border-[1.5px] border-brand-200 rounded-md px-3 py-2.5 text-[15px] text-brand-700 bg-brand-50 focus:outline-none focus:border-brand-600"
              placeholder="admin@bilny.com"
            />
          </div>

          <div className="mb-2">
            <label className="block text-[11px] font-bold uppercase tracking-wide text-brand-500 mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full border-[1.5px] border-brand-200 rounded-md px-3 py-2.5 text-[15px] text-brand-700 bg-brand-50 focus:outline-none focus:border-brand-600"
              placeholder="••••••••"
            />
          </div>

          <div className="flex justify-end mb-5">
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-brand-500 hover:text-brand-700 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-accent-500 text-brand-700 py-2.5 px-4 rounded-md hover:bg-accent-600 disabled:opacity-50 transition-colors font-extrabold uppercase tracking-wide text-[13px]"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </AuthCard>

        <AuthFooterNote />
      </div>
    </div>
  )
}
