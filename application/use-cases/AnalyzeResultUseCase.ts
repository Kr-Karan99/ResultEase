/**
 * Analyze Result Use Case
 * Orchestrates the result analysis workflow using domain services
 */

import { Result } from '../../domain/entities/Result'
import { ResultCalculator } from '../../domain/services/ResultCalculator'
import { RankingService } from '../../domain/services/RankingService'
import { AnalyticsService } from '../../domain/services/AnalyticsService'
import { AuthPort } from '../ports/AuthPort'

export interface AnalyzeResultRequest {
  resultData: {
    id: string
    title: string
    subjects: string[]
    studentData: Array<{
      name: string
      rollNumber: string
      class?: string
      section?: string
      marks: Record<string, number | string>
    }>
  }
  userId: string
  options?: {
    passingPercentage?: number
    generateRanks?: boolean
    includeInsights?: boolean
  }
}

export interface AnalyzeResultResponse {
  success: boolean
  analysis?: {
    resultId: string
    summary: {
      totalStudents: number
      totalSubjects: number
      classAverage: number
      passPercentage: number
      highestPercentage: number
      lowestPercentage: number
    }
    subjectAnalysis: Array<{
      subject: string
      average: number
      highest: number
      lowest: number
      passRate: number
      difficulty: string
    }>
    studentRankings: Array<{
      rank: number
      name: string
      rollNumber: string
      totalMarks: number
      percentage: number
      grade: string
    }>
    performanceInsights: {
      classPerformance: string
      keyInsights: string[]
      recommendations: string[]
      topPerformers: number
      strugglingStudents: number
    }
    gradeDistribution: Record<string, number>
    chartData: {
      subjectAverages: Array<{ subject: string; average: number }>
      passFailData: Array<{ name: string; value: number }>
      gradeDistribution: Array<{ grade: string; count: number }>
    }
  }
  errors?: string[]
}

export class AnalyzeResultUseCase {
  constructor(private readonly authPort: AuthPort) {}

  async execute(request: AnalyzeResultRequest): Promise<AnalyzeResultResponse> {
    try {
      // 1. Validate user authentication
      const authResult = await this.authPort.isAuthenticated()
      if (!authResult) {
        return {
          success: false,
          errors: ['User not authenticated']
        }
      }

      // 2. Validate request data
      const validationResult = this.validateRequest(request)
      if (!validationResult.isValid) {
        return {
          success: false,
          errors: validationResult.errors
        }
      }

      // 3. Create Result entity from raw data
      const result = Result.fromRawData(request.resultData)

      // 4. Apply options
      const passingPercentage = request.options?.passingPercentage || 40
      const generateRanks = request.options?.generateRanks !== false
      const includeInsights = request.options?.includeInsights !== false

      // 5. Generate rankings if requested
      if (generateRanks) {
        result.calculateRanks()
      }

      // 6. Perform comprehensive analysis
      const analysis = await this.performAnalysis(result, passingPercentage, includeInsights)

      return {
        success: true,
        analysis: {
          resultId: result.getId(),
          ...analysis
        }
      }

    } catch (error) {
      return {
        success: false,
        errors: [`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
      }
    }
  }

  private validateRequest(request: AnalyzeResultRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Validate result data
    if (!request.resultData) {
      errors.push('Result data is required')
      return { isValid: false, errors }
    }

    // Validate basic fields
    if (!request.resultData.id) errors.push('Result ID is required')
    if (!request.resultData.title) errors.push('Result title is required')
    if (!request.resultData.subjects || request.resultData.subjects.length === 0) {
      errors.push('At least one subject is required')
    }
    if (!request.resultData.studentData || request.resultData.studentData.length === 0) {
      errors.push('At least one student record is required')
    }

    // Validate student data structure
    if (request.resultData.studentData) {
      request.resultData.studentData.forEach((student, index) => {
        if (!student.name) errors.push(`Student ${index + 1}: Name is required`)
        if (!student.rollNumber) errors.push(`Student ${index + 1}: Roll number is required`)
        if (!student.marks || Object.keys(student.marks).length === 0) {
          errors.push(`Student ${index + 1}: Marks data is required`)
        }
      })
    }

    // Validate user ID
    if (!request.userId) errors.push('User ID is required')

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  private async performAnalysis(
    result: Result, 
    passingPercentage: number, 
    includeInsights: boolean
  ) {
    // 1. Calculate summary statistics
    const classStats = ResultCalculator.calculateClassStatistics(result)
    const passFailRates = AnalyticsService.calculatePassFailRates(result, passingPercentage)

    const summary = {
      totalStudents: classStats.studentsCount,
      totalSubjects: result.getSubjects().length,
      classAverage: classStats.averagePercentage,
      passPercentage: passFailRates.passPercentage.getValue(),
      highestPercentage: classStats.highestPercentage,
      lowestPercentage: classStats.lowestPercentage
    }

    // 2. Analyze each subject
    const subjectAnalysis = result.getSubjects().map(subject => {
      const subjectStats = ResultCalculator.calculateSubjectStatistics(result, subject.getName())
      const subjectPassFail = AnalyticsService.calculateSubjectPassFailRates(result)
      const subjectData = subjectPassFail[subject.getName()]

      return {
        subject: subject.getName(),
        average: subjectStats.average,
        highest: subjectStats.highest,
        lowest: subjectStats.lowest,
        passRate: subjectData?.passPercentage.getValue() || 0,
        difficulty: this.determineDifficulty(subjectStats.average, subjectData?.passPercentage.getValue() || 0)
      }
    })

    // 3. Get student rankings
    const studentRankings = RankingService.rankByPercentage(result.getStudentResults()).map(sr => ({
      rank: sr.rank || 0,
      name: sr.student.getName(),
      rollNumber: sr.student.getRollNumber(),
      totalMarks: sr.totalMarks.getValue(),
      percentage: sr.percentage.getValue(),
      grade: sr.percentage.getLetterGrade()
    }))

    // 4. Generate performance insights
    let performanceInsights = {
      classPerformance: 'Average',
      keyInsights: [] as string[],
      recommendations: [] as string[],
      topPerformers: 0,
      strugglingStudents: 0
    }

    if (includeInsights) {
      const insights = AnalyticsService.generatePerformanceInsights(result)
      const topPerformers = AnalyticsService.identifyHighPerformers(result)
      const strugglingStudents = AnalyticsService.identifyStrugglingStudents(result)

      performanceInsights = {
        classPerformance: insights.classPerformance,
        keyInsights: insights.keyInsights,
        recommendations: insights.recommendations,
        topPerformers: topPerformers.length,
        strugglingStudents: strugglingStudents.length
      }
    }

    // 5. Calculate grade distribution
    const gradeDistribution = ResultCalculator.calculateGradeDistribution(result)

    // 6. Prepare chart data
    const chartData = {
      subjectAverages: result.getSubjects().map(subject => ({
        subject: subject.getName(),
        average: Math.round(ResultCalculator.calculateSubjectAverage(result, subject.getName()) * 100) / 100
      })),
      passFailData: [
        { name: 'Passed', value: passFailRates.passed },
        { name: 'Failed', value: passFailRates.failed }
      ],
      gradeDistribution: Object.entries(gradeDistribution).map(([grade, count]) => ({
        grade,
        count
      }))
    }

    return {
      summary,
      subjectAnalysis,
      studentRankings,
      performanceInsights,
      gradeDistribution,
      chartData
    }
  }

  private determineDifficulty(average: number, passRate: number): string {
    if (passRate >= 90 && average >= 75) return 'Easy'
    if (passRate >= 75 && average >= 60) return 'Moderate'
    if (passRate >= 50 && average >= 45) return 'Difficult'
    return 'Very Difficult'
  }
}
