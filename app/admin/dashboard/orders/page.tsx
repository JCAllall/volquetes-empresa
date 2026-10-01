'use client'

import { useEffect, useState } from 'react'
import { API_URL, authHeaders } from '@/lib/api'
import { useAdminAuth } from '@/lib/useAdminAuth'
import AdminNav from '@/components/AdminNav'

interface Order {
  id: string
  status: string
  total: number
  delivery_address: string
  created_at: string
  company: { id: string; name: string } | null
  user: { id: string; name: string } | null
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-blue-100 text-blue-800',
  assigned: 'bg-purple-100 text-purple-800',
  delivered: 'bg-orange-100 text-orange-800',
  picked_up: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function AdminOrdersPage() {
  const token = useAdminAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    fetch(`${API_URL}/orders`, { headers: authHeaders(token) })
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [token])

  if (!token) return null

  return (
    <div className="min-h-screen bg-brand-50">
      <AdminNav />

      <main className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold text-brand-700 mb-6">Órdenes</h2>

        {loading ? (
          <p className="text-gray-500">Cargando órdenes...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No hay órdenes todavía.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm p-5">
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">ID: {order.id.slice(0, 8)}...</p>
                    <p className="font-medium text-gray-800">{order.delivery_address ?? 'Sin dirección'}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {order.company?.name ?? 'Empresa sin datos'} · {order.user?.name ?? 'Cliente sin datos'}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(order.created_at).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[order.status] ?? 'bg-gray-100 text-gray-800'}`}>
                      {order.status}
                    </span>
                    <p className="text-lg font-semibold text-gray-800 mt-2">
                      ${Number(order.total).toLocaleString('es-AR')}
                    </p>
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
