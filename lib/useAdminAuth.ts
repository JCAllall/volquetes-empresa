'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStoredUser, getToken, logout } from './api'

/**
 * Redirects to /admin/login if there is no admin token or the stored user isn't an admin.
 * Returns the current token once the check has passed (null while unauthorized/redirecting).
 */
export function useAdminAuth(): string | null {
  const router = useRouter()
  const [token] = useState(() => getToken())
  const [user] = useState(() => getStoredUser())

  const authorized = !!token && user?.role === 'admin'

  useEffect(() => {
    if (!authorized) {
      logout()
      router.push('/admin/login')
    }
  }, [authorized, router])

  return authorized ? token : null
}
