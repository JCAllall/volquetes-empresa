'use client'

import { useEffect, useState } from 'react'
import { API_URL, authHeaders } from '@/lib/api'
import { useAdminAuth } from '@/lib/useAdminAuth'
import AdminNav from '@/components/AdminNav'

interface Company {
  id: string
  approved: boolean
}

interface User {
  id: string
}

interface Order {
  id: string
  status: string
}

export default function AdminDashboardPage() {
  const token = useAdminAuth()
  const [companies, setCompanies] = useState<Company[] | null>(null)
  const [users, setUsers] = useState<User[] | null>(null)
  const [orders, setOrders] = useState<Order[] | null>(null)

  useEffect(() => {
    if (!token) return

    const headers = authHeaders(token)

    Promise.all([
      fetch(`${API_URL}/companies`, { headers }).then((r) => (r.ok ? r.json() : [])),
      fetch(`${API_URL}/users`, { headers }).then((r) => (r.ok ? r.json() : [])),
      fetch(`${API_URL}/orders`, { headers }).then((r) => (r.ok ? r.json() : [])),
    ]).then(([companiesData, usersData, ordersData]) => {
      setCompanies(Array.isArray(companiesData) ? companiesData : [])
      setUsers(Array.isArray(usersData) ? usersData : [])
      setOrders(Array.isArray(ordersData) ? ordersData : [])
    })
  }, [token])

  const loading = companies === null || users === null || orders === null
  const pendingCompanies = companies?.filter((c) => !c.approved).length ?? 0
  const activeOrders = orders?.filter(
    (o) => o.status !== 'completed' && o.status !== 'cancelled',
  ).length ?? 0

  const stats = [
    { label: 'Empresas', value: companies?.length ?? 0, sub: `${pendingCompanies} pendientes de aprobación` },
    { label: 'Usuarios', value: users?.length ?? 0, sub: 'Registrados en la plataforma' },
    { label: 'Órdenes', value: orders?.length ?? 0, sub: `${activeOrders} en curso` },
  ]

  if (!token) return null

  return (
    <div className="min-h-screen bg-brand-50">
      <AdminNav />

      <main className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold text-brand-700 mb-6">Resumen</h2>

        {loading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-lg shadow-sm p-5">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-2">{stat.sub}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
