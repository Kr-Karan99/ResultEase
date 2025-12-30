'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'
import { Card } from '@/components/ui/card'

/**
 * Modern Login Page
 * Beautiful, attractive design with Google authentication
 */
export default function LoginPage() {
  const router = useRouter()
  const { user, firebaseUser, loading } = useAuth()

  // Redirect to onboarding if authenticated but not onboarded
  // Or to dashboard/intended page if already onboarded
  // Check if user is a member first
  useEffect(() => {
    const checkUserStatus = async () => {
      if (!loading && user && firebaseUser && firebaseUser.email) {
        // Import here to avoid issues
        const { firebaseUserRepository } = await import('@/infrastructure/firebase/FirebaseUserRepository')
        
        // Check if user has completed onboarding
        const hasOnboarded = await firebaseUserRepository.hasCompletedOnboarding(firebaseUser.email)
        
        if (hasOnboarded) {
          // Already onboarded, check if there's a redirect URL
          const redirectUrl = sessionStorage.getItem('redirectAfterLogin')
          if (redirectUrl) {
            sessionStorage.removeItem('redirectAfterLogin')
            router.push(redirectUrl)
          } else {
            router.push('/dashboard')
          }
        } else {
          // Not onboarded - check if they're a member
          console.log('Checking if user is a member...')
          router.push('/onboarding')
        }
      }
    }
    
    checkUserStatus()
  }, [user, firebaseUser, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-soft-light opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-soft-light opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white rounded-full mix-blend-soft-light opacity-5"></div>
      </div>

      {/* Main content */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left side - Branding & Info */}
          <div className="text-white space-y-8 hidden lg:block">
            <Link href="/" className="inline-flex items-center space-x-3 mb-8">
              <Image
                src="/result_ease_logo.png"
                alt="ResultEase Logo"
                width={60}
                height={60}
                className="object-contain drop-shadow-lg"
                priority
              />
              <span className="font-bold text-3xl">ResultEase</span>
            </Link>

            <div className="space-y-6">
              <h1 className="text-5xl font-bold leading-tight">
                Welcome to the Future of
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                  Result Analysis
                </span>
              </h1>
              
              <p className="text-xl text-blue-100 leading-relaxed">
                Join thousands of educators who are transforming their result management with our powerful, intuitive platform.
              </p>

              <div className="space-y-4 pt-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Instant Analysis</h3>
                    <p className="text-blue-100">Get comprehensive insights in seconds</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Visual Reports</h3>
                    <p className="text-blue-100">Beautiful charts and professional PDFs</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Secure & Private</h3>
                    <p className="text-blue-100">Your data is encrypted and protected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login Card */}
          <div className="w-full">
            <Card className="p-8 md:p-12 bg-white/95 backdrop-blur-xl shadow-2xl border-0 rounded-3xl">
              {/* Mobile logo */}
              <div className="lg:hidden text-center mb-8">
                <Link href="/" className="inline-flex items-center space-x-3">
                  <Image
                    src="/result_ease_logo.png"
                    alt="ResultEase Logo"
                    width={50}
                    height={50}
                    className="object-contain"
                    priority
                  />
                  <span className="font-bold text-2xl text-gray-900">ResultEase</span>
                </Link>
              </div>

              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Sign In
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Continue your journey to better result management
                  </p>
                </div>

                {/* Google Sign In Button */}
                <div className="space-y-4 pt-4">
                  <GoogleAuthButton 
                    variant="school" 
                    size="lg" 
                    className="w-full text-lg py-7 rounded-xl shadow-lg hover:shadow-xl transition-all" 
                  />

                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span>Secure sign-in with Google</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="pt-6 space-y-3 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">What you'll get:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-sm text-gray-600">Unlimited uploads</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-sm text-gray-600">Smart analytics</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-sm text-gray-600">Export reports</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-sm text-gray-600">Cloud storage</span>
                    </div>
                  </div>
                </div>

                {/* Privacy notice */}
                <div className="pt-6 text-center border-t border-gray-100">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    By signing in, you agree to our{' '}
                    <Link href="/terms" className="text-blue-600 hover:underline font-medium">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-blue-600 hover:underline font-medium">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>
            </Card>

            {/* Back to home link */}
            <div className="text-center mt-6">
              <Link 
                href="/" 
                className="inline-flex items-center space-x-2 text-white hover:text-blue-100 transition-colors font-medium"
              >
                <span>←</span>
                <span>Back to home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-white/60 text-sm">
          Trusted by 100+ schools and educators worldwide
        </p>
      </div>
    </div>
  )
}

