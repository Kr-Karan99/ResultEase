/**
 * Mock Authentication Service
 * Implements AuthPort interface for development and testing
 * Will be replaced with Firebase Auth in production
 */

import { AuthPort, User, AuthCredentials, AuthResult } from '../../application/ports/AuthPort'

interface MockUserData {
  id: string
  email: string
  password: string
  name: string
  role: 'teacher' | 'admin'
  institution?: string
  createdAt: Date
  lastLoginAt?: Date
  isVerified: boolean
}

export class MockAuthService implements AuthPort {
  private currentUser: User | null = null
  private users: Map<string, MockUserData> = new Map()
  private sessions: Map<string, string> = new Map() // token -> userId
  
  constructor() {
    // Pre-populate with demo users
    this.initializeDemoUsers()
  }

  private initializeDemoUsers() {
    const demoUsers: MockUserData[] = [
      {
        id: 'teacher1',
        email: 'teacher@demo.com',
        password: 'password123',
        name: 'Demo Teacher',
        role: 'teacher',
        institution: 'Demo High School',
        createdAt: new Date('2024-01-01'),
        lastLoginAt: new Date(),
        isVerified: true
      },
      {
        id: 'admin1',
        email: 'admin@demo.com',
        password: 'admin123',
        name: 'Demo Admin',
        role: 'admin',
        institution: 'Demo Education Board',
        createdAt: new Date('2024-01-01'),
        lastLoginAt: new Date(),
        isVerified: true
      }
    ]

    demoUsers.forEach(user => {
      this.users.set(user.email, user)
    })
  }

  async signIn(credentials: AuthCredentials): Promise<AuthResult> {
    // Simulate network delay
    await this.delay(500)

    const user = this.users.get(credentials.email.toLowerCase())
    
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      }
    }

    if (user.password !== credentials.password) {
      return {
        success: false,
        error: 'Invalid password'
      }
    }

    if (!user.isVerified) {
      return {
        success: false,
        error: 'Please verify your email address before signing in'
      }
    }

    // Update last login
    user.lastLoginAt = new Date()
    
    // Create user object (without password)
    const authenticatedUser: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      institution: user.institution,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt
    }

    // Generate token and store session
    const token = this.generateToken()
    this.sessions.set(token, user.id)
    this.currentUser = authenticatedUser

    return {
      success: true,
      user: authenticatedUser,
      token
    }
  }

  async signUp(credentials: AuthCredentials & { name: string; institution?: string }): Promise<AuthResult> {
    // Simulate network delay
    await this.delay(800)

    // Check if user already exists
    if (this.users.has(credentials.email.toLowerCase())) {
      return {
        success: false,
        error: 'User already exists with this email'
      }
    }

    // Validate input
    if (credentials.password.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters long'
      }
    }

    if (credentials.name.trim().length < 2) {
      return {
        success: false,
        error: 'Name must be at least 2 characters long'
      }
    }

    // Create new user
    const newUser: MockUserData = {
      id: this.generateUserId(),
      email: credentials.email.toLowerCase(),
      password: credentials.password,
      name: credentials.name.trim(),
      role: 'teacher', // Default role
      institution: credentials.institution,
      createdAt: new Date(),
      isVerified: false // Email verification required
    }

    this.users.set(newUser.email, newUser)

    // In a real system, we'd send verification email here
    // For mock, we'll auto-verify after a delay
    setTimeout(() => {
      newUser.isVerified = true
    }, 2000)

    const user: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      institution: newUser.institution,
      createdAt: newUser.createdAt
    }

    return {
      success: true,
      user,
      error: 'Please check your email to verify your account'
    }
  }

  async signOut(): Promise<void> {
    // Simulate network delay
    await this.delay(200)

    // Remove all sessions for current user
    if (this.currentUser) {
      const userSessions = Array.from(this.sessions.entries())
        .filter(([_, userId]) => userId === this.currentUser?.id)
      
      userSessions.forEach(([token]) => {
        this.sessions.delete(token)
      })
    }

    this.currentUser = null
  }

  async getCurrentUser(): Promise<User | null> {
    // Simulate network delay
    await this.delay(100)
    return this.currentUser
  }

  async isAuthenticated(): Promise<boolean> {
    await this.delay(50)
    return this.currentUser !== null
  }

  async sendPasswordResetEmail(email: string): Promise<{ success: boolean; error?: string }> {
    // Simulate network delay
    await this.delay(600)

    const user = this.users.get(email.toLowerCase())
    
    if (!user) {
      // In production, we might not reveal if email exists for security
      return {
        success: false,
        error: 'If this email is registered, you will receive a password reset link'
      }
    }

    // In real system, send email here
    // For mock, we'll just return success
    return {
      success: true
    }
  }

  async updateProfile(userId: string, updates: Partial<Pick<User, 'name' | 'institution'>>): Promise<{ success: boolean; error?: string }> {
    // Simulate network delay
    await this.delay(400)

    if (this.currentUser?.id !== userId) {
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    // Find user by ID across all users
    let targetUser: MockUserData | undefined
    for (const user of this.users.values()) {
      if (user.id === userId) {
        targetUser = user
        break
      }
    }

    if (!targetUser) {
      return {
        success: false,
        error: 'User not found'
      }
    }

    // Apply updates
    if (updates.name !== undefined) {
      if (updates.name.trim().length < 2) {
        return {
          success: false,
          error: 'Name must be at least 2 characters long'
        }
      }
      targetUser.name = updates.name.trim()
      this.currentUser.name = updates.name.trim()
    }

    if (updates.institution !== undefined) {
      targetUser.institution = updates.institution
      this.currentUser.institution = updates.institution
    }

    return {
      success: true
    }
  }

  async deleteAccount(userId: string): Promise<{ success: boolean; error?: string }> {
    // Simulate network delay
    await this.delay(600)

    if (this.currentUser?.id !== userId) {
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    // Find and remove user
    let userEmail: string | undefined
    for (const [email, user] of this.users.entries()) {
      if (user.id === userId) {
        userEmail = email
        break
      }
    }

    if (!userEmail) {
      return {
        success: false,
        error: 'User not found'
      }
    }

    this.users.delete(userEmail)
    
    // Clear sessions
    const userSessions = Array.from(this.sessions.entries())
      .filter(([_, id]) => id === userId)
    
    userSessions.forEach(([token]) => {
      this.sessions.delete(token)
    })

    this.currentUser = null

    return {
      success: true
    }
  }

  async verifyEmail(token: string): Promise<{ success: boolean; error?: string }> {
    // Simulate network delay
    await this.delay(300)

    // In a real system, we'd validate the token
    // For mock, we'll just return success
    return {
      success: true
    }
  }

  async refreshToken(): Promise<{ success: boolean; token?: string; error?: string }> {
    // Simulate network delay
    await this.delay(200)

    if (!this.currentUser) {
      return {
        success: false,
        error: 'Not authenticated'
      }
    }

    // Generate new token
    const newToken = this.generateToken()
    
    // Remove old tokens for this user
    const userSessions = Array.from(this.sessions.entries())
      .filter(([_, userId]) => userId === this.currentUser?.id)
    
    userSessions.forEach(([token]) => {
      this.sessions.delete(token)
    })

    // Set new token
    this.sessions.set(newToken, this.currentUser.id)

    return {
      success: true,
      token: newToken
    }
  }

  // Helper methods
  private generateToken(): string {
    return 'mock_token_' + Math.random().toString(36).substr(2, 9)
  }

  private generateUserId(): string {
    return 'user_' + Math.random().toString(36).substr(2, 9)
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Development helper methods (not part of AuthPort interface)
  getDemoCredentials() {
    return {
      teacher: {
        email: 'teacher@demo.com',
        password: 'password123'
      },
      admin: {
        email: 'admin@demo.com',
        password: 'admin123'
      }
    }
  }

  reset() {
    this.currentUser = null
    this.sessions.clear()
    this.users.clear()
    this.initializeDemoUsers()
  }
}
