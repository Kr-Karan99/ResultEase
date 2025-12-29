'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

/**
 * Authentication Page
 * Unified login/signup page using Google OAuth
 * Accessible at /auth
 * 
 * Features:
 * - Google Sign-In button
 * - Auto-redirect if already logged in
 * - Beautiful UI matching landing page
 * - Shows auth benefits
 */
export default function AuthPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-school-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Main content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
        {/* Header with logo */}
        <div className="mb-12 text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="flex items-center justify-center w-10 h-10 bg-school-blue text-white rounded-lg font-bold text-lg">
              RE
            </div>
            <span className="font-bold text-2xl text-gray-900">ResultEase</span>
          </Link>
        </div>

        {/* Main auth card */}
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Sign in to access your school's result analysis dashboard
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Google Sign-In Button */}
            <div className="space-y-3">
              <GoogleAuthButton variant="school" size="lg" className="w-full text-base py-6" />
              <p className="text-xs text-gray-500 text-center">
                New user? Don't worry! We'll automatically create your account on first sign-in.
              </p>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue as</span>
              </div>
            </div>

            {/* Info section */}
            <div className="space-y-3 pt-2">
              <h3 className="font-semibold text-gray-900 text-sm">Why sign in?</h3>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-school-blue font-bold mt-0.5">✓</span>
                  <span className="text-sm text-gray-600">Save your analysis reports</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-school-blue font-bold mt-0.5">✓</span>
                  <span className="text-sm text-gray-600">Track performance trends over time</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-school-blue font-bold mt-0.5">✓</span>
                  <span className="text-sm text-gray-600">Access your dashboard anytime</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-school-blue font-bold mt-0.5">✓</span>
                  <span className="text-sm text-gray-600">Generate professional reports</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Features section */}
        <div className="mt-12 w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🔐</div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">Secure Login</h3>
            <p className="text-xs text-gray-600">Powered by Google authentication</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">Instant Access</h3>
            <p className="text-xs text-gray-600">No lengthy signup process</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">Full Features</h3>
            <p className="text-xs text-gray-600">Complete access to all tools</p>
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-12 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Want to try without signing in?{' '}
            <Link href="/" className="text-school-blue font-semibold hover:underline">
              Back to home
            </Link>
          </p>
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <a href="#" className="text-school-blue hover:underline">
              Terms of Service
            </a>
            {' '}and{' '}
            <a href="#" className="text-school-blue hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
