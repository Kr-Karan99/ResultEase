/**
 * Mock Report Repository
 * Implements ReportRepositoryPort interface for development and testing
 * Will be replaced with Firebase Firestore in production
 */

import { 
  ReportRepositoryPort, 
  ReportSummary, 
  SaveReportData, 
  UpdateReportData, 
  ReportFilter,
  PaginationOptions 
} from '../../application/ports/ReportRepositoryPort'
import { Result } from '../../domain/entities/Result'

interface MockReportData {
  id: string
  result: Result
  metadata: ReportSummary
  rawData: string // Serialized result data
}

export class MockReportRepository implements ReportRepositoryPort {
  private reports: Map<string, MockReportData> = new Map()
  
  constructor() {
    // Initialize with demo reports
    this.initializeDemoReports()
  }

  private initializeDemoReports() {
    // We'll add demo reports after we can create Result entities
    // For now, start with empty repository
  }

  async saveReport(data: SaveReportData): Promise<{
    success: boolean
    reportId?: string
    error?: string
  }> {
    // Simulate save delay
    await this.delay(600)

    try {
      // Generate report ID
      const reportId = this.generateReportId()
      
      // Create metadata
      const metadata: ReportSummary = {
        id: reportId,
        title: data.result.getTitle(),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: data.createdBy,
        studentCount: data.result.getStudentCount(),
        subjectCount: data.result.getSubjects().length,
        classAverage: this.calculateClassAverage(data.result),
        status: 'completed',
        tags: data.tags,
        institution: data.institution
      }

      // Serialize result data
      const rawData = JSON.stringify(data.result.toExportData())

      // Store report
      const mockReport: MockReportData = {
        id: reportId,
        result: data.result,
        metadata,
        rawData
      }

      this.reports.set(reportId, mockReport)

      return {
        success: true,
        reportId
      }

    } catch (error) {
      return {
        success: false,
        error: `Failed to save report: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  async getReport(reportId: string): Promise<{
    success: boolean
    report?: Result
    metadata?: ReportSummary
    error?: string
  }> {
    await this.delay(300)

    const mockReport = this.reports.get(reportId)
    
    if (!mockReport) {
      return {
        success: false,
        error: 'Report not found'
      }
    }

    return {
      success: true,
      report: mockReport.result,
      metadata: mockReport.metadata
    }
  }

  async getReportSummary(reportId: string): Promise<{
    success: boolean
    summary?: ReportSummary
    error?: string
  }> {
    await this.delay(100)

    const mockReport = this.reports.get(reportId)
    
    if (!mockReport) {
      return {
        success: false,
        error: 'Report not found'
      }
    }

    return {
      success: true,
      summary: mockReport.metadata
    }
  }

  async listReports(
    filter?: ReportFilter,
    pagination?: PaginationOptions
  ): Promise<{
    success: boolean
    reports?: ReportSummary[]
    total?: number
    hasMore?: boolean
    error?: string
  }> {
    await this.delay(200)

    try {
      let reports = Array.from(this.reports.values())

      // Apply filters
      if (filter) {
        if (filter.createdBy) {
          reports = reports.filter(r => r.metadata.createdBy === filter.createdBy)
        }
        
        if (filter.institution) {
          reports = reports.filter(r => r.metadata.institution === filter.institution)
        }
        
        if (filter.tags && filter.tags.length > 0) {
          reports = reports.filter(r => 
            r.metadata.tags && 
            filter.tags!.some(tag => r.metadata.tags!.includes(tag))
          )
        }
        
        if (filter.dateRange) {
          reports = reports.filter(r => {
            const createdAt = r.metadata.createdAt
            return createdAt >= filter.dateRange!.start && createdAt <= filter.dateRange!.end
          })
        }
        
        if (filter.status) {
          reports = reports.filter(r => r.metadata.status === filter.status)
        }
      }

      // Apply sorting
      const sortBy = pagination?.sortBy || 'createdAt'
      const sortOrder = pagination?.sortOrder || 'desc'
      
      reports.sort((a, b) => {
        let aVal: any, bVal: any
        
        switch (sortBy) {
          case 'createdAt':
            aVal = a.metadata.createdAt.getTime()
            bVal = b.metadata.createdAt.getTime()
            break
          case 'updatedAt':
            aVal = a.metadata.updatedAt.getTime()
            bVal = b.metadata.updatedAt.getTime()
            break
          case 'title':
            aVal = a.metadata.title.toLowerCase()
            bVal = b.metadata.title.toLowerCase()
            break
          case 'classAverage':
            aVal = a.metadata.classAverage
            bVal = b.metadata.classAverage
            break
          default:
            aVal = a.metadata.createdAt.getTime()
            bVal = b.metadata.createdAt.getTime()
        }
        
        if (sortOrder === 'desc') {
          return bVal < aVal ? -1 : bVal > aVal ? 1 : 0
        } else {
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
        }
      })

      // Apply pagination
      const page = pagination?.page || 1
      const limit = pagination?.limit || 20
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      
      const paginatedReports = reports.slice(startIndex, endIndex)
      const total = reports.length
      const hasMore = endIndex < total

      const reportSummaries = paginatedReports.map(r => r.metadata)

      return {
        success: true,
        reports: reportSummaries,
        total,
        hasMore
      }

    } catch (error) {
      return {
        success: false,
        error: `Failed to list reports: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  async updateReport(reportId: string, updates: UpdateReportData): Promise<{
    success: boolean
    error?: string
  }> {
    await this.delay(300)

    const mockReport = this.reports.get(reportId)
    
    if (!mockReport) {
      return {
        success: false,
        error: 'Report not found'
      }
    }

    // Apply updates
    if (updates.title !== undefined) {
      mockReport.metadata.title = updates.title
    }
    
    if (updates.tags !== undefined) {
      mockReport.metadata.tags = updates.tags
    }
    
    if (updates.isPublic !== undefined) {
      // Store isPublic in metadata (extend interface if needed)
      (mockReport.metadata as any).isPublic = updates.isPublic
    }
    
    mockReport.metadata.updatedAt = new Date()

    return {
      success: true
    }
  }

  async deleteReport(reportId: string): Promise<{
    success: boolean
    error?: string
  }> {
    await this.delay(200)

    if (!this.reports.has(reportId)) {
      return {
        success: false,
        error: 'Report not found'
      }
    }

    this.reports.delete(reportId)

    return {
      success: true
    }
  }

  async reportExists(reportId: string): Promise<boolean> {
    await this.delay(50)
    return this.reports.has(reportId)
  }

  async getUserReports(
    userId: string,
    pagination?: PaginationOptions
  ): Promise<{
    success: boolean
    reports?: ReportSummary[]
    total?: number
    error?: string
  }> {
    const result = await this.listReports({ createdBy: userId }, pagination)
    
    return {
      success: result.success,
      reports: result.reports,
      total: result.total,
      error: result.error
    }
  }

  async searchReports(
    query: string,
    filter?: ReportFilter,
    pagination?: PaginationOptions
  ): Promise<{
    success: boolean
    reports?: ReportSummary[]
    total?: number
    error?: string
  }> {
    await this.delay(250)

    try {
      let reports = Array.from(this.reports.values())

      // Apply base filters first
      if (filter) {
        const filterResult = await this.listReports(filter, { page: 1, limit: 10000 })
        if (!filterResult.success) {
          return {
            success: false,
            error: filterResult.error
          }
        }
        // Get the filtered report IDs
        const filteredIds = new Set(filterResult.reports?.map(r => r.id))
        reports = reports.filter(r => filteredIds.has(r.id))
      }

      // Apply search query
      const searchQuery = query.toLowerCase()
      const searchResults = reports.filter(r => {
        const metadata = r.metadata
        return (
          metadata.title.toLowerCase().includes(searchQuery) ||
          (metadata.tags && metadata.tags.some(tag => 
            tag.toLowerCase().includes(searchQuery)
          )) ||
          (metadata.institution && 
            metadata.institution.toLowerCase().includes(searchQuery))
        )
      })

      // Apply pagination
      const page = pagination?.page || 1
      const limit = pagination?.limit || 20
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      
      const paginatedResults = searchResults.slice(startIndex, endIndex)
      const total = searchResults.length

      const reportSummaries = paginatedResults.map(r => r.metadata)

      return {
        success: true,
        reports: reportSummaries,
        total
      }

    } catch (error) {
      return {
        success: false,
        error: `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  async getReportStatistics(userId?: string, institution?: string): Promise<{
    success: boolean
    statistics?: {
      totalReports: number
      reportsThisMonth: number
      averageClassSize: number
      totalStudentsAnalyzed: number
      mostActiveMonth: string
      topSubjects: string[]
    }
    error?: string
  }> {
    await this.delay(400)

    try {
      let reports = Array.from(this.reports.values())

      // Filter by user or institution
      if (userId) {
        reports = reports.filter(r => r.metadata.createdBy === userId)
      }
      
      if (institution) {
        reports = reports.filter(r => r.metadata.institution === institution)
      }

      if (reports.length === 0) {
        return {
          success: true,
          statistics: {
            totalReports: 0,
            reportsThisMonth: 0,
            averageClassSize: 0,
            totalStudentsAnalyzed: 0,
            mostActiveMonth: '',
            topSubjects: []
          }
        }
      }

      // Calculate statistics
      const now = new Date()
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      
      const totalReports = reports.length
      const reportsThisMonth = reports.filter(r => 
        r.metadata.createdAt >= thisMonth
      ).length
      
      const totalStudents = reports.reduce((sum, r) => sum + r.metadata.studentCount, 0)
      const averageClassSize = Math.round(totalStudents / totalReports)
      
      // Find most active month
      const monthCounts: Record<string, number> = {}
      reports.forEach(r => {
        const monthKey = `${r.metadata.createdAt.getFullYear()}-${r.metadata.createdAt.getMonth() + 1}`
        monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1
      })
      
      const mostActiveMonth = Object.entries(monthCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || ''

      // Find top subjects (from tags)
      const subjectCounts: Record<string, number> = {}
      reports.forEach(r => {
        r.metadata.tags?.forEach(tag => {
          const lowerTag = tag.toLowerCase()
          // Common subject names
          const subjects = ['mathematics', 'science', 'english', 'physics', 'chemistry', 'biology', 'history', 'geography']
          if (subjects.includes(lowerTag)) {
            subjectCounts[tag] = (subjectCounts[tag] || 0) + 1
          }
        })
      })
      
      const topSubjects = Object.entries(subjectCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([subject]) => subject)

      return {
        success: true,
        statistics: {
          totalReports,
          reportsThisMonth,
          averageClassSize,
          totalStudentsAnalyzed: totalStudents,
          mostActiveMonth,
          topSubjects
        }
      }

    } catch (error) {
      return {
        success: false,
        error: `Failed to get statistics: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  async deleteReports(reportIds: string[]): Promise<{
    success: boolean
    deletedCount: number
    errors?: string[]
  }> {
    await this.delay(500)

    let deletedCount = 0
    const errors: string[] = []

    for (const reportId of reportIds) {
      if (!this.reports.has(reportId)) {
        errors.push(`Report ${reportId} not found`)
        continue
      }

      this.reports.delete(reportId)
      deletedCount++
    }

    return {
      success: true,
      deletedCount,
      errors: errors.length > 0 ? errors : undefined
    }
  }

  async archiveReports(olderThan: Date): Promise<{
    success: boolean
    archivedCount: number
    error?: string
  }> {
    await this.delay(400)

    try {
      const reportsToArchive = Array.from(this.reports.values())
        .filter(r => r.metadata.createdAt < olderThan)

      // In a real system, we'd move these to archive storage
      // For mock, we'll just mark them as archived in metadata
      reportsToArchive.forEach(r => {
        (r.metadata as any).archived = true
        r.metadata.updatedAt = new Date()
      })

      return {
        success: true,
        archivedCount: reportsToArchive.length
      }

    } catch (error) {
      return {
        success: false,
        archivedCount: 0,
        error: `Archive failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  async exportReport(reportId: string, format: 'json' | 'csv'): Promise<{
    success: boolean
    data?: string | Buffer
    error?: string
  }> {
    await this.delay(600)

    const mockReport = this.reports.get(reportId)
    
    if (!mockReport) {
      return {
        success: false,
        error: 'Report not found'
      }
    }

    try {
      if (format === 'json') {
        return {
          success: true,
          data: mockReport.rawData
        }
      } else if (format === 'csv') {
        // Convert to CSV format
        const csvData = this.convertToCSV(mockReport.result)
        return {
          success: true,
          data: csvData
        }
      }

      return {
        success: false,
        error: 'Unsupported format'
      }

    } catch (error) {
      return {
        success: false,
        error: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  // Helper methods
  private generateReportId(): string {
    return 'report_' + Math.random().toString(36).substr(2, 9)
  }

  private calculateClassAverage(result: Result): number {
    const studentResults = result.getStudentResults()
    
    if (studentResults.length === 0) return 0
    
    const total = studentResults.reduce((sum, sr) => sum + sr.percentage.getValue(), 0)
    return Math.round((total / studentResults.length) * 100) / 100
  }

  private convertToCSV(result: Result): string {
    const studentResults = result.getStudentResults()
    const subjects = result.getSubjects()
    
    // Create header
    let csv = 'Name,Roll Number,Class,Section'
    subjects.forEach(subject => {
      csv += `,${subject.getName()}`
    })
    csv += ',Total,Percentage,Grade,Rank\n'
    
    // Add student data
    studentResults.forEach(sr => {
      csv += `"${sr.student.getName()}",${sr.student.getRollNumber()}`
      csv += `,"${sr.student.getClassName() || ''}","${sr.student.getSection() || ''}"`
      
      subjects.forEach(subject => {
        const marks = sr.marks.get(subject.getName())
        csv += `,${marks?.getValue() || 0}`
      })
      
      csv += `,${sr.totalMarks.getValue()},${sr.percentage.getValue()}`
      csv += `,${sr.percentage.getLetterGrade()},${sr.rank || ''}\n`
    })
    
    return csv
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Development helper methods
  reset() {
    this.reports.clear()
    this.initializeDemoReports()
  }

  getStoredReports(): MockReportData[] {
    return Array.from(this.reports.values())
  }
}
