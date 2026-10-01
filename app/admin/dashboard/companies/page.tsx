'use client'

import { useEffect, useState } from 'react'
import { API_URL, authHeaders } from '@/lib/api'
import { useAdminAuth } from '@/lib/useAdminAuth'
import AdminNav from '@/components/AdminNav'

interface Company {
  id: string
  name: string
  cuit: string
  email: string
  phone: string
  approved: boolean
  commission_pct: number
  created_at: string
}

export default function AdminCompaniesPage() {
  const token = useAdminAuth()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [approvingId, setApprovingId] = useState<string | null>(null)

  function loadCompanies(authToken: string) {
    return fetch(`${API_URL}/companies`, { headers: authHeaders(authToken) })
      .then((r) => r.json())
      .then((data) => setCompanies(Array.isArray(data) ? data : []))
  }

  useEffect(() => {
    if (!token) return
    loadCompanies(token).finally(() => setLoading(false))
  }, [token])

  async function handleApprove(id: string) {
    if (!token) return
    setApprovingId(id)
    await fetch(`${API_URL}/companies/${id}/approve`, {
      method: 'PATCH',
      headers: authHeaders(token),
    })
    await loadCompanies(token)
    setApprovingId(null)
  }

  if (!token) return null

  return (
    <div className="min-h-screen bg-brand-50">
      <AdminNav />

      <main className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold text-brand-700 mb-6">Empresas</h2>

        {loading ? (
          <p className="text-gray-500">Cargando empresas...</p>
        ) : companies.length === 0 ? (
          <p className="text-gray-500">No hay empresas registradas todavía.</p>
        ) : (
          <div className="space-y-4">
            {companies.map((company) => (
              <div key={company.id} className="bg-white rounded-lg shadow-sm p-5">
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div>
                    <p className="font-medium text-gray-800">{company.name}</p>
                    <p className="text-sm text-gray-500">{company.email} · {company.phone}</p>
                    <p className="text-sm text-gray-500">CUIT: {company.cuit}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Comisión: {company.commission_pct}% · Alta: {new Date(company.created_at).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  <div className="text-right">
                    {company.approved ? (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                        Aprobada
                      </span>
                    ) : (
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                          Pendiente
                        </span>
                        <button
                          onClick={() => handleApprove(company.id)}
                          disabled={approvingId === company.id}
                          className="text-sm bg-accent-500 text-white px-3 py-1.5 rounded-md hover:bg-accent-600 disabled:opacity-50 transition-colors font-medium"
                        >
                          {approvingId === company.id ? 'Aprobando...' : 'Aprobar'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
