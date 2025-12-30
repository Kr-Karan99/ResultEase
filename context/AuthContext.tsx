'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { firebaseAuthService } from '@/infrastructure/firebase/FirebaseAuthService'
import { firebaseUserRepository } from '@/infrastructure/firebase/FirebaseUserRepository'
import { User } from '@/application/ports/AuthPort'

/**
 * Auth Context Type
 */
interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

/**
 * Create Auth Context with default undefined
 * Allows checking if context provider is present
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Auth Context Provider Component
 * Manages authentication state and Firebase auth listener
 * Wraps entire application to provide auth context to all components
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  /**
   * Set up Firebase auth state listener on component mount
   * Runs once when provider mounts
   */
  useEffect(() => {
    setLoading(true)

    // Subscribe to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        setFirebaseUser(firebaseUser)
        const appUser = await firebaseAuthService.getCurrentUser()
        setUser(appUser)
      } else {
        // User is signed out
        setFirebaseUser(null)
        setUser(null)
      }
      setLoading(false)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  /**
   * Handle Google Sign-In
   * Firebase handles both new signup and existing login automatically
   * Creates initial user profile in Firestore if new user
   */
  const loginWithGoogle = async () => {
    try {
      setLoading(true)
      const result = await firebaseAuthService.signIn()

      if (!result.success) {
        console.error('Sign-in error:', result.error)
        throw new Error(result.error || 'Failed to sign in')
      }

      // Get the signed-in user
      const currentUser = auth.currentUser
      if (currentUser && currentUser.email) {
        try {
          // Check if user profile exists in Firestore (using email as document ID)
          let existingProfile = await firebaseUserRepository.getUserProfile(currentUser.email)
          
          if (!existingProfile) {
            // Check if this email is added as a member by any owner
            console.log('Checking if user is a member:', currentUser.email)
            const ownerEmail = await firebaseUserRepository.checkIfMemberAndGetOwner(currentUser.email)
            
            if (ownerEmail) {
              // User is a member! Create their profile from owner's data
              console.log('User is a member of:', ownerEmail)
              await firebaseUserRepository.createMemberProfile(
                currentUser.email,
                currentUser.uid,
                currentUser.displayName || 'Member',
                ownerEmail,
                currentUser.photoURL || undefined
              )
              console.log('Member profile created successfully')
            } else {
              // Not a member, create initial profile for new user
              console.log('Creating initial profile for new user:', currentUser.email)
              await firebaseUserRepository.createInitialUserProfile(
                currentUser.uid,
                currentUser.email,
                currentUser.displayName || 'User',
                currentUser.photoURL || undefined
              )
              console.log('Initial profile created successfully')
            }
          } else {
            // Update last login for existing users
            console.log('Updating last login for existing user:', currentUser.email)
            await firebaseUserRepository.updateLastLogin(currentUser.email)
          }
        } catch (firestoreError) {
          console.error('Error managing user profile in Firestore:', firestoreError)
          // Don't throw - allow user to continue to onboarding where we'll create/update the profile
        }
      }

      // Auth state change will be picked up by onAuthStateChanged listener
      // This will automatically update user state
    } catch (error) {
      console.error('Error logging in with Google:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle Sign Out
   */
  const logout = async () => {
    try {
      setLoading(true)
      await firebaseAuthService.signOut()
      setUser(null)
      setFirebaseUser(null)
    } catch (error) {
      console.error('Error logging out:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    loginWithGoogle,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to use Auth Context
 * Throws error if used outside AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
