'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute'
import { useAuth } from '@/context/AuthContext'
import { firebaseUserRepository, UserProfile } from '@/infrastructure/firebase/FirebaseUserRepository'
import { firebaseReportRepository, SavedReport } from '@/infrastructure/firebase/FirebaseReportRepository'

export default function DashboardPage() {
  // Protect this route - redirects unauthenticated users
  useProtectedRoute()
  
  const router = useRouter()
  const { user, firebaseUser, loading: authLoading } = useAuth()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [savedReports, setSavedReports] = useState<SavedReport[]>([])
  const [loadingReports, setLoadingReports] = useState(true)
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null)

  // Fetch user profile from Firestore
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (firebaseUser && firebaseUser.email) {
        try {
          const profile = await firebaseUserRepository.getUserProfile(firebaseUser.email)
          setUserProfile(profile)
        } catch (error) {
          console.error('Error fetching user profile:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    if (!authLoading) {
      fetchUserProfile()
    }
  }, [firebaseUser, authLoading])

  // Fetch saved reports
  const fetchSavedReports = async () => {
    if (firebaseUser && firebaseUser.email) {
      try {
        const reports = await firebaseReportRepository.getUserReports(firebaseUser.email, 10)
        setSavedReports(reports)
      } catch (error) {
        console.error('Error fetching saved reports:', error)
      } finally {
        setLoadingReports(false)
      }
    } else {
      setLoadingReports(false)
    }
  }

  useEffect(() => {
    if (!authLoading && firebaseUser) {
      fetchSavedReports()
    }
  }, [firebaseUser, authLoading])

  // Refresh reports when page becomes visible (user might have deleted a report)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && firebaseUser && !authLoading) {
        fetchSavedReports()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [firebaseUser, authLoading])

  // Handle delete report
  const handleDeleteReport = async (reportId: string, reportTitle: string) => {
    if (!firebaseUser?.email) {
      return
    }

    if (!confirm(`Are you sure you want to delete "${reportTitle}"? This action cannot be undone.`)) {
      return
    }

    setDeletingReportId(reportId)

    try {
      await firebaseReportRepository.deleteReport(firebaseUser.email, reportId)
      // Remove from local state immediately for better UX
      setSavedReports(prevReports => prevReports.filter(report => report.id !== reportId))
    } catch (error) {
      console.error('Error deleting report:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete report. Please try again.')
      // Refresh reports list on error
      if (firebaseUser.email) {
        try {
          const reports = await firebaseReportRepository.getUserReports(firebaseUser.email, 10)
          setSavedReports(reports)
        } catch (refreshError) {
          console.error('Error refreshing reports:', refreshError)
        }
      }
    } finally {
      setDeletingReportId(null)
    }
  }

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (!authLoading && !loading && userProfile && !userProfile.isOnboardingComplete) {
      router.push('/onboarding')
    }
  }, [userProfile, loading, authLoading, router])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
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
          <div className="text-center">
            <p className="text-gray-600 mb-4">Unable to load profile</p>
            <Button onClick={() => router.push('/onboarding')}>
              Complete Setup
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const stats = {
    totalReports: userProfile.totalReportsGenerated || 0,
    accountType: userProfile.accountType,
    studentRange: userProfile.studentRange,
    subscriptionTier: userProfile.subscriptionTier || 'free',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="school-container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {userProfile.organizationName}
              </h1>
              <p className="text-gray-600 text-lg">
                Welcome back, {userProfile.displayName || user?.name}! 👋
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant={userProfile.accountType === 'institute' ? 'default' : 'secondary'} className="text-sm px-4 py-2">
                {userProfile.accountType === 'institute' ? '🏫 Institute' : '👨‍🏫 Independent'}
              </Badge>
              {userProfile.isPremium ? (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm px-4 py-2">
                  ⭐ Premium
                </Badge>
              ) : (
                <Badge variant="outline" className="text-sm px-4 py-2">
                  Free Plan
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalReports}</div>
              <p className="text-xs text-blue-100 mt-1">
                Generated so far
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{userProfile.studentRange}</div>
              <p className="text-xs text-green-100 mt-1">
                Student capacity
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Account Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{userProfile.accountType}</div>
              <p className="text-xs text-purple-100 mt-1">
                {userProfile.accountType === 'institute' ? 'Full features' : 'Personal use'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Plan Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{stats.subscriptionTier}</div>
              <p className="text-xs text-orange-100 mt-1">
                {userProfile.isPremium ? 'All features unlocked' : 'Limited features'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Actions & Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Get started with analyzing your results
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/upload" className="block">
                  <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group">
                    <div className="text-4xl mb-3">📊</div>
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600">
                      Upload New Results
                    </h3>
                    <p className="text-sm text-gray-600">
                      Upload Excel or CSV file to analyze
                    </p>
                  </div>
                </Link>

                <Link href="/reports" className="block">
                  <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer group">
                    <div className="text-4xl mb-3">📈</div>
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-green-600">
                      View Reports
                    </h3>
                    <p className="text-sm text-gray-600">
                      Access all your analysis reports
                    </p>
                  </div>
                </Link>

                {userProfile.role === 'owner' && (
                  <Link href="/members" className="block">
                    <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer group">
                      <div className="text-4xl mb-3">👥</div>
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600">
                        Manage Members
                      </h3>
                      <p className="text-sm text-gray-600">
                        Add or remove team members
                      </p>
                    </div>
                  </Link>
                )}

                <Link href="/profile/edit" className="block">
                  <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all cursor-pointer group">
                    <div className="text-4xl mb-3">⚙️</div>
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-orange-600">
                      Edit Profile
                    </h3>
                    <p className="text-sm text-gray-600">
                      Update organization details
                    </p>
                  </div>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingReports ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading reports...</p>
                  </div>
                ) : savedReports.length === 0 && stats.totalReports === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🚀</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Ready to get started?
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Upload your first result file to generate insights
                    </p>
                    <Link href="/upload">
                      <Button variant="school" size="lg">
                        Upload Results
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedReports.length > 0 && (
                      <>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Saved Reports</h3>
                        {savedReports.map((report) => {
                          const createdAt = report.createdAt instanceof Date 
                            ? report.createdAt 
                            : (report.createdAt as any)?.toDate?.() || new Date()
                          
                          return (
                            <div
                              key={report.id}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                              onClick={() => router.push(`/reports/${report.id}`)}
                            >
                              <div className="flex items-center space-x-4 flex-1">
                                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-xl">📊</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {report.title}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {createdAt.toLocaleDateString()} • {report.reportData.summary?.totalStudents || 0} students
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    router.push(`/reports/${report.id}`)
                                  }}
                                  className="ml-2"
                                >
                                  View
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteReport(report.id, report.title)
                                  }}
                                  disabled={deletingReportId === report.id}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  title="Delete report"
                                >
                                  {deletingReportId === report.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                  ) : (
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  )}
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                        {savedReports.length >= 10 && (
                          <Link href="/reports" className="block">
                            <Button variant="outline" className="w-full">
                              View All Reports
                            </Button>
                          </Link>
                        )}
                      </>
                    )}
                    {stats.totalReports > 0 && savedReports.length === 0 && (
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xl">📊</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {stats.totalReports} {stats.totalReports === 1 ? 'report' : 'reports'} generated
                          </p>
                          <p className="text-xs text-gray-500">Save reports to view them here</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile Info */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Organization</label>
                  <p className="text-sm text-gray-900 mt-1">{userProfile.organizationName}</p>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Principal/Owner</label>
                  <p className="text-sm text-gray-900 mt-1">{userProfile.principalName}</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Email</label>
                  <p className="text-sm text-gray-900 mt-1">{userProfile.email}</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Contact</label>
                  <p className="text-sm text-gray-900 mt-1">{userProfile.primaryMobile}</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Location</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {userProfile.district}, {userProfile.state}
                  </p>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <Link href="/profile/edit" className="block">
                    <Button variant="outline" className="w-full">
                      Edit Profile
                    </Button>
                  </Link>
                  
                  {userProfile.role === 'owner' && (
                    <Link href="/members" className="block">
                      <Button variant="school" className="w-full">
                        Manage Members
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Upgrade Card (if free tier) */}
            {!userProfile.isPremium && (
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-900">Upgrade to Premium</CardTitle>
                  <CardDescription className="text-blue-700">
                    Unlock advanced features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center text-sm text-blue-900">
                      <span className="text-blue-600 mr-2">✓</span>
                      Unlimited reports
                    </li>
                    <li className="flex items-center text-sm text-blue-900">
                      <span className="text-blue-600 mr-2">✓</span>
                      Advanced analytics
                    </li>
                    <li className="flex items-center text-sm text-blue-900">
                      <span className="text-blue-600 mr-2">✓</span>
                      Priority support
                    </li>
                    <li className="flex items-center text-sm text-blue-900">
                      <span className="text-blue-600 mr-2">✓</span>
                      Custom branding
                    </li>
                  </ul>
                  <Button variant="school" className="w-full" disabled>
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Help Card */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/docs" className="block">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-2xl">📚</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Documentation</p>
                      <p className="text-xs text-gray-500">Learn how to use ResultEase</p>
                    </div>
                  </div>
                </Link>
                
                <Link href="/contact" className="block">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-2xl">💬</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Contact Support</p>
                      <p className="text-xs text-gray-500">Get help from our team</p>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
