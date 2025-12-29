'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'
import { UserAvatar } from '@/components/auth/UserAvatar'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const pathname = usePathname()
  const { user, loading } = useAuth()
  
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/' || pathname === '/marketing'
    }
    return pathname.startsWith(path)
  }

  const navigation = [
    { name: 'Home', href: '/marketing' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Upload', href: '/upload' },
    { name: 'Reports', href: '/reports' },
  ]

  return (
    <header className={cn('bg-white border-b border-gray-200 shadow-sm', className)}>
      <div className="school-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/marketing" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-school-blue text-white rounded-lg font-bold text-sm">
                RE
              </div>
              <span className="font-semibold text-xl text-gray-900">
                ResultEase
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'bg-school-blue text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {!loading && !user ? (
              <GoogleAuthButton variant="outline" size="sm" />
            ) : !loading && user ? (
              <UserAvatar />
            ) : null}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation (hidden by default) */}
      <div className="md:hidden hidden border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'block px-3 py-2 rounded-md text-base font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-school-blue text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              )}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 pb-2 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {!loading && !user ? (
                <GoogleAuthButton variant="outline" size="sm" className="w-full" />
              ) : !loading && user ? (
                <div className="flex items-center gap-3 px-3 py-2">
                  <UserAvatar />
                  <span className="text-sm font-medium text-gray-900 truncate flex-1">
                    {user.name}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
