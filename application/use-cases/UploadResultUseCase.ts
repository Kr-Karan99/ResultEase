/**
 * Upload Result Use Case
 * Orchestrates the Excel file upload and processing workflow
 */

import { Result } from '../../domain/entities/Result'
import { StoragePort } from '../ports/StoragePort'
import { AuthPort } from '../ports/AuthPort'

export interface UploadResultRequest {
  file: File
  title: string
  subjects?: string[]
  columnMapping?: Record<string, string> // Excel column -> data field mapping
  userId: string
}

export interface UploadResultResponse {
  success: boolean
  result?: {
    id: string
    previewData: {
      studentCount: number
      subjectCount: number
      subjects: string[]
      sampleStudents: Array<{
        name: string
        rollNumber: string
        marks: Record<string, number>
      }>
    }
  }
  errors?: string[]
  warnings?: string[]
}

export class UploadResultUseCase {
  constructor(
    private readonly storagePort: StoragePort,
    private readonly authPort: AuthPort
  ) {}

  async execute(request: UploadResultRequest): Promise<UploadResultResponse> {
    try {
      // 1. Validate user authentication
      const authResult = await this.authPort.isAuthenticated()
      if (!authResult) {
        return {
          success: false,
          errors: ['User not authenticated']
        }
      }

      // 2. Validate file
      const fileValidation = this.validateFile(request.file)
      if (!fileValidation.isValid) {
        return {
          success: false,
          errors: fileValidation.errors
        }
      }

      // 3. Validate title
      if (!request.title?.trim()) {
        return {
          success: false,
          errors: ['Title is required']
        }
      }

      // 4. Upload file to storage (optional - for future use)
      const uploadResult = await this.storagePort.uploadFile(
        request.file,
        `${request.userId}/${Date.now()}_${request.file.name}`,
        {
          folder: 'excel-files',
          metadata: {
            uploadedBy: request.userId,
            title: request.title,
            originalName: request.file.name
          }
        }
      )

      if (!uploadResult.success) {
        return {
          success: false,
          errors: ['Failed to upload file to storage']
        }
      }

      // 5. Parse Excel file (this will be handled by ExcelParser in features)
      const parseResult = await this.parseExcelFile(request.file, request.columnMapping)
      
      if (!parseResult.success) {
        return {
          success: false,
          errors: parseResult.errors,
          warnings: parseResult.warnings
        }
      }

      // 6. Validate parsed data
      const validationResult = this.validateParsedData(parseResult.data!)
      if (!validationResult.isValid) {
        return {
          success: false,
          errors: validationResult.errors,
          warnings: validationResult.warnings
        }
      }

      // 7. Create preview data
      const previewData = this.createPreviewData(parseResult.data!)

      return {
        success: true,
        result: {
          id: this.generateId(),
          previewData
        },
        warnings: validationResult.warnings
      }

    } catch (error) {
      return {
        success: false,
        errors: [`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`]
      }
    }
  }

  private validateFile(file: File): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      errors.push('File size must be less than 10MB')
    }
    
    // Check file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ]
    
    if (!allowedTypes.includes(file.type)) {
      errors.push('Only Excel (.xlsx, .xls) and CSV files are allowed')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  private async parseExcelFile(file: File, columnMapping?: Record<string, string>): Promise<{
    success: boolean
    data?: any
    errors: string[]
    warnings: string[]
  }> {
    // This is a placeholder - actual implementation will use ExcelParser from features
    // For now, we'll simulate the parsing process
    
    try {
      // Simulate Excel parsing delay
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Return simulated parsed data structure
      return {
        success: true,
        data: {
          students: [], // Will contain parsed student data
          subjects: [], // Will contain subject names
          metadata: {
            totalRows: 0,
            validRows: 0,
            invalidRows: 0
          }
        },
        errors: [],
        warnings: []
      }
    } catch (error) {
      return {
        success: false,
        errors: [`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`],
        warnings: []
      }
    }
  }

  private validateParsedData(data: any): {
    isValid: boolean
    errors: string[]
    warnings: string[]
  } {
    const errors: string[] = []
    const warnings: string[] = []
    
    // Validate minimum requirements
    if (!data.students || data.students.length === 0) {
      errors.push('No valid student data found')
    }
    
    if (!data.subjects || data.subjects.length === 0) {
      errors.push('No subjects found in the file')
    }
    
    // Check for minimum number of students
    if (data.students && data.students.length < 1) {
      errors.push('At least 1 student record is required')
    }
    
    // Check for duplicate roll numbers
    if (data.students) {
      const rollNumbers = data.students.map((s: any) => s.rollNumber)
      const duplicates = rollNumbers.filter((item: any, index: number) => rollNumbers.indexOf(item) !== index)
      
      if (duplicates.length > 0) {
        errors.push(`Duplicate roll numbers found: ${duplicates.join(', ')}`)
      }
    }
    
    // Add warnings for common issues
    if (data.metadata && data.metadata.invalidRows > 0) {
      warnings.push(`${data.metadata.invalidRows} rows were skipped due to invalid data`)
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  private createPreviewData(data: any) {
    const students = data.students || []
    const subjects = data.subjects || []
    
    // Create sample of first 5 students for preview
    const sampleStudents = students.slice(0, 5).map((student: any) => ({
      name: student.name,
      rollNumber: student.rollNumber,
      marks: student.marks || {}
    }))
    
    return {
      studentCount: students.length,
      subjectCount: subjects.length,
      subjects: subjects,
      sampleStudents
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }
}
