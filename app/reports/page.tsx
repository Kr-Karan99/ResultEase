'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute'
import { useAuth } from '@/context/AuthContext'
import { firebaseUserRepository, UserProfile } from '@/infrastructure/firebase/FirebaseUserRepository'
import { firebaseReportRepository, SavedReport } from '@/infrastructure/firebase/FirebaseReportRepository'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function ReportsPage() {
  useProtectedRoute()
  
  const router = useRouter()
  const { user, firebaseUser, loading: authLoading } = useAuth()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [myReports, setMyReports] = useState<SavedReport[]>([])
  const [organizationReports, setOrganizationReports] = useState<SavedReport[]>([])
  const [loadingReports, setLoadingReports] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'my-reports' | 'organization'>('all')
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (firebaseUser && firebaseUser.email) {
        try {
          const profile = await firebaseUserRepository.getUserProfile(firebaseUser.email)
          setUserProfile(profile)
        } catch (error) {
          console.error('Error fetching user profile:', error)
          setError('Failed to load profile')
        } finally {
          setLoading(false)
        }
      }
    }

    if (!authLoading) {
      fetchUserProfile()
    }
  }, [firebaseUser, authLoading])

  // Fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      if (!firebaseUser?.email || !userProfile) return

      setLoadingReports(true)
      setError(null)

      try {
        // Fetch user's own reports
        const myReportsData = await firebaseReportRepository.getAllUserReports(firebaseUser.email)
        setMyReports(myReportsData)

        // Fetch organization reports - include ALL reports from organization (owner + all members)
        if (firebaseUser.email) {
          if (userProfile.role === 'owner') {
            // Owner: fetch reports from owner + all members
            const orgEmails = userProfile.members && userProfile.members.length > 0
              ? [firebaseUser.email, ...userProfile.members]
              : [firebaseUser.email]
            const orgReports = await firebaseReportRepository.getOrganizationReports(orgEmails)
            // Include ALL reports (owner + all members)
            setOrganizationReports(orgReports)
          } else if (userProfile.role === 'member' && userProfile.ownerEmail) {
            // Member: fetch reports from owner + all members (including self)
            const ownerProfile = await firebaseUserRepository.getUserProfile(userProfile.ownerEmail)
            if (ownerProfile) {
              // Build list: owner + all members (including current member)
              const orgEmails = ownerProfile.members && ownerProfile.members.length > 0
                ? [userProfile.ownerEmail, ...ownerProfile.members]
                : [userProfile.ownerEmail]
              
              // Ensure current member is included if not already
              if (!orgEmails.includes(firebaseUser.email)) {
                orgEmails.push(firebaseUser.email)
              }
              
              const orgReports = await firebaseReportRepository.getOrganizationReports(orgEmails)
              // Include ALL reports (owner + all members including self)
              setOrganizationReports(orgReports)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching reports:', error)
        setError('Failed to load reports. Please try again.')
      } finally {
        setLoadingReports(false)
      }
    }

    if (userProfile && !loading) {
      fetchReports()
    }
  }, [userProfile, firebaseUser, loading])

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
      // Remove from local state
      setMyReports(prevReports => prevReports.filter(report => report.id !== reportId))
      setError(null)
    } catch (error) {
      console.error('Error deleting report:', error)
      setError(error instanceof Error ? error.message : 'Failed to delete report. Please try again.')
    } finally {
      setDeletingReportId(null)
    }
  }

  // Filter reports based on search and tab
  const getFilteredReports = () => {
    let reports: SavedReport[] = []

    if (activeTab === 'my-reports') {
      reports = myReports
    } else if (activeTab === 'organization') {
      reports = organizationReports
    } else {
      // Combine and deduplicate reports
      // Use a Map to ensure unique reports by ID
      const reportsMap = new Map<string, SavedReport>()
      
      // Add my reports first
      myReports.forEach(report => {
        reportsMap.set(report.id, report)
      })
      
      // Add organization reports (will overwrite duplicates, but that's fine)
      organizationReports.forEach(report => {
        reportsMap.set(report.id, report)
      })
      
      reports = Array.from(reportsMap.values())
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      reports = reports.filter(
        report =>
          report.title.toLowerCase().includes(query) ||
          report.reportData.summary?.totalStudents?.toString().includes(query) ||
          report.fileName?.toLowerCase().includes(query)
      )
    }

    return reports
  }

  const filteredReports = getFilteredReports()
  const isMyReport = (report: SavedReport) => report.createdBy === firebaseUser?.email?.toLowerCase()
  
  // Calculate deduplicated total for "All Reports" tab
  const getAllReportsCount = () => {
    const reportsMap = new Map<string, SavedReport>()
    myReports.forEach(report => reportsMap.set(report.id, report))
    organizationReports.forEach(report => reportsMap.set(report.id, report))
    return reportsMap.size
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reports...</p>
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
            <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="school-container py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">All Reports</h1>
              <p className="text-gray-600">
                View and manage your saved analysis reports
              </p>
            </div>
            <Button variant="school" onClick={() => router.push('/upload')}>
              + New Report
            </Button>
          </div>

          {/* Search Bar */}
          <div className="max-w-md">
            <Input
              type="text"
              placeholder="Search reports by title, students, or filename..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="bg-red-50 border-red-200 mb-6">
            <AlertDescription className="text-red-800">
              ❌ {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'all'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            All Reports ({getAllReportsCount()})
          </button>
          <button
            onClick={() => setActiveTab('my-reports')}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'my-reports'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            My Reports ({myReports.length})
          </button>
          <button
            onClick={() => setActiveTab('organization')}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'organization'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Organization ({organizationReports.length})
          </button>
        </div>

        {/* Reports Grid */}
        {loadingReports ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No reports found' : 'No reports yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? 'Try adjusting your search terms'
                  : 'Start by uploading and analyzing your first result file'}
              </p>
              {!searchQuery && (
                <Button variant="school" onClick={() => router.push('/upload')}>
                  Create Your First Report
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report, index) => {
              const createdAt = report.createdAt instanceof Date
                ? report.createdAt
                : (report.createdAt as any)?.toDate?.() || new Date()
              
              const isOwnReport = isMyReport(report)
              const totalStudents = report.reportData.summary?.totalStudents || 0
              const totalSubjects = report.reportData.summary?.totalSubjects || 0
              const classAverage = report.reportData.summary?.classAverage || 0

              return (
                <Card
                  key={`${report.id}-${report.createdBy}-${index}`}
                  className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg line-clamp-2 flex-1">
                        {report.title}
                      </CardTitle>
                      {isOwnReport && (
                        <Badge variant="outline" className="ml-2 shrink-0">
                          Your Report
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-xs">
                      {createdAt.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Report Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="text-lg font-bold text-blue-600">{totalStudents}</div>
                        <div className="text-xs text-gray-600">Students</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="text-lg font-bold text-green-600">{totalSubjects}</div>
                        <div className="text-xs text-gray-600">Subjects</div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded">
                        <div className="text-lg font-bold text-purple-600">
                          {classAverage.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-600">Average</div>
                      </div>
                    </div>

                    {/* File Name */}
                    {report.fileName && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 truncate" title={report.fileName}>
                          📄 {report.fileName}
                        </p>
                      </div>
                    )}

                    {/* Created By */}
                    {!isOwnReport && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500">
                          Created by: {report.createdBy.split('@')[0]}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => router.push(`/reports/${report.id}`)}
                      >
                        View Details
                      </Button>
                      {isOwnReport && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteReport(report.id, report.title)}
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
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Stats Summary */}
        {!loadingReports && filteredReports.length > 0 && (
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="py-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {filteredReports.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Reports</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {myReports.length}
                  </div>
                  <div className="text-sm text-gray-600">Your Reports</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {organizationReports.length}
                  </div>
                  <div className="text-sm text-gray-600">Organization</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {filteredReports.reduce(
                      (sum, report) => sum + (report.reportData.summary?.totalStudents || 0),
                      0
                    )}
                  </div>
                  <div className="text-sm text-gray-600">Total Students</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  )
}

