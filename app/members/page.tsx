'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute'
import { useAuth } from '@/context/AuthContext'
import { firebaseUserRepository, UserProfile } from '@/infrastructure/firebase/FirebaseUserRepository'

export default function ManageMembersPage() {
  useProtectedRoute()
  
  const router = useRouter()
  const { user, firebaseUser, loading: authLoading } = useAuth()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState<string[]>([])
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Fetch user profile and members
  useEffect(() => {
    const fetchData = async () => {
      if (firebaseUser && firebaseUser.email) {
        try {
          const profile = await firebaseUserRepository.getUserProfile(firebaseUser.email)
          setUserProfile(profile)
          
          if (profile && profile.role === 'owner') {
            const membersList = await firebaseUserRepository.getMembers(firebaseUser.email)
            setMembers(membersList)
          }
        } catch (error) {
          console.error('Error fetching data:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    if (!authLoading) {
      fetchData()
    }
  }, [firebaseUser, authLoading])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!firebaseUser || !firebaseUser.email) {
      setError('User not authenticated')
      return
    }

    if (!newMemberEmail.trim()) {
      setError('Please enter an email address')
      return
    }

    if (!validateEmail(newMemberEmail)) {
      setError('Please enter a valid email address')
      return
    }

    if (newMemberEmail.toLowerCase() === firebaseUser.email.toLowerCase()) {
      setError('You cannot add yourself as a member')
      return
    }

    if (members.includes(newMemberEmail.toLowerCase())) {
      setError('This member has already been added')
      return
    }

    setAdding(true)

    try {
      await firebaseUserRepository.addMember(firebaseUser.email, newMemberEmail)
      
      // Refresh members list
      const updatedMembers = await firebaseUserRepository.getMembers(firebaseUser.email)
      setMembers(updatedMembers)
      
      setNewMemberEmail('')
      setSuccess(`Member ${newMemberEmail} added successfully!`)
      
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      console.error('Error adding member:', err)
      setError(err.message || 'Failed to add member. Please try again.')
    } finally {
      setAdding(false)
    }
  }

  const handleRemoveMember = async (memberEmail: string) => {
    if (!firebaseUser || !firebaseUser.email) return

    if (!confirm(`Are you sure you want to remove ${memberEmail}? Their profile will be deleted.`)) {
      return
    }

    try {
      await firebaseUserRepository.removeMember(firebaseUser.email, memberEmail)
      
      // Refresh members list
      const updatedMembers = await firebaseUserRepository.getMembers(firebaseUser.email)
      setMembers(updatedMembers)
      
      setSuccess(`Member ${memberEmail} removed successfully!`)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      console.error('Error removing member:', err)
      setError(err.message || 'Failed to remove member. Please try again.')
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-600">Profile not found</p>
        </div>
        <Footer />
      </div>
    )
  }

  // Only owners can manage members
  if (userProfile.role !== 'owner') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="school-container py-8">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">🔒</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Access Restricted
                </h2>
                <p className="text-gray-600 mb-6">
                  Only organization owners can manage members.
                </p>
                <Button onClick={() => router.push('/dashboard')}>
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="school-container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Manage Members
            </h1>
            <p className="text-gray-600">
              Add and manage team members for your organization
            </p>
          </div>

          {/* Add Member Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Member</CardTitle>
              <CardDescription>
                Members will have access to your organization's dashboard and reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddMember} className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="memberEmail">Member Email Address</Label>
                    <Input
                      id="memberEmail"
                      type="email"
                      placeholder="member@example.com"
                      value={newMemberEmail}
                      onChange={(e) => {
                        setNewMemberEmail(e.target.value)
                        setError(null)
                      }}
                      disabled={adding}
                      className="mt-2"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="submit"
                      disabled={adding || !newMemberEmail.trim()}
                      variant="school"
                    >
                      {adding ? 'Adding...' : 'Add Member'}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-600 text-sm">✓ {success}</p>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">How it works:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Enter the email address of the person you want to add</li>
                    <li>• When they sign in with that email, they'll automatically become a member</li>
                    <li>• Members will see your organization's dashboard and data</li>
                    <li>• Only you (the owner) can edit organization details and manage members</li>
                  </ul>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Members List Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    {members.length} {members.length === 1 ? 'member' : 'members'} in your organization
                  </CardDescription>
                </div>
                <Badge variant="secondary">
                  {userProfile.accountType === 'institute' ? '🏫 Institute' : '👨‍🏫 Independent'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No members yet
                  </h3>
                  <p className="text-gray-600">
                    Add your first team member using the form above
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {members.map((memberEmail, index) => (
                    <div
                      key={memberEmail}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {memberEmail.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{memberEmail}</p>
                          <p className="text-sm text-gray-500">Member</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveMember(memberEmail)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Member Management Tips</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Members can view all reports and analytics</li>
                <li>• Members cannot edit organization settings or manage other members</li>
                <li>• Members' profiles are automatically created when they first sign in</li>
                <li>• Removing a member will delete their profile from your organization</li>
                <li>• You can add or remove members at any time</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

