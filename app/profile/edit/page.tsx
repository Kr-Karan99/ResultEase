'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute'
import { useAuth } from '@/context/AuthContext'
import { firebaseUserRepository, UserProfile } from '@/infrastructure/firebase/FirebaseUserRepository'

export default function EditProfilePage() {
  useProtectedRoute()
  
  const router = useRouter()
  const { user, firebaseUser, loading: authLoading } = useAuth()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    organizationName: '',
    primaryMobile: '',
    whatsappNumber: '',
    addressLine: '',
    district: '',
    state: '',
    principalName: '',
  })

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (firebaseUser && firebaseUser.email) {
        try {
          const profile = await firebaseUserRepository.getUserProfile(firebaseUser.email)
          if (profile) {
            setUserProfile(profile)
            setFormData({
              organizationName: profile.organizationName,
              primaryMobile: profile.primaryMobile,
              whatsappNumber: profile.whatsappNumber,
              addressLine: profile.addressLine,
              district: profile.district,
              state: profile.state,
              principalName: profile.principalName,
            })
          }
        } catch (error) {
          console.error('Error fetching profile:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    if (!authLoading) {
      fetchProfile()
    }
  }, [firebaseUser, authLoading])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
    setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!firebaseUser || !firebaseUser.email) {
      setError('User not authenticated')
      return
    }

    // Check if member
    if (userProfile?.role === 'member') {
      setError('Members cannot edit organization profile')
      return
    }

    setSaving(true)

    try {
      await firebaseUserRepository.updateUserProfile(firebaseUser.email, formData)
      setSuccess(true)
      
      // Refresh profile
      const updatedProfile = await firebaseUserRepository.getUserProfile(firebaseUser.email)
      if (updatedProfile) {
        setUserProfile(updatedProfile)
      }

      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="school-container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Edit Profile
            </h1>
            <p className="text-gray-600">
              Update your organization information
            </p>
          </div>

          {userProfile.role === 'member' && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                ⚠️ You are logged in as a member. Only the organization owner can edit the profile.
              </p>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
              <CardDescription>
                Keep your organization details up to date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="organizationName">
                    {userProfile.accountType === 'independent' 
                      ? 'Name / Academy Name' 
                      : 'School / Institute Name'} *
                  </Label>
                  <Input
                    id="organizationName"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    disabled={userProfile.role === 'member' || saving}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="primaryMobile">Primary Mobile *</Label>
                    <Input
                      id="primaryMobile"
                      name="primaryMobile"
                      type="tel"
                      value={formData.primaryMobile}
                      onChange={handleInputChange}
                      disabled={userProfile.role === 'member' || saving}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
                    <Input
                      id="whatsappNumber"
                      name="whatsappNumber"
                      type="tel"
                      value={formData.whatsappNumber}
                      onChange={handleInputChange}
                      disabled={userProfile.role === 'member' || saving}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine">Full Address *</Label>
                  <Input
                    id="addressLine"
                    name="addressLine"
                    value={formData.addressLine}
                    onChange={handleInputChange}
                    disabled={userProfile.role === 'member' || saving}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="district">District *</Label>
                    <Input
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      disabled={userProfile.role === 'member' || saving}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      disabled={userProfile.role === 'member' || saving}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="principalName">
                    {userProfile.accountType === 'independent' 
                      ? 'Owner / Admin Name' 
                      : 'Principal / Director Name'} *
                  </Label>
                  <Input
                    id="principalName"
                    name="principalName"
                    value={formData.principalName}
                    onChange={handleInputChange}
                    disabled={userProfile.role === 'member' || saving}
                    required
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-600 text-sm">✓ Profile updated successfully! Redirecting...</p>
                  </div>
                )}

                <div className="flex items-center space-x-4 pt-4">
                  <Button
                    type="submit"
                    disabled={userProfile.role === 'member' || saving}
                    variant="school"
                    className="flex-1"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/dashboard')}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

