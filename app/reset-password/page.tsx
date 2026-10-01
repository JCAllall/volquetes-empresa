'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { API_URL } from '@/lib/api'
import AuthHeader from '@/components/AuthHeader'
import AuthCard from '@/components/AuthCard'
import AuthFooterNote from '@/components/AuthFooterNote'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setError('')

    if (!token) {
      setError('El link no es válido. Pedí uno nuevo desde "¿Olvidaste tu contraseña?".')
      return
    }
    if (password.length < 8) {
      setError('La contraseña tiene que tener al menos 8 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message ?? 'El link es inválido o expiró.')
        return
      }

      setSuccess(true)
    } catch {
      setError('Error de conexión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm flex flex-col items-center">
        <AuthHeader subtitle="Nueva contraseña" />

        <AuthCard label="Restablecer">
          {success ? (
            <div className="text-center">
              <p className="text-sm text-brand-700 mb-5">
                Listo, tu contraseña se actualizó correctamente.
              </p>
              <Link
                href="/login"
                className="inline-block w-full bg-accent-500 text-brand-700 py-2.5 px-4 rounded-md hover:bg-accent-600 transition-colors font-extrabold uppercase tracking-wide text-[13px]"
              >
                Ir a iniciar sesión
              </Link>
            </div>
          ) : !token ? (
            <div className="text-center">
              <p className="text-sm text-red-500 mb-4">
                Este link no es válido o ya fue usado.
              </p>
              <Link
                href="/forgot-password"
                className="inline-block w-full bg-accent-500 text-brand-700 py-2.5 px-4 rounded-md hover:bg-accent-600 transition-colors font-extrabold uppercase tracking-wide text-[13px]"
              >
                Pedir un link nuevo
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-[11px] font-bold uppercase tracking-wide text-brand-500 mb-1.5">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-[1.5px] border-brand-200 rounded-md px-3 py-2.5 text-[15px] text-brand-700 bg-brand-50 focus:outline-none focus:border-brand-600"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <div className="mb-5">
                <label className="block text-[11px] font-bold uppercase tracking-wide text-brand-500 mb-1.5">
                  Repetir contraseña
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="w-full border-[1.5px] border-brand-200 rounded-md px-3 py-2.5 text-[15px] text-brand-700 bg-brand-50 focus:outline-none focus:border-brand-600"
                  placeholder="Repetí la contraseña"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm mb-4">{error}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-accent-500 text-brand-700 py-2.5 px-4 rounded-md hover:bg-accent-600 disabled:opacity-50 transition-colors font-extrabold uppercase tracking-wide text-[13px]"
              >
                {loading ? 'Guardando...' : 'Guardar contraseña'}
              </button>
            </>
          )}
        </AuthCard>

        <AuthFooterNote />
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  )
}
