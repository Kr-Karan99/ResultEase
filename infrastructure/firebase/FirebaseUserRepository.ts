/**
 * Firebase User Repository
 * Handles all Firestore operations for user data
 */

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import firebaseApp from '@/lib/firebase'

export interface UserProfile {
  uid: string // Firebase Auth UID (kept for reference)
  email: string // Used as document ID
  displayName: string
  photoURL?: string
  
  // Role management
  role: 'owner' | 'member' // Owner can add members, members have limited access
  ownerEmail?: string // For members: references the owner's email
  
  // Onboarding data
  accountType: 'independent' | 'institute'
  organizationName: string
  primaryMobile: string
  whatsappNumber: string
  addressLine: string
  district: string
  state: string
  principalName: string
  studentRange: string
  
  // Members management (only for owners)
  members?: string[] // Array of member emails
  
  // System fields
  isOnboardingComplete: boolean
  createdAt: Timestamp | Date
  updatedAt: Timestamp | Date
  
  // Future subscription fields
  subscriptionTier?: 'free' | 'basic' | 'premium' | 'enterprise'
  isPremium?: boolean
  subscriptionExpiresAt?: Timestamp | Date
  trialEndsAt?: Timestamp | Date
  
  // Usage tracking
  totalReportsGenerated?: number
  lastLoginAt?: Timestamp | Date
  
  // Additional metadata
  onboardedAt?: Timestamp | Date
  referralSource?: string
  instituteType?: string // For institutes: 'school' | 'academy' | 'college'
  subjectsTaught?: string[] // For independent teachers
}

export class FirebaseUserRepository {
  private db = getFirestore(firebaseApp)
  private usersCollection = collection(this.db, 'users')

  /**
   * Get user profile by email (document ID)
   */
  async getUserProfile(email: string): Promise<UserProfile | null> {
    try {
      // Sanitize email for use as document ID
      const sanitizedEmail = this.sanitizeEmail(email)
      const userDoc = await getDoc(doc(this.usersCollection, sanitizedEmail))
      
      if (!userDoc.exists()) {
        return null
      }

      return userDoc.data() as UserProfile
    } catch (error) {
      console.error('Error fetching user profile:', error)
      throw new Error('Failed to fetch user profile')
    }
  }

  /**
   * Sanitize email for use as Firestore document ID
   * Firestore document IDs can't contain certain characters
   */
  private sanitizeEmail(email: string): string {
    // Replace special characters that Firestore doesn't allow in document IDs
    return email.toLowerCase().trim()
  }

  /**
   * Create initial user profile after Google sign-in
   * Uses email as document ID
   */
  async createInitialUserProfile(
    uid: string,
    email: string,
    displayName: string,
    photoURL?: string
  ): Promise<void> {
    try {
      const sanitizedEmail = this.sanitizeEmail(email)
      
      const userProfile: Partial<UserProfile> = {
        uid,
        email,
        displayName,
        photoURL,
        role: 'owner', // Default to owner, will be changed if member
        isOnboardingComplete: false,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
        totalReportsGenerated: 0,
        subscriptionTier: 'free',
        isPremium: false,
        members: [], // Initialize empty members array
      }

      await setDoc(doc(this.usersCollection, sanitizedEmail), userProfile)
      console.log('Created user profile with email as document ID:', sanitizedEmail)
    } catch (error) {
      console.error('Error creating user profile:', error)
      throw new Error('Failed to create user profile')
    }
  }

  /**
   * Complete user onboarding with form data
   * Uses email as document ID
   */
  async completeOnboarding(
    email: string,
    onboardingData: {
      accountType: 'independent' | 'institute'
      organizationName: string
      primaryMobile: string
      whatsappNumber: string
      addressLine: string
      district: string
      state: string
      principalName: string
      studentRange: string
      instituteType?: string
      subjectsTaught?: string[]
    }
  ): Promise<void> {
    try {
      const sanitizedEmail = this.sanitizeEmail(email)
      const userDocRef = doc(this.usersCollection, sanitizedEmail)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        // Document doesn't exist, create it with onboarding data
        console.log('User document not found, creating with onboarding data for:', sanitizedEmail)
        
        // Try to get uid and displayName from Firebase Auth
        const { auth } = await import('@/lib/firebase')
        const currentUser = auth.currentUser
        
        if (!currentUser) {
          throw new Error('No authenticated user found')
        }
        
        const newUserData = {
          uid: currentUser.uid,
          email: email,
          displayName: currentUser.displayName || onboardingData.organizationName,
          photoURL: currentUser.photoURL || undefined,
          role: 'owner' as const, // Owner role during onboarding
          ...onboardingData,
          isOnboardingComplete: true,
          onboardedAt: serverTimestamp() as Timestamp,
          createdAt: serverTimestamp() as Timestamp,
          updatedAt: serverTimestamp() as Timestamp,
          totalReportsGenerated: 0,
          subscriptionTier: 'free' as const,
          isPremium: false,
          members: [], // Initialize empty members array
        }
        await setDoc(userDocRef, newUserData)
        console.log('User document created successfully with email as ID')
      } else {
        // Document exists, update it using setDoc with merge to preserve all fields
        console.log('Updating existing user document:', sanitizedEmail)
        const existingData = userDoc.data() as UserProfile
        
        // Merge with existing data to ensure all required fields are present
        const mergedData = {
          ...existingData,
          ...onboardingData,
          isOnboardingComplete: true,
          onboardedAt: serverTimestamp() as Timestamp,
          updatedAt: serverTimestamp() as Timestamp,
        }
        
        // Use setDoc with merge:true instead of updateDoc for better compatibility with rules
        await setDoc(userDocRef, mergedData, { merge: true })
        console.log('User document updated successfully')
      }
    } catch (error) {
      console.error('Error completing onboarding:', error)
      throw new Error('Failed to complete onboarding')
    }
  }

  /**
   * Update user profile (uses email as document ID)
   */
  async updateUserProfile(
    email: string,
    updates: Partial<UserProfile>
  ): Promise<void> {
    try {
      const sanitizedEmail = this.sanitizeEmail(email)
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp() as Timestamp,
      }

      await updateDoc(doc(this.usersCollection, sanitizedEmail), updateData)
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw new Error('Failed to update user profile')
    }
  }

  /**
   * Update last login timestamp (uses email as document ID)
   */
  async updateLastLogin(email: string): Promise<void> {
    try {
      const sanitizedEmail = this.sanitizeEmail(email)
      await updateDoc(doc(this.usersCollection, sanitizedEmail), {
        lastLoginAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
      })
    } catch (error) {
      console.error('Error updating last login:', error)
      // Don't throw - this is non-critical
    }
  }

  /**
   * Increment report count (uses email as document ID)
   */
  async incrementReportCount(email: string): Promise<void> {
    try {
      const sanitizedEmail = this.sanitizeEmail(email)
      const userDoc = await getDoc(doc(this.usersCollection, sanitizedEmail))
      
      if (userDoc.exists()) {
        const currentCount = userDoc.data().totalReportsGenerated || 0
        await updateDoc(doc(this.usersCollection, sanitizedEmail), {
          totalReportsGenerated: currentCount + 1,
          updatedAt: serverTimestamp() as Timestamp,
        })
      }
    } catch (error) {
      console.error('Error incrementing report count:', error)
      // Don't throw - this is non-critical
    }
  }

  /**
   * Check if user has completed onboarding (uses email as document ID)
   */
  async hasCompletedOnboarding(email: string): Promise<boolean> {
    try {
      const sanitizedEmail = this.sanitizeEmail(email)
      const userDoc = await getDoc(doc(this.usersCollection, sanitizedEmail))
      
      if (!userDoc.exists()) {
        return false
      }

      return userDoc.data().isOnboardingComplete === true
    } catch (error) {
      console.error('Error checking onboarding status:', error)
      return false
    }
  }

  /**
   * Add a member to owner's organization
   */
  async addMember(ownerEmail: string, memberEmail: string): Promise<void> {
    try {
      const sanitizedOwnerEmail = this.sanitizeEmail(ownerEmail)
      const ownerDocRef = doc(this.usersCollection, sanitizedOwnerEmail)
      const ownerDoc = await getDoc(ownerDocRef)

      if (!ownerDoc.exists()) {
        throw new Error('Owner profile not found')
      }

      const ownerData = ownerDoc.data() as UserProfile
      const currentMembers = ownerData.members || []
      const sanitizedMemberEmail = this.sanitizeEmail(memberEmail)

      // Check if member already exists
      if (currentMembers.includes(sanitizedMemberEmail)) {
        throw new Error('Member already added')
      }

      // Add member to owner's members array (use sanitized email to match query format)
      await updateDoc(ownerDocRef, {
        members: [...currentMembers, sanitizedMemberEmail],
        updatedAt: serverTimestamp() as Timestamp,
      })

      console.log('Member added successfully:', memberEmail)
    } catch (error) {
      console.error('Error adding member:', error)
      throw error
    }
  }

  /**
   * Remove a member from owner's organization
   */
  async removeMember(ownerEmail: string, memberEmail: string): Promise<void> {
    try {
      const sanitizedOwnerEmail = this.sanitizeEmail(ownerEmail)
      const ownerDocRef = doc(this.usersCollection, sanitizedOwnerEmail)
      const ownerDoc = await getDoc(ownerDocRef)

      if (!ownerDoc.exists()) {
        throw new Error('Owner profile not found')
      }

      const ownerData = ownerDoc.data() as UserProfile
      const currentMembers = ownerData.members || []

      // Remove member from array
      const updatedMembers = currentMembers.filter(
        (email) => email !== memberEmail.toLowerCase()
      )

      await updateDoc(ownerDocRef, {
        members: updatedMembers,
        updatedAt: serverTimestamp() as Timestamp,
      })

      // Delete member's profile if exists
      const sanitizedMemberEmail = this.sanitizeEmail(memberEmail)
      const memberDocRef = doc(this.usersCollection, sanitizedMemberEmail)
      const memberDoc = await getDoc(memberDocRef)

      if (memberDoc.exists() && memberDoc.data().role === 'member') {
        await deleteDoc(memberDocRef)
        console.log('Member profile deleted:', memberEmail)
      }

      console.log('Member removed successfully:', memberEmail)
    } catch (error) {
      console.error('Error removing member:', error)
      throw error
    }
  }

  /**
   * Check if email is a member of any organization
   * Returns owner's email if member, null otherwise
   */
  async checkIfMemberAndGetOwner(memberEmail: string): Promise<string | null> {
    try {
      const sanitizedEmail = this.sanitizeEmail(memberEmail)
      console.log('Checking member status for:', memberEmail, 'sanitized:', sanitizedEmail)
      
      // First check if profile exists and is already marked as member
      const memberDoc = await getDoc(doc(this.usersCollection, sanitizedEmail))

      if (memberDoc.exists()) {
        const data = memberDoc.data() as UserProfile
        if (data.role === 'member' && data.ownerEmail) {
          console.log('User is already a member with profile:', data.ownerEmail)
          return data.ownerEmail
        }
      }

      // If no profile exists, search for this email in owners' members arrays
      // Note: This requires querying all documents - not efficient for large scale
      // In production, consider using a separate "memberships" collection
      const { getDocs, query, where } = await import('firebase/firestore')
      
      // Query for owners who have this email in their members array
      // sanitizedEmail is already lowercase and trimmed
      console.log('Searching for member email in owners array:', sanitizedEmail)
      
      const usersQuery = query(
        this.usersCollection,
        where('members', 'array-contains', sanitizedEmail)
      )
      
      const querySnapshot = await getDocs(usersQuery)
      
      console.log('Query results count:', querySnapshot.size)
      
      if (!querySnapshot.empty) {
        // Found an owner who has this email as member
        const ownerDoc = querySnapshot.docs[0]
        const ownerData = ownerDoc.data() as UserProfile
        console.log('Found owner for member:', ownerData.email, 'Members array:', ownerData.members)
        return ownerData.email
      }

      console.log('No owner found for member:', memberEmail)
      return null
    } catch (error) {
      console.error('Error checking member status:', error)
      return null
    }
  }

  /**
   * Create member profile from owner's organization data
   */
  async createMemberProfile(
    memberEmail: string,
    memberUid: string,
    memberDisplayName: string,
    ownerEmail: string,
    memberPhotoURL?: string
  ): Promise<void> {
    try {
      // Get owner's profile
      const ownerProfile = await this.getUserProfile(ownerEmail)

      if (!ownerProfile) {
        throw new Error('Owner profile not found')
      }

      // Create member profile with owner's organization data
      const sanitizedEmail = this.sanitizeEmail(memberEmail)
      const memberProfile: Partial<UserProfile> = {
        uid: memberUid,
        email: memberEmail,
        displayName: memberDisplayName,
        photoURL: memberPhotoURL,
        role: 'member',
        ownerEmail: ownerEmail,
        
        // Copy organization data from owner
        accountType: ownerProfile.accountType,
        organizationName: ownerProfile.organizationName,
        primaryMobile: ownerProfile.primaryMobile,
        whatsappNumber: ownerProfile.whatsappNumber,
        addressLine: ownerProfile.addressLine,
        district: ownerProfile.district,
        state: ownerProfile.state,
        principalName: ownerProfile.principalName,
        studentRange: ownerProfile.studentRange,
        
        // System fields
        isOnboardingComplete: true,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
        onboardedAt: serverTimestamp() as Timestamp,
        totalReportsGenerated: 0,
        subscriptionTier: ownerProfile.subscriptionTier || 'free',
        isPremium: ownerProfile.isPremium || false,
      }

      await setDoc(doc(this.usersCollection, sanitizedEmail), memberProfile)
      console.log('Member profile created successfully:', memberEmail)
    } catch (error) {
      console.error('Error creating member profile:', error)
      throw error
    }
  }

  /**
   * Get all members for an owner
   */
  async getMembers(ownerEmail: string): Promise<string[]> {
    try {
      const ownerProfile = await this.getUserProfile(ownerEmail)
      return ownerProfile?.members || []
    } catch (error) {
      console.error('Error getting members:', error)
      return []
    }
  }
}

// Export singleton instance
export const firebaseUserRepository = new FirebaseUserRepository()

