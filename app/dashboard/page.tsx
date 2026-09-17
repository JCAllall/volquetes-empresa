'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Order {
  id: string
  status: string
  total: number
  delivery_address: string
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetch('https://bolquetes-api-production.up.railway.app/orders', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setOrders(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [router])

  function handleLogout() {
    localStorage.removeItem('token')
    router.push('/login')
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

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Volquetes — Panel Empresas</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:text-red-800 transition-colors"
        >
          Cerrar sesión
        </button>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Órdenes</h2>

        {loading ? (
          <p className="text-gray-500">Cargando órdenes...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No hay órdenes todavía.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} onClick={() => router.push(`/dashboard/orders/${order.id}`)} className="bg-white rounded-lg shadow-sm p-5 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">ID: {order.id.slice(0, 8)}...</p>
                    <p className="font-medium text-gray-800">{order.delivery_address ?? 'Sin dirección'}</p>
                    <p className="text-sm text-gray-500 mt-1">
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