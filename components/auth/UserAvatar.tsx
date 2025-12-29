'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { LogOut } from 'lucide-react'
import Image from 'next/image'

/**
 * User Avatar Component
 * Displays user's Google profile picture with dropdown logout menu
 * Shows fallback avatar if image is not available
 */
export function UserAvatar() {
  const { user, firebaseUser, logout, loading } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const handleLogout = async () => {
    try {
      await logout()
      setShowDropdown(false)
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (!user) return null
  if (loading) return null

  const avatarUrl = firebaseUser?.photoURL
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors ring-2 ring-transparent hover:ring-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        title={user.name}
        aria-label="User profile menu"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={user.name}
            width={40}
            height={40}
            className="rounded-full"
            priority={false}
          />
        ) : (
          <span className="text-sm font-semibold text-gray-700">{initials}</span>
        )}
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-600 truncate">{user.email}</p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
