'use client'

import { useState } from 'react'
import Link from 'next/link'
import { API_URL } from '@/lib/api'
import AuthHeader from '@/components/AuthHeader'
import AuthCard from '@/components/AuthCard'
import AuthFooterNote from '@/components/AuthFooterNote'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setError('')
    if (!email) {
      setError('Ingresá tu email.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setSent(true)
      } else {
        setError('No pudimos procesar la solicitud. Probá de nuevo en un momento.')
      }
    } catch {
      setError('Error de conexión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm flex flex-col items-center">
        <AuthHeader subtitle="Recuperar contraseña" />

        <AuthCard label="Recuperación">
          {sent ? (
            <div className="text-center">
              <p className="text-sm text-brand-700 mb-1">
                Listo. Si <span className="font-semibold">{email}</span> está registrado,
                te llegó un email con el link para restablecer tu contraseña.
              </p>
              <p className="text-xs text-brand-400 mt-3">
                Revisá también la carpeta de spam. El link vence en 1 hora.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-5">
                <label className="block text-[11px] font-bold uppercase tracking-wide text-brand-500 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="w-full border-[1.5px] border-brand-200 rounded-md px-3 py-2.5 text-[15px] text-brand-700 bg-brand-50 focus:outline-none focus:border-brand-600"
                  placeholder="contacto@empresa.com"
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
                {loading ? 'Enviando...' : 'Enviar link'}
              </button>
            </>
          )}
        </AuthCard>

        <Link
          href="/login"
          className="mt-5 text-xs font-medium text-brand-500 hover:text-brand-700 transition-colors"
        >
          ← Volver a iniciar sesión
        </Link>

        <AuthFooterNote />
      </div>
    </div>
  )
}
