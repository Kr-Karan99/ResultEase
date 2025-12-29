'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SubjectAverageChart, GradeDistributionChart } from '@/components/charts/BarChart'
import { PassFailChart } from '@/components/charts/PieChart'
import { StudentRankingTable } from '@/components/tables/DataTable'
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute'

interface ReportPageProps {
  params: {
    id: string
  }
}

export default function ReportPage({ params }: ReportPageProps) {
  // Protect this route - redirects unauthenticated users
  useProtectedRoute()

  // Mock data - in real app this would be fetched based on the report ID
  const reportData = {
    id: params.id,
    title: 'Class 10 Mathematics Mid-term Examination',
    createdAt: '2024-01-15',
    createdBy: 'Ms. Sarah Johnson',
    institution: 'ABC High School',
    status: 'completed' as const,
    
    summary: {
      totalStudents: 35,
      totalSubjects: 3,
      classAverage: 78.5,
      passPercentage: 88.6,
      highestPercentage: 95.2,
      lowestPercentage: 42.1,
    },

    subjectAnalysis: [
      { subject: 'Mathematics', average: 78.5, highest: 95, lowest: 42, passRate: 85.7, difficulty: 'Moderate' },
      { subject: 'Science', average: 82.1, highest: 98, lowest: 55, passRate: 91.4, difficulty: 'Easy' },
      { subject: 'English', average: 75.8, highest: 92, lowest: 48, passRate: 88.6, difficulty: 'Moderate' },
    ],

    chartData: {
      subjectAverages: [
        { subject: 'Mathematics', average: 78.5 },
        { subject: 'Science', average: 82.1 },
        { subject: 'English', average: 75.8 },
      ],
      passFailData: [
        { name: 'Passed', value: 31 },
        { name: 'Failed', value: 4 },
      ] as Array<{ name: string; value: number }>,
      gradeDistribution: [
        { grade: 'A+', count: 8 },
        { grade: 'A', count: 12 },
        { grade: 'B', count: 8 },
        { grade: 'C', count: 3 },
        { grade: 'D', count: 2 },
        { grade: 'F', count: 2 },
      ],
    },

    studentRankings: [
      { rank: 1, name: 'Emma Watson', rollNumber: '001', totalMarks: 285, percentage: 95.0, grade: 'A+' },
      { rank: 2, name: 'Liam Johnson', rollNumber: '002', totalMarks: 276, percentage: 92.0, grade: 'A+' },
      { rank: 3, name: 'Olivia Brown', rollNumber: '003', totalMarks: 271, percentage: 90.3, grade: 'A+' },
      { rank: 4, name: 'Noah Davis', rollNumber: '004', totalMarks: 265, percentage: 88.3, grade: 'A' },
      { rank: 5, name: 'Sophia Wilson', rollNumber: '005', totalMarks: 258, percentage: 86.0, grade: 'A' },
      { rank: 6, name: 'Mason Miller', rollNumber: '006', totalMarks: 252, percentage: 84.0, grade: 'A' },
      { rank: 7, name: 'Isabella Garcia', rollNumber: '007', totalMarks: 246, percentage: 82.0, grade: 'A' },
      { rank: 8, name: 'William Rodriguez', rollNumber: '008', totalMarks: 240, percentage: 80.0, grade: 'B' },
      { rank: 9, name: 'Mia Martinez', rollNumber: '009', totalMarks: 234, percentage: 78.0, grade: 'B' },
      { rank: 10, name: 'James Anderson', rollNumber: '010', totalMarks: 228, percentage: 76.0, grade: 'B' },
    ],

    insights: {
      classPerformance: 'Good',
      keyInsights: [
        'Class average is 78.5% (Good performance)',
        '8 students (22.9%) are high performers',
        '2 students (5.7%) need additional support',
        'Science is the strongest subject for students',
      ],
      recommendations: [
        'Provide extra coaching for struggling students in Mathematics',
        'Consider advanced learning opportunities for high performers',
        'Focus on improving problem-solving skills in Mathematics',
      ],
    },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="school-container py-8">
        {/* Report Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {reportData.title}
              </h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <span>Created: {reportData.createdAt}</span>
                <span>By: {reportData.createdBy}</span>
                <span>Institution: {reportData.institution}</span>
                <Badge variant="success">{reportData.status}</Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                Export PDF
              </Button>
              <Button variant="outline">
                Export Excel
              </Button>
              <Button variant="school">
                Share Report
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.summary.totalStudents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.summary.totalSubjects}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Class Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{reportData.summary.classAverage}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pass Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{reportData.summary.passPercentage}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Highest Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{reportData.summary.highestPercentage}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Lowest Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{reportData.summary.lowestPercentage}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SubjectAverageChart data={reportData.chartData.subjectAverages} />
          <PassFailChart data={reportData.chartData.passFailData} />
          <GradeDistributionChart data={reportData.chartData.gradeDistribution} />
          
          {/* Performance Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>Key observations and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Key Insights</h4>
                  <ul className="space-y-1 text-sm">
                    {reportData.insights.keyInsights.map((insight, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span className="text-gray-600">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                  <ul className="space-y-1 text-sm">
                    {reportData.insights.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-gray-600">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Analysis */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Subject Analysis</CardTitle>
              <CardDescription>Detailed performance breakdown by subject</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Subject</th>
                      <th className="text-center py-2">Average</th>
                      <th className="text-center py-2">Highest</th>
                      <th className="text-center py-2">Lowest</th>
                      <th className="text-center py-2">Pass Rate</th>
                      <th className="text-center py-2">Difficulty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.subjectAnalysis.map((subject, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 font-medium">{subject.subject}</td>
                        <td className="py-3 text-center">{subject.average}%</td>
                        <td className="py-3 text-center text-green-600">{subject.highest}</td>
                        <td className="py-3 text-center text-orange-600">{subject.lowest}</td>
                        <td className="py-3 text-center">{subject.passRate}%</td>
                        <td className="py-3 text-center">
                          <Badge variant={
                            subject.difficulty === 'Easy' ? 'success' :
                            subject.difficulty === 'Moderate' ? 'info' : 'warning'
                          }>
                            {subject.difficulty}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Rankings */}
        <div className="mb-8">
          <StudentRankingTable 
            data={reportData.studentRankings}
            title="Top 10 Students"
            description="Students ranked by overall performance"
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
