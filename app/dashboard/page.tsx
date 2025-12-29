'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute'
import { useAuth } from '@/context/AuthContext'

export default function DashboardPage() {
  // Protect this route - redirects unauthenticated users
  useProtectedRoute()
  
  const { user } = useAuth()

  // Mock data - in real app this would come from the backend
  const recentReports = [
    {
      id: '1',
      title: 'Class 10 Mathematics Mid-term',
      createdAt: '2024-01-15',
      studentsCount: 35,
      averageScore: 78.5,
      status: 'completed' as const,
    },
    {
      id: '2', 
      title: 'Science Final Exam 2024',
      createdAt: '2024-01-12',
      studentsCount: 42,
      averageScore: 82.1,
      status: 'completed' as const,
    },
    {
      id: '3',
      title: 'English Assessment',
      createdAt: '2024-01-10',
      studentsCount: 38,
      averageScore: 75.8,
      status: 'completed' as const,
    },
  ]

  const stats = {
    totalReports: 12,
    totalStudents: 420,
    averageClassPerformance: 79.2,
    reportsThisMonth: 3,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="school-container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to your Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your result analyses and view performance insights
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <div className="text-2xl">📊</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReports}</div>
              <p className="text-xs text-muted-foreground">
                {stats.reportsThisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students Analyzed</CardTitle>
              <div className="text-2xl">👨‍🎓</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Across all reports
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Performance</CardTitle>
              <div className="text-2xl">📈</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageClassPerformance}%</div>
              <p className="text-xs text-muted-foreground">
                Overall class average
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              <div className="text-2xl">⚡</div>
            </CardHeader>
            <CardContent>
              <Link href="/upload">
                <Button variant="school" size="sm" className="w-full">
                  New Analysis
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Reports */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Reports</CardTitle>
                  <Link href="/reports">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
                <CardDescription>
                  Your latest result analyses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentReports.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📊</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No reports yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Upload your first Excel file to get started
                    </p>
                    <Link href="/upload">
                      <Button variant="school">
                        Create First Report
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentReports.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-gray-900">
                              {report.title}
                            </h3>
                            <Badge variant="success">
                              {report.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{report.studentsCount} students</span>
                            <span>Avg: {report.averageScore}%</span>
                            <span>{report.createdAt}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link href={`/reports/${report.id}`}>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/upload" className="block">
                  <Button variant="school" className="w-full justify-start">
                    <span className="mr-2">📊</span>
                    Upload New Results
                  </Button>
                </Link>
                <Link href="/reports" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <span className="mr-2">📈</span>
                    View All Reports
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">📋</span>
                  Download Template
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">❓</span>
                  Help & Guides
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips & Tricks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="text-blue-500">💡</div>
                    <p className="text-gray-600">
                      Use consistent column headers for better auto-mapping
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="text-blue-500">💡</div>
                    <p className="text-gray-600">
                      Include roll numbers for accurate student identification
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="text-blue-500">💡</div>
                    <p className="text-gray-600">
                      Mark absent students as "0" or "Absent" in mark cells
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
