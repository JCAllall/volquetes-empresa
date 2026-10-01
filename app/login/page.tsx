'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('https://bolquetes-api-production.up.railway.app/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError('Email o contraseña incorrectos')
        return
      }

      localStorage.setItem('token', data.access_token)
      router.push('/dashboard')

    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-brand-100">
        <div className="flex flex-col items-center gap-2 mb-6">
          <Logo size={40} />
          <p className="text-sm text-brand-500 font-medium">Panel de empresas</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-brand-600 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full border border-brand-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-500"
            placeholder="contacto@empresa.com"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-brand-600 mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full border border-brand-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-500"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-accent-500 text-white py-2 px-4 rounded-md hover:bg-accent-600 disabled:opacity-50 transition-colors font-medium"
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </div>
    </div>
  )
}