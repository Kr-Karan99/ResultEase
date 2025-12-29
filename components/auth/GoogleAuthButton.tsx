'use client'

import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface GoogleAuthButtonProps {
  variant?: 'default' | 'outline' | 'school-blue'
  size?: 'default' | 'lg'
  className?: string
  showIcon?: boolean
}

/**
 * Google Sign-In Button Component
 * Handles both Sign In and Sign Up flows
 * Firebase automatically creates new users on first sign-in
 */
export function GoogleAuthButton({
  variant = 'default',
  size = 'default',
  className = '',
  showIcon = true,
}: GoogleAuthButtonProps) {
  const { loginWithGoogle, loading } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    try {
      setError(null)
      await loginWithGoogle()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in'
      setError(errorMessage)
      console.error('Sign-in error:', err)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={handleClick}
        disabled={loading}
        variant={variant}
        size={size}
        className={className}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? 'Signing in...' : 'Continue with Google'}
      </Button>
      {error && <p className="text-xs text-red-600 text-center">{error}</p>}
    </div>
  )
}
