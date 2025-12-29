/**
 * Authentication Port Interface
 * Defines the contract for authentication services
 * This interface will be implemented by mock services now and Firebase later
 */

export interface User {
  id: string
  email: string
  name: string
  photoURL?: string
  role: 'teacher' | 'admin'
  institution?: string
  createdAt: Date
  lastLoginAt?: Date
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface AuthResult {
  success: boolean
  user?: User
  error?: string
  token?: string
}

export interface AuthPort {
  /**
   * Sign in with email and password
   */
  signIn(credentials: AuthCredentials): Promise<AuthResult>
  
  /**
   * Sign up new user
   */
  signUp(credentials: AuthCredentials & { name: string; institution?: string }): Promise<AuthResult>
  
  /**
   * Sign out current user
   */
  signOut(): Promise<void>
  
  /**
   * Get current authenticated user
   */
  getCurrentUser(): Promise<User | null>
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated(): Promise<boolean>
  
  /**
   * Send password reset email
   */
  sendPasswordResetEmail(email: string): Promise<{ success: boolean; error?: string }>
  
  /**
   * Update user profile
   */
  updateProfile(userId: string, updates: Partial<Pick<User, 'name' | 'institution'>>): Promise<{ success: boolean; error?: string }>
  
  /**
   * Delete user account
   */
  deleteAccount(userId: string): Promise<{ success: boolean; error?: string }>
  
  /**
   * Verify user's email address
   */
  verifyEmail(token: string): Promise<{ success: boolean; error?: string }>
  
  /**
   * Refresh authentication token
   */
  refreshToken(): Promise<{ success: boolean; token?: string; error?: string }>
}
