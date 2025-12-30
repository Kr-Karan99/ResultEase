'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { firebaseUserRepository } from '@/infrastructure/firebase/FirebaseUserRepository'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

type AccountType = 'independent' | 'institute'

const INDEPENDENT_STUDENT_RANGES = [
  '0 to 10',
  '10 to 100',
  '100 to 500',
  '500 to 1000',
  '1000+',
]

const INSTITUTE_STUDENT_RANGES = [
  '0 to 300',
  '300 to 1000',
  '1000 to 5000',
  '5000+',
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user, firebaseUser, loading } = useAuth()
  
  const [accountType, setAccountType] = useState<AccountType>('independent')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    organizationName: '',
    primaryMobile: '',
    whatsappNumber: '',
    sameAsPrimary: false,
    addressLine: '',
    district: '',
    state: '',
    principalName: '',
    studentRange: '',
  })
  
  const [checkingMembership, setCheckingMembership] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // Check if already onboarded or if user is a member
  useEffect(() => {
    const checkOnboardingOrMembership = async () => {
      if (firebaseUser && firebaseUser.email) {
        setCheckingMembership(true)
        
        try {
          // Check if already onboarded
          const hasOnboarded = await firebaseUserRepository.hasCompletedOnboarding(firebaseUser.email)
          if (hasOnboarded) {
            router.push('/dashboard')
            return
          }

          // Check if user is added as a member by any owner
          console.log('Checking if user is a member:', firebaseUser.email)
          
          const ownerEmail = await firebaseUserRepository.checkIfMemberAndGetOwner(firebaseUser.email)
          
          if (ownerEmail) {
            // This user is a member! Create their profile from owner's data
            console.log('User is a member of:', ownerEmail)
            
            try {
              await firebaseUserRepository.createMemberProfile(
                firebaseUser.email,
                firebaseUser.uid,
                firebaseUser.displayName || 'Member',
                ownerEmail,
                firebaseUser.photoURL || undefined
              )
              
              console.log('Member profile created, redirecting to dashboard')
              router.push('/dashboard')
            } catch (error) {
              console.error('Error creating member profile:', error)
              setError('Failed to set up member profile. Please contact your organization owner.')
            }
          }
        } catch (error) {
          console.error('Error checking membership:', error)
        } finally {
          setCheckingMembership(false)
        }
      }
    }
    checkOnboardingOrMembership()
  }, [firebaseUser, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSameAsPrimary = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      sameAsPrimary: checked,
      whatsappNumber: checked ? prev.primaryMobile : '',
    }))
  }

  const handleStudentRangeSelect = (range: string) => {
    setFormData(prev => ({ ...prev, studentRange: range }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!formData.organizationName || !formData.primaryMobile || !formData.whatsappNumber ||
        !formData.addressLine || !formData.district || !formData.state ||
        !formData.principalName || !formData.studentRange) {
      setError('Please fill in all required fields')
      return
    }

    if (!firebaseUser || !firebaseUser.email) {
      setError('User not authenticated or email missing')
      return
    }

    setSubmitting(true)

    try {
      console.log('Starting onboarding submission for user:', firebaseUser.email)
      console.log('Form data:', formData)
      
      await firebaseUserRepository.completeOnboarding(firebaseUser.email, {
        accountType,
        organizationName: formData.organizationName,
        primaryMobile: formData.primaryMobile,
        whatsappNumber: formData.whatsappNumber,
        addressLine: formData.addressLine,
        district: formData.district,
        state: formData.state,
        principalName: formData.principalName,
        studentRange: formData.studentRange,
      })

      console.log('Onboarding completed successfully')
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      console.error('Onboarding error:', err)
      setError(err instanceof Error ? err.message : 'Failed to complete onboarding. Please try again.')
      setSubmitting(false)
    }
  }

  if (loading || !user || checkingMembership) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {checkingMembership ? 'Checking membership...' : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }

  const studentRanges = accountType === 'independent' 
    ? INDEPENDENT_STUDENT_RANGES 
    : INSTITUTE_STUDENT_RANGES

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Image
              src="/result_ease_logo.png"
              alt="ResultEase Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="font-bold text-xl text-gray-900">ResultEase</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Welcome, {firebaseUser?.displayName}! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Let's set up your account to get you started
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-4 pb-6">
            <div>
              <CardTitle className="text-2xl">Tell us about yourself</CardTitle>
              <CardDescription className="text-base mt-2">
                Choose the option that best describes you
              </CardDescription>
            </div>

            {/* Account Type Tabs */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setAccountType('independent')}
                className={`flex-1 p-6 rounded-xl border-2 transition-all ${
                  accountType === 'independent'
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">👨‍🏫</div>
                  <h3 className={`font-semibold text-lg mb-2 ${
                    accountType === 'independent' ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    Independent Creator
                  </h3>
                  <p className="text-sm text-gray-600">
                    For teachers, tutors, small academies
                  </p>
                  {accountType === 'independent' && (
                    <Badge className="mt-3 bg-blue-600">Selected</Badge>
                  )}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAccountType('institute')}
                className={`flex-1 p-6 rounded-xl border-2 transition-all ${
                  accountType === 'institute'
                    ? 'border-purple-600 bg-purple-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">🏫</div>
                  <h3 className={`font-semibold text-lg mb-2 ${
                    accountType === 'institute' ? 'text-purple-600' : 'text-gray-900'
                  }`}>
                    Institute
                  </h3>
                  <p className="text-sm text-gray-600">
                    For schools, colleges, large academies
                  </p>
                  {accountType === 'institute' && (
                    <Badge className="mt-3 bg-purple-600">Selected</Badge>
                  )}
                </div>
              </button>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Organization Name */}
              <div className="space-y-2">
                <Label htmlFor="organizationName" className="text-base font-semibold">
                  {accountType === 'independent' 
                    ? 'Your Name / Academy Name' 
                    : 'School / Institute Name'} *
                </Label>
                <Input
                  id="organizationName"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleInputChange}
                  placeholder={accountType === 'independent' 
                    ? 'e.g., John Doe Tutorial Classes' 
                    : 'e.g., Springfield High School'}
                  className="text-base py-6"
                  required
                />
              </div>

              {/* Contact Numbers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryMobile" className="text-base font-semibold">
                    Primary Mobile Number *
                  </Label>
                  <Input
                    id="primaryMobile"
                    name="primaryMobile"
                    type="tel"
                    value={formData.primaryMobile}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="text-base py-6"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber" className="text-base font-semibold">
                    WhatsApp Number *
                  </Label>
                  <Input
                    id="whatsappNumber"
                    name="whatsappNumber"
                    type="tel"
                    value={formData.whatsappNumber}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="text-base py-6"
                    disabled={formData.sameAsPrimary}
                    required
                  />
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      type="checkbox"
                      id="sameAsPrimary"
                      checked={formData.sameAsPrimary}
                      onChange={(e) => handleSameAsPrimary(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="sameAsPrimary" className="text-sm text-gray-600">
                      Same as primary number
                    </label>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="addressLine" className="text-base font-semibold">
                    Full Address *
                  </Label>
                  <Input
                    id="addressLine"
                    name="addressLine"
                    value={formData.addressLine}
                    onChange={handleInputChange}
                    placeholder="Street address, building name, area"
                    className="text-base py-6"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="district" className="text-base font-semibold">
                      District *
                    </Label>
                    <Input
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      placeholder="e.g., Mumbai"
                      className="text-base py-6"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-base font-semibold">
                      State *
                    </Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="e.g., Maharashtra"
                      className="text-base py-6"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Principal/Owner Name */}
              <div className="space-y-2">
                <Label htmlFor="principalName" className="text-base font-semibold">
                  {accountType === 'independent' 
                    ? 'Owner / Admin Name' 
                    : 'Principal / Director Name'} *
                </Label>
                <Input
                  id="principalName"
                  name="principalName"
                  value={formData.principalName}
                  onChange={handleInputChange}
                  placeholder="Full name"
                  className="text-base py-6"
                  required
                />
              </div>

              {/* Student Range */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Number of Students *
                </Label>
                <div className="flex flex-wrap gap-3">
                  {studentRanges.map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => handleStudentRangeSelect(range)}
                      className={`px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                        formData.studentRange === range
                          ? accountType === 'independent'
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-7 text-lg font-semibold rounded-xl ${
                    accountType === 'independent'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                  size="lg"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Setting up your account...</span>
                    </span>
                  ) : (
                    'Complete Setup & Continue'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

