'use client'

import { useEffect, useState } from 'react'
import { API_URL, authHeaders } from '@/lib/api'
import { useAdminAuth } from '@/lib/useAdminAuth'
import AdminNav from '@/components/AdminNav'

interface User {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  created_at: string
}

const roleColors: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-800',
  company: 'bg-blue-100 text-blue-800',
  constructor: 'bg-gray-100 text-gray-800',
}

export default function AdminUsersPage() {
  const token = useAdminAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    fetch(`${API_URL}/users`, { headers: authHeaders(token) })
      .then((r) => r.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [token])

  if (!token) return null

  return (
    <div className="min-h-screen bg-brand-50">
      <AdminNav />

      <main className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold text-brand-700 mb-6">Usuarios</h2>

        {loading ? (
          <p className="text-gray-500">Cargando usuarios...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-500">No hay usuarios registrados todavía.</p>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Contacto</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Rol</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase">Alta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-5 py-3 text-gray-800">{user.name}</td>
                    <td className="px-5 py-3 text-gray-500 text-sm">
                      {user.email}
                      {user.phone && <span className="block">{user.phone}</span>}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${roleColors[user.role] ?? 'bg-gray-100 text-gray-800'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-sm">
                      {new Date(user.created_at).toLocaleDateString('es-AR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
