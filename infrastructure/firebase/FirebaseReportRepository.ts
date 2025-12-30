/**
 * Firebase Report Repository
 * Handles saving and retrieving reports from Firestore subcollections
 * Structure: users/{email}/reports/{reportId}
 */

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import firebaseApp from '@/lib/firebase'

export interface SavedReport {
  id: string
  title: string
  fileName?: string
  createdAt: Timestamp | Date
  updatedAt: Timestamp | Date
  createdBy: string
  // Full report data
  reportData: {
    id: string
    title: string
    createdAt: string
    createdBy: string
    institution: string
    status: string
    fileName?: string
    summary: any
    subjectAnalysis: any
    chartData: any
    studentRankings: any[]
    performanceInsights: any
    gradeDistribution: any
  }
}

export class FirebaseReportRepository {
  private db = getFirestore(firebaseApp)

  /**
   * Get reports subcollection reference for a user
   */
  private getReportsCollection(userEmail: string) {
    const sanitizedEmail = this.sanitizeEmail(userEmail)
    return collection(this.db, 'users', sanitizedEmail, 'reports')
  }

  /**
   * Sanitize email for use as Firestore document ID
   */
  private sanitizeEmail(email: string): string {
    return email.toLowerCase().trim()
  }

  /**
   * Save a report to user's reports subcollection
   */
  async saveReport(userEmail: string, reportData: SavedReport['reportData']): Promise<string> {
    try {
      const sanitizedEmail = this.sanitizeEmail(userEmail)
      const reportsCollection = this.getReportsCollection(sanitizedEmail)
      
      // Generate report ID
      const reportId = `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const reportDocRef = doc(reportsCollection, reportId)

      const savedReport: SavedReport = {
        id: reportId,
        title: reportData.title || 'Result Analysis',
        fileName: reportData.fileName,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
        createdBy: sanitizedEmail,
        reportData: reportData,
      }

      await setDoc(reportDocRef, savedReport)
      console.log('Report saved successfully:', reportId)
      
      return reportId
    } catch (error) {
      console.error('Error saving report:', error)
      throw new Error(`Failed to save report: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get a specific report by ID
   */
  async getReport(userEmail: string, reportId: string): Promise<SavedReport | null> {
    try {
      const sanitizedEmail = this.sanitizeEmail(userEmail)
      const reportsCollection = this.getReportsCollection(sanitizedEmail)
      const reportDocRef = doc(reportsCollection, reportId)
      const reportDoc = await getDoc(reportDocRef)

      if (!reportDoc.exists()) {
        return null
      }

      return reportDoc.data() as SavedReport
    } catch (error) {
      console.error('Error fetching report:', error)
      throw new Error(`Failed to fetch report: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get all reports for a user, ordered by creation date (newest first)
   */
  async getUserReports(userEmail: string, limitCount: number = 10): Promise<SavedReport[]> {
    try {
      const sanitizedEmail = this.sanitizeEmail(userEmail)
      const reportsCollection = this.getReportsCollection(sanitizedEmail)
      
      const q = query(
        reportsCollection,
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )

      const querySnapshot = await getDocs(q)
      const reports: SavedReport[] = []

      querySnapshot.forEach((doc) => {
        reports.push(doc.data() as SavedReport)
      })

      return reports
    } catch (error) {
      console.error('Error fetching user reports:', error)
      throw new Error(`Failed to fetch reports: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get all reports for a user (unlimited)
   */
  async getAllUserReports(userEmail: string): Promise<SavedReport[]> {
    try {
      const sanitizedEmail = this.sanitizeEmail(userEmail)
      const reportsCollection = this.getReportsCollection(sanitizedEmail)
      
      const q = query(
        reportsCollection,
        orderBy('createdAt', 'desc')
      )

      const querySnapshot = await getDocs(q)
      const reports: SavedReport[] = []

      querySnapshot.forEach((doc) => {
        reports.push(doc.data() as SavedReport)
      })

      return reports
    } catch (error) {
      console.error('Error fetching all user reports:', error)
      throw new Error(`Failed to fetch reports: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get reports from organization members
   * Fetches reports from all members in the organization
   */
  async getOrganizationReports(memberEmails: string[]): Promise<SavedReport[]> {
    try {
      const allReports: SavedReport[] = []

      // Fetch reports from all members in parallel
      const reportPromises = memberEmails.map(async (memberEmail) => {
        try {
          const memberReports = await this.getAllUserReports(memberEmail)
          return memberReports
        } catch (error) {
          console.error(`Error fetching reports for ${memberEmail}:`, error)
          return []
        }
      })

      const reportsArrays = await Promise.all(reportPromises)
      
      // Flatten and combine all reports
      reportsArrays.forEach((reports) => {
        allReports.push(...reports)
      })

      // Sort by creation date (newest first)
      allReports.sort((a, b) => {
        const dateA = a.createdAt instanceof Date 
          ? a.createdAt.getTime() 
          : (a.createdAt as any)?.toDate?.()?.getTime() || 0
        const dateB = b.createdAt instanceof Date 
          ? b.createdAt.getTime() 
          : (b.createdAt as any)?.toDate?.()?.getTime() || 0
        return dateB - dateA
      })

      return allReports
    } catch (error) {
      console.error('Error fetching organization reports:', error)
      throw new Error(`Failed to fetch organization reports: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Delete a report
   */
  async deleteReport(userEmail: string, reportId: string): Promise<void> {
    try {
      const sanitizedEmail = this.sanitizeEmail(userEmail)
      const reportsCollection = this.getReportsCollection(sanitizedEmail)
      const reportDocRef = doc(reportsCollection, reportId)
      
      await deleteDoc(reportDocRef)
      console.log('Report deleted successfully:', reportId)
    } catch (error) {
      console.error('Error deleting report:', error)
      throw new Error(`Failed to delete report: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

// Export singleton instance
export const firebaseReportRepository = new FirebaseReportRepository()

