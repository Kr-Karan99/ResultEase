/**
 * Report Repository Port Interface
 * Defines the contract for report persistence services
 * This interface will be implemented by mock services now and Firebase Firestore later
 */

import { Result } from '../../domain/entities/Result'

export interface ReportSummary {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
  studentCount: number
  subjectCount: number
  classAverage: number
  status: 'processing' | 'completed' | 'error'
  tags?: string[]
  institution?: string
}

export interface SaveReportData {
  result: Result
  createdBy: string
  tags?: string[]
  institution?: string
  isPublic?: boolean
}

export interface UpdateReportData {
  title?: string
  tags?: string[]
  isPublic?: boolean
}

export interface ReportFilter {
  createdBy?: string
  institution?: string
  tags?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  status?: 'processing' | 'completed' | 'error'
}

export interface PaginationOptions {
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'classAverage'
  sortOrder?: 'asc' | 'desc'
}

export interface ReportRepositoryPort {
  /**
   * Save a new report
   */
  saveReport(data: SaveReportData): Promise<{
    success: boolean
    reportId?: string
    error?: string
  }>
  
  /**
   * Get a report by ID (full data)
   */
  getReport(reportId: string): Promise<{
    success: boolean
    report?: Result
    metadata?: ReportSummary
    error?: string
  }>
  
  /**
   * Get report summary by ID (metadata only)
   */
  getReportSummary(reportId: string): Promise<{
    success: boolean
    summary?: ReportSummary
    error?: string
  }>
  
  /**
   * List reports with filtering and pagination
   */
  listReports(
    filter?: ReportFilter,
    pagination?: PaginationOptions
  ): Promise<{
    success: boolean
    reports?: ReportSummary[]
    total?: number
    hasMore?: boolean
    error?: string
  }>
  
  /**
   * Update report metadata
   */
  updateReport(reportId: string, updates: UpdateReportData): Promise<{
    success: boolean
    error?: string
  }>
  
  /**
   * Delete a report
   */
  deleteReport(reportId: string): Promise<{
    success: boolean
    error?: string
  }>
  
  /**
   * Check if report exists
   */
  reportExists(reportId: string): Promise<boolean>
  
  /**
   * Get reports by user
   */
  getUserReports(
    userId: string,
    pagination?: PaginationOptions
  ): Promise<{
    success: boolean
    reports?: ReportSummary[]
    total?: number
    error?: string
  }>
  
  /**
   * Search reports by title or tags
   */
  searchReports(
    query: string,
    filter?: ReportFilter,
    pagination?: PaginationOptions
  ): Promise<{
    success: boolean
    reports?: ReportSummary[]
    total?: number
    error?: string
  }>
  
  /**
   * Get report statistics for a user or institution
   */
  getReportStatistics(userId?: string, institution?: string): Promise<{
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
  }>
  
  /**
   * Bulk delete reports
   */
  deleteReports(reportIds: string[]): Promise<{
    success: boolean
    deletedCount: number
    errors?: string[]
  }>
  
  /**
   * Archive old reports
   */
  archiveReports(olderThan: Date): Promise<{
    success: boolean
    archivedCount: number
    error?: string
  }>
  
  /**
   * Export report data
   */
  exportReport(reportId: string, format: 'json' | 'csv'): Promise<{
    success: boolean
    data?: string | Buffer
    error?: string
  }>
}
