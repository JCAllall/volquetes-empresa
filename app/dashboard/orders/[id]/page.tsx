'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

interface Order {
  id: string
  status: string
  total: number
  delivery_address: string
  delivery_lat: number
  delivery_lng: number
  notes: string
  created_at: string
  user: { id: string; name: string; email: string; phone: string }
  driver: { id: string; name: string; phone: string } | null
  vehicle: { id: string; plate: string; type: string } | null
}

interface Driver {
  id: string
  name: string
}

interface Vehicle {
  id: string
  plate: string
  type: string
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

const nextStatus: Record<string, string> = {
  pending: 'accepted',
  accepted: 'assigned',
  assigned: 'delivered',
  delivered: 'picked_up',
  picked_up: 'completed',
}

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedDriver, setSelectedDriver] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const API = 'https://bolquetes-api-production.up.railway.app'

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }

    const headers = { Authorization: `Bearer ${token}` }

    Promise.all([
      fetch(`${API}/orders/${id}`, { headers }).then(r => r.json()),
      fetch(`${API}/drivers/company/${id}`, { headers }).then(r => r.json()),
      fetch(`${API}/vehicles/company/${id}`, { headers }).then(r => r.json()),
    ]).then(([orderData, driversData, vehiclesData]) => {
      setOrder(orderData)
      setDrivers(Array.isArray(driversData) ? driversData : [])
      setVehicles(Array.isArray(vehiclesData) ? vehiclesData : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id, router])

  async function updateStatus() {
    if (!order) return
    const token = localStorage.getItem('token')
    setUpdating(true)
    await fetch(`${API}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: nextStatus[order.status] }),
    })
    const updated = await fetch(`${API}/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json())
    setOrder(updated)
    setUpdating(false)
  }

  async function assignDriver() {
    if (!selectedDriver || !selectedVehicle) return
    const token = localStorage.getItem('token')
    setUpdating(true)
    await fetch(`${API}/orders/${id}/assign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ driver_id: selectedDriver, vehicle_id: selectedVehicle }),
    })
    const updated = await fetch(`${API}/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json())
    setOrder(updated)
    setUpdating(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Cargando...</p></div>
  if (!order) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Orden no encontrada</p></div>

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center gap-4">
        <button onClick={() => router.push('/dashboard')} className="text-gray-500 hover:text-gray-800">← Volver</button>
        <h1 className="text-xl font-bold text-gray-800">Detalle de Orden</h1>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">

        {/* Estado */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">ID: {order.id.slice(0, 8)}...</p>
              <p className="text-lg font-semibold text-gray-800 mt-1">{order.delivery_address ?? 'Sin dirección'}</p>
              <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('es-AR')}</p>
            </div>
            <div className="text-right">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[order.status]}`}>
                {order.status}
              </span>
              <p className="text-2xl font-bold text-gray-800 mt-2">${Number(order.total).toLocaleString('es-AR')}</p>
            </div>
          </div>

          {nextStatus[order.status] && (
            <button
              onClick={updateStatus}
              disabled={updating}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {updating ? 'Actualizando...' : `Avanzar a "${nextStatus[order.status]}"`}
            </button>
          )}
        </div>

        {/* Cliente */}
        {order.user && (
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h3 className="font-semibold text-gray-700 mb-3">Cliente</h3>
            <p className="text-gray-800">{order.user.name}</p>
            <p className="text-sm text-gray-500">{order.user.email}</p>
            {order.user.phone && <p className="text-sm text-gray-500">{order.user.phone}</p>}
          </div>
        )}

        {/* Conductor y vehículo */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-3">Conductor y Vehículo</h3>
          {order.driver ? (
            <div className="space-y-1">
              <p className="text-gray-800">🧑 {order.driver.name}</p>
              <p className="text-gray-800">🚛 {order.vehicle?.plate} — {order.vehicle?.type}</p>
            </div>
          ) : (
            <div className="space-y-3">
              <select
                value={selectedDriver}
                onChange={e => setSelectedDriver(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Seleccionar conductor</option>
                {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <select
                value={selectedVehicle}
                onChange={e => setSelectedVehicle(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Seleccionar vehículo</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.plate} — {v.type}</option>)}
              </select>
              <button
                onClick={assignDriver}
                disabled={!selectedDriver || !selectedVehicle || updating}
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {updating ? 'Asignando...' : 'Asignar'}
              </button>
            </div>
          )}
        </div>

        {/* Notas */}
        {order.notes && (
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h3 className="font-semibold text-gray-700 mb-2">Notas</h3>
            <p className="text-gray-600">{order.notes}</p>
          </div>
        )}

      </main>
    </div>
  )
}