import {
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  User as FirebaseUser,
  setPersistence,
  browserLocalPersistence,
  updateProfile,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { AuthPort, User, AuthResult } from '@/application/ports/AuthPort'

/**
 * Firebase Authentication Service
 * Implements AuthPort using Firebase Authentication
 * Supports Google OAuth (Sign In / Sign Up)
 */
export class FirebaseAuthService implements AuthPort {
  private googleProvider = new GoogleAuthProvider()

  /**
   * Initialize Firebase persistence on service creation
   */
  constructor() {
    this.initializePersistence()
  }

  /**
   * Set Firebase to persist authentication state across page refreshes
   */
  private async initializePersistence(): Promise<void> {
    try {
      await setPersistence(auth, browserLocalPersistence)
    } catch (error) {
      console.error('Error setting Firebase persistence:', error)
    }
  }

  /**
   * Sign in with Google OAuth
   * If user is new, automatically creates account (Sign Up)
   * If user exists, logs them in (Sign In)
   * Firebase handles both cases transparently
   */
  async signIn(): Promise<AuthResult> {
    try {
      const result = await signInWithPopup(auth, this.googleProvider)
      const user = result.user
      const idToken = await user.getIdToken()

      return {
        success: true,
        user: this.mapFirebaseUserToAppUser(user),
        token: idToken,
      }
    } catch (error: any) {
      return {
        success: false,
        error: this.getErrorMessage(error.code),
      }
    }
  }

  /**
   * Sign Up with Google OAuth
   * In Firebase, sign up is same as sign in - creates account automatically if new user
   */
  async signUp(): Promise<AuthResult> {
    // Same as signIn - Firebase handles creating new user accounts automatically
    return this.signIn()
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  /**
   * Get the currently authenticated user
   * Returns null if not authenticated
   */
  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      // onAuthStateChanged returns unsubscribe function and calls callback immediately
      const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
        unsubscribe() // Stop listening after first call
        if (firebaseUser) {
          resolve(this.mapFirebaseUserToAppUser(firebaseUser))
        } else {
          resolve(null)
        }
      })
    })
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser()
    return user !== null
  }

  /**
   * Send password reset email
   * Not applicable for Google OAuth - returns error
   */
  async sendPasswordResetEmail(email: string): Promise<{ success: boolean; error?: string }> {
    return {
      success: false,
      error: 'Password reset not available for Google OAuth',
    }
  }

  /**
   * Update user profile (name, institution)
   * Currently updates display name only (Firebase limitation)
   */
  async updateProfile(userId: string, updates: Partial<Pick<User, 'name' | 'institution'>>): Promise<{ success: boolean; error?: string }> {
    try {
      const currentUser = auth.currentUser
      if (!currentUser || currentUser.uid !== userId) {
        return {
          success: false,
          error: 'User not authenticated or user ID mismatch',
        }
      }

      // Firebase Auth only supports updating displayName
      if (updates.name) {
        await updateProfile(currentUser, {
          displayName: updates.name,
        })
      }

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Delete user account
   * Deletes the Firebase user (cannot be undone)
   */
  async deleteAccount(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const currentUser = auth.currentUser
      if (!currentUser || currentUser.uid !== userId) {
        return {
          success: false,
          error: 'User not authenticated or user ID mismatch',
        }
      }

      await currentUser.delete()
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Verify user's email
   * Not applicable for Google OAuth - user is pre-verified
   */
  async verifyEmail(token: string): Promise<{ success: boolean; error?: string }> {
    return {
      success: true, // Google OAuth users are pre-verified
      error: undefined,
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) {
        return {
          success: false,
          error: 'User not authenticated',
        }
      }

      const newToken = await currentUser.getIdToken(true)
      return {
        success: true,
        token: newToken,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Map Firebase User to application User model
   */
  private mapFirebaseUserToAppUser(firebaseUser: FirebaseUser): User {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || 'User',
      photoURL: firebaseUser.photoURL || undefined,
      role: 'teacher', // Default role - can be extended with Firestore custom claims
      createdAt: firebaseUser.metadata?.creationTime ? new Date(firebaseUser.metadata.creationTime) : new Date(),
      lastLoginAt: firebaseUser.metadata?.lastSignInTime ? new Date(firebaseUser.metadata.lastSignInTime) : undefined,
    }
  }

  /**
   * Convert Firebase error codes to user-friendly messages
   */
  private getErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
      'auth/popup-blocked': 'Sign-in popup was blocked. Please allow popups and try again.',
      'auth/cancelled-popup-request': 'Sign-in was cancelled. Please try again.',
      'auth/operation-not-supported-in-this-environment': 'Google Sign-In is not available. Please try a different browser or device.',
      'auth/unauthorized-domain': 'This domain is not authorized for Google Sign-In.',
      'auth/missing-multi-factor-info': 'Multi-factor authentication required.',
      'auth/missing-multi-factor-session': 'Multi-factor session error.',
      'auth/invalid-credential': 'Invalid credentials provided.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
    }

    return errorMessages[errorCode] || 'An error occurred during sign-in. Please try again.'
  }
}

// Export singleton instance for use across app
export const firebaseAuthService = new FirebaseAuthService()
