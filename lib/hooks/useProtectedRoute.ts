'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

/**
 * Hook to protect routes requiring authentication
 * Redirects to marketing page if user is not authenticated
 * 
 * Usage in any page/component:
 * ```
 * export default function ProtectedPage() {
 *   useProtectedRoute()
 *   return <YourComponent />
 * }
 * ```
 */
export function useProtectedRoute() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuth()

  useEffect(() => {
    // Don't redirect while loading
    if (loading) return

    // Redirect to marketing page if not authenticated
    if (!user) {
      router.push('/marketing')
    }
  }, [user, loading, router])

  // Show nothing while checking auth or redirecting
  if (loading || !user) {
    return null
  }
}

/**
 * Hook to redirect authenticated users away from public pages
 * Redirects to dashboard if user is already authenticated
 * 
 * Usage in public pages like landing page:
 * ```
 * export default function MarketingPage() {
 *   usePublicOnlyRoute()
 *   return <YourComponent />
 * }
 * ```
 */
export function usePublicOnlyRoute() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    // Don't redirect while loading
    if (loading) return

    // Redirect to dashboard if already authenticated
    if (user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])
}

/**
 * Component wrapper for protecting routes
 * Usage:
 * ```
 * <ProtectedRoute>
 *   <YourComponent />
 * </ProtectedRoute>
 * ```
 */
interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return fallback || <div>Loading...</div>
  }

  if (!user) {
    return null // useProtectedRoute hook in page will redirect
  }

  return <>{children}</>
}
