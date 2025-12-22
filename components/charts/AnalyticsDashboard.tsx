'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SubjectAverageChart, GradeDistributionChart } from './BarChart'
import { PassFailChart, PerformanceLevelChart } from './PieChart'
import { PerformanceTrendChart, SubjectComparisonChart } from './LineChart'
import { formatNumber, formatPercentage } from '@/lib/utils'

interface AnalyticsDashboardProps {
  data: {
    summary: {
      totalStudents: number
      totalSubjects: number
      classAverage: number
      passPercentage: number
      highestPercentage: number
      lowestPercentage: number
      topPerformers: number
      strugglingStudents: number
    }
    subjectAnalysis: Array<{
      subject: string
      average: number
      highest: number
      lowest: number
      passRate: number
      difficulty: 'Easy' | 'Moderate' | 'Difficult' | 'Very Difficult'
    }>
    chartData: {
      subjectAverages: Array<{ subject: string; average: number }>
      passFailData: Array<{ name: string; value: number }>
      gradeDistribution: Array<{ grade: string; count: number }>
      performanceDistribution: Array<{
        name: string
        value: number
      }>
      trendData?: Array<{ exam: string; average: number }>
      subjectComparison?: Array<{ [key: string]: any }>
    }
    insights: {
      classPerformance: 'Excellent' | 'Good' | 'Average' | 'Below Average' | 'Poor'
      keyInsights: string[]
      recommendations: string[]
      strengths: string[]
      concerns: string[]
    }
  }
  className?: string
}

export function AnalyticsDashboard({ data, className }: AnalyticsDashboardProps) {
  const {
    summary,
    subjectAnalysis,
    chartData,
    insights
  } = data

  const getPerformanceBadgeVariant = (performance: string) => {
    switch (performance) {
      case 'Excellent': return 'success'
      case 'Good': return 'info'  
      case 'Average': return 'secondary'
      case 'Below Average': return 'warning'
      case 'Poor': return 'destructive'
      default: return 'secondary'
    }
  }

  const getDifficultyBadgeVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'success'
      case 'Moderate': return 'info'
      case 'Difficult': return 'warning'
      case 'Very Difficult': return 'destructive'
      default: return 'secondary'
    }
  }

  return (
    <div className={className}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students Analyzed</CardTitle>
            <div className="text-2xl">👨‍🎓</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Across {summary.totalSubjects} subjects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Average</CardTitle>
            <div className="text-2xl">📊</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatPercentage(summary.classAverage)}
            </div>
            <Badge 
              variant={getPerformanceBadgeVariant(insights.classPerformance)}
              className="text-xs"
            >
              {insights.classPerformance}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <div className="text-2xl">✅</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatPercentage(summary.passPercentage)}
            </div>
            <p className="text-xs text-muted-foreground">
              {chartData.passFailData.find(d => d.name === 'Passed')?.value} students passed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score Range</CardTitle>
            <div className="text-2xl">📈</div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-green-600 font-medium">
                {formatPercentage(summary.highestPercentage)}
              </span>
              <span className="text-gray-400">-</span>
              <span className="text-sm text-orange-600 font-medium">
                {formatPercentage(summary.lowestPercentage)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Highest - Lowest scores
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <SubjectAverageChart data={chartData.subjectAverages} />
        <PassFailChart data={chartData.passFailData} />
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <GradeDistributionChart data={chartData.gradeDistribution} />
        <PerformanceLevelChart data={chartData.performanceDistribution} />
      </div>

      {/* Trend Analysis (if available) */}
      {chartData.trendData && chartData.trendData.length > 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PerformanceTrendChart data={chartData.trendData} />
          
          {chartData.subjectComparison && (
            <SubjectComparisonChart 
              data={chartData.subjectComparison}
              subjects={chartData.subjectAverages.map(s => s.subject)}
            />
          )}
        </div>
      )}

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Subject Performance Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Subject Performance Analysis</CardTitle>
            <CardDescription>
              Detailed breakdown of performance by subject
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjectAnalysis.map((subject, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{subject.subject}</h4>
                      <Badge variant={getDifficultyBadgeVariant(subject.difficulty)}>
                        {subject.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Avg: {formatPercentage(subject.average)}</span>
                      <span>Pass: {formatPercentage(subject.passRate)}</span>
                      <span>Range: {subject.lowest}-{subject.highest}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights & Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Key Insights & Recommendations</CardTitle>
            <CardDescription>
              AI-powered analysis and suggestions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Strengths */}
              {insights.strengths && insights.strengths.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-700 mb-2 flex items-center">
                    <span className="mr-2">💪</span> Strengths
                  </h4>
                  <ul className="space-y-1">
                    {insights.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-gray-600">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Insights */}
              <div>
                <h4 className="font-medium text-blue-700 mb-2 flex items-center">
                  <span className="mr-2">💡</span> Key Insights
                </h4>
                <ul className="space-y-1">
                  {insights.keyInsights.map((insight, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <span className="text-blue-500 mt-1">•</span>
                      <span className="text-gray-600">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Concerns */}
              {insights.concerns && insights.concerns.length > 0 && (
                <div>
                  <h4 className="font-medium text-orange-700 mb-2 flex items-center">
                    <span className="mr-2">⚠️</span> Areas of Concern
                  </h4>
                  <ul className="space-y-1">
                    {insights.concerns.map((concern, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <span className="text-orange-500 mt-1">!</span>
                        <span className="text-gray-600">{concern}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              <div>
                <h4 className="font-medium text-purple-700 mb-2 flex items-center">
                  <span className="mr-2">🎯</span> Recommendations
                </h4>
                <ul className="space-y-1">
                  {insights.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <span className="text-purple-500 mt-1">→</span>
                      <span className="text-gray-600">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
          <CardDescription>
            Quick overview of key performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {summary.topPerformers}
              </div>
              <div className="text-sm text-green-700">Top Performers</div>
              <div className="text-xs text-gray-500">
                ({formatPercentage((summary.topPerformers / summary.totalStudents) * 100)} of class)
              </div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {summary.strugglingStudents}
              </div>
              <div className="text-sm text-orange-700">Need Support</div>
              <div className="text-xs text-gray-500">
                ({formatPercentage((summary.strugglingStudents / summary.totalStudents) * 100)} of class)
              </div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {subjectAnalysis.reduce((sum, s) => sum + s.average, 0) / subjectAnalysis.length}%
              </div>
              <div className="text-sm text-blue-700">Avg Across Subjects</div>
              <div className="text-xs text-gray-500">Overall performance</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {subjectAnalysis.filter(s => s.difficulty === 'Easy').length}
              </div>
              <div className="text-sm text-purple-700">Easy Subjects</div>
              <div className="text-xs text-gray-500">
                vs {subjectAnalysis.filter(s => s.difficulty !== 'Easy').length} challenging
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
