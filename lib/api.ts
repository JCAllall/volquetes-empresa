export const API_URL = 'https://bolquetes-api-production.up.railway.app'

export interface StoredUser {
  id: string
  name: string
  email: string
  role: string
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('admin_token')
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('admin_user')
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredUser
  } catch {
    return null
  }
}

export function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` }
}

export function logout() {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_user')
}
