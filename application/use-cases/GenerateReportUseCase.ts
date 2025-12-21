/**
 * Generate Report Use Case
 * Orchestrates the report generation and persistence workflow
 */

import { Result } from '../../domain/entities/Result'
import { ReportRepositoryPort, SaveReportData } from '../ports/ReportRepositoryPort'
import { AuthPort } from '../ports/AuthPort'

export interface GenerateReportRequest {
  resultData: Result
  userId: string
  reportOptions?: {
    title?: string
    tags?: string[]
    isPublic?: boolean
    institution?: string
  }
  formatOptions?: {
    includeSummary?: boolean
    includeRankings?: boolean
    includeSubjectAnalysis?: boolean
    includeInsights?: boolean
    includeCharts?: boolean
  }
}

export interface GenerateReportResponse {
  success: boolean
  report?: {
    id: string
    title: string
    createdAt: Date
    summary: {
      totalStudents: number
      classAverage: number
      passRate: number
    }
    downloadUrl?: string
    viewUrl: string
  }
  errors?: string[]
}

export class GenerateReportUseCase {
  constructor(
    private readonly reportRepositoryPort: ReportRepositoryPort,
    private readonly authPort: AuthPort
  ) {}

  async execute(request: GenerateReportRequest): Promise<GenerateReportResponse> {
    try {
      // 1. Validate user authentication
      const user = await this.authPort.getCurrentUser()
      if (!user || user.id !== request.userId) {
        return {
          success: false,
          errors: ['User not authenticated or unauthorized']
        }
      }

      // 2. Validate request
      const validationResult = this.validateRequest(request)
      if (!validationResult.isValid) {
        return {
          success: false,
          errors: validationResult.errors
        }
      }

      // 3. Prepare report data
      const reportData = this.prepareReportData(request, user)

      // 4. Save report to repository
      const saveResult = await this.reportRepositoryPort.saveReport(reportData)

      if (!saveResult.success) {
        return {
          success: false,
          errors: [saveResult.error || 'Failed to save report']
        }
      }

      // 5. Generate report summary
      const reportSummary = this.generateReportSummary(request.resultData)

      // 6. Create response
      return {
        success: true,
        report: {
          id: saveResult.reportId!,
          title: request.reportOptions?.title || request.resultData.getTitle(),
          createdAt: new Date(),
          summary: reportSummary,
          viewUrl: `/reports/${saveResult.reportId}`
        }
      }

    } catch (error) {
      return {
        success: false,
        errors: [`Report generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
      }
    }
  }

  private validateRequest(request: GenerateReportRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Validate result data
    if (!request.resultData) {
      errors.push('Result data is required')
      return { isValid: false, errors }
    }

    // Validate user ID
    if (!request.userId) {
      errors.push('User ID is required')
    }

    // Validate result has minimum required data
    if (request.resultData.getStudentCount() === 0) {
      errors.push('Result must contain at least one student')
    }

    if (request.resultData.getSubjects().length === 0) {
      errors.push('Result must contain at least one subject')
    }

    // Validate title length if provided
    if (request.reportOptions?.title && request.reportOptions.title.length > 100) {
      errors.push('Report title cannot exceed 100 characters')
    }

    // Validate tags
    if (request.reportOptions?.tags) {
      if (request.reportOptions.tags.length > 10) {
        errors.push('Cannot have more than 10 tags')
      }
      
      const invalidTags = request.reportOptions.tags.filter(tag => 
        !tag || tag.length === 0 || tag.length > 30
      )
      
      if (invalidTags.length > 0) {
        errors.push('All tags must be between 1-30 characters')
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  private prepareReportData(request: GenerateReportRequest, user: any): SaveReportData {
    // Set default title if not provided
    const title = request.reportOptions?.title || request.resultData.getTitle()
    
    // Update result title if different
    if (title !== request.resultData.getTitle()) {
      // Note: We'd need a method to update the title in the Result entity
      // For now, we'll work with the existing title
    }

    // Prepare tags
    const tags = request.reportOptions?.tags || []
    
    // Add auto-tags based on result data
    const autoTags = this.generateAutoTags(request.resultData)
    const allTags = [...new Set([...tags, ...autoTags])] // Remove duplicates

    return {
      result: request.resultData,
      createdBy: request.userId,
      tags: allTags.slice(0, 10), // Limit to 10 tags
      institution: request.reportOptions?.institution || user.institution,
      isPublic: request.reportOptions?.isPublic || false
    }
  }

  private generateAutoTags(result: Result): string[] {
    const tags: string[] = []
    
    // Add subject count tag
    const subjectCount = result.getSubjects().length
    if (subjectCount <= 3) tags.push('few-subjects')
    else if (subjectCount >= 8) tags.push('many-subjects')
    
    // Add class size tag
    const studentCount = result.getStudentCount()
    if (studentCount <= 10) tags.push('small-class')
    else if (studentCount >= 50) tags.push('large-class')
    
    // Add performance tag based on class average
    const studentResults = result.getStudentResults()
    if (studentResults.length > 0) {
      const classAverage = studentResults.reduce((sum, sr) => 
        sum + sr.percentage.getValue(), 0
      ) / studentResults.length
      
      if (classAverage >= 85) tags.push('high-performance')
      else if (classAverage <= 50) tags.push('low-performance')
    }
    
    // Add subject tags for common subjects
    const subjects = result.getSubjects().map(s => s.getName().toLowerCase())
    const commonSubjects = ['mathematics', 'science', 'english', 'physics', 'chemistry', 'biology']
    
    commonSubjects.forEach(subject => {
      if (subjects.some(s => s.includes(subject))) {
        tags.push(subject)
      }
    })
    
    return tags
  }

  private generateReportSummary(result: Result) {
    const studentResults = result.getStudentResults()
    const totalStudents = studentResults.length
    
    let classAverage = 0
    let passCount = 0
    
    if (totalStudents > 0) {
      classAverage = studentResults.reduce((sum, sr) => 
        sum + sr.percentage.getValue(), 0
      ) / totalStudents
      
      passCount = studentResults.filter(sr => 
        sr.percentage.getValue() >= 40
      ).length
    }
    
    return {
      totalStudents,
      classAverage: Math.round(classAverage * 100) / 100,
      passRate: Math.round((passCount / Math.max(totalStudents, 1)) * 100 * 100) / 100
    }
  }

  /**
   * Get existing report
   */
  async getReport(reportId: string, userId: string): Promise<{
    success: boolean
    report?: Result
    metadata?: any
    error?: string
  }> {
    try {
      // Verify user authentication
      const user = await this.authPort.getCurrentUser()
      if (!user || user.id !== userId) {
        return {
          success: false,
          error: 'User not authenticated or unauthorized'
        }
      }

      // Get report from repository
      const result = await this.reportRepositoryPort.getReport(reportId)
      
      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Report not found'
        }
      }

      return {
        success: true,
        report: result.report,
        metadata: result.metadata
      }

    } catch (error) {
      return {
        success: false,
        error: `Failed to retrieve report: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * List user's reports
   */
  async listUserReports(userId: string, page: number = 1, limit: number = 20): Promise<{
    success: boolean
    reports?: any[]
    total?: number
    error?: string
  }> {
    try {
      // Verify user authentication
      const user = await this.authPort.getCurrentUser()
      if (!user || user.id !== userId) {
        return {
          success: false,
          error: 'User not authenticated or unauthorized'
        }
      }

      // Get reports from repository
      const result = await this.reportRepositoryPort.getUserReports(userId, {
        page,
        limit,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      })

      return {
        success: result.success,
        reports: result.reports,
        total: result.total,
        error: result.error
      }

    } catch (error) {
      return {
        success: false,
        error: `Failed to list reports: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Delete report
   */
  async deleteReport(reportId: string, userId: string): Promise<{
    success: boolean
    error?: string
  }> {
    try {
      // Verify user authentication
      const user = await this.authPort.getCurrentUser()
      if (!user || user.id !== userId) {
        return {
          success: false,
          error: 'User not authenticated or unauthorized'
        }
      }

      // Verify report ownership (get report metadata first)
      const reportResult = await this.reportRepositoryPort.getReportSummary(reportId)
      if (!reportResult.success) {
        return {
          success: false,
          error: 'Report not found'
        }
      }

      if (reportResult.summary?.createdBy !== userId) {
        return {
          success: false,
          error: 'Unauthorized to delete this report'
        }
      }

      // Delete report
      const deleteResult = await this.reportRepositoryPort.deleteReport(reportId)
      
      return {
        success: deleteResult.success,
        error: deleteResult.error
      }

    } catch (error) {
      return {
        success: false,
        error: `Failed to delete report: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }
}
