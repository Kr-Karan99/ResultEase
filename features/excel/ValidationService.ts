/**
 * Validation Service
 * Handles validation of Excel data structure and content
 */

import { ExcelRow, ParsedExcelData } from './ExcelParser'
import { ColumnMapping } from './ColumnMapper'

export interface ValidationRule {
  name: string
  field: string
  validator: (value: any, row: any, allRows: any[]) => ValidationResult
  severity: 'error' | 'warning'
  description: string
}

export interface ValidationResult {
  isValid: boolean
  message?: string
}

export interface RowValidationResult {
  rowIndex: number
  isValid: boolean
  errors: Array<{
    field: string
    rule: string
    message: string
  }>
  warnings: Array<{
    field: string
    rule: string
    message: string
  }>
}

export interface DataValidationResult {
  isValid: boolean
  summary: {
    totalRows: number
    validRows: number
    invalidRows: number
    warningRows: number
  }
  rowResults: RowValidationResult[]
  globalErrors: string[]
  globalWarnings: string[]
  duplicateAnalysis: {
    duplicateRollNumbers: Array<{
      rollNumber: string
      rowIndexes: number[]
    }>
    duplicateNames: Array<{
      name: string
      rowIndexes: number[]
    }>
  }
  dataQualityAnalysis: {
    completenessScore: number // 0-100
    consistencyScore: number // 0-100
    accuracyScore: number // 0-100
    overallScore: number // 0-100
    insights: string[]
  }
}

export class ValidationService {
  private static readonly DEFAULT_RULES: ValidationRule[] = [
    // Required field validations
    {
      name: 'required_student_name',
      field: 'studentName',
      validator: (value) => ({
        isValid: Boolean(value && String(value).trim().length > 0),
        message: 'Student name is required'
      }),
      severity: 'error',
      description: 'Student name must not be empty'
    },
    {
      name: 'required_roll_number',
      field: 'rollNumber',
      validator: (value) => ({
        isValid: Boolean(value && String(value).trim().length > 0),
        message: 'Roll number is required'
      }),
      severity: 'error',
      description: 'Roll number must not be empty'
    },

    // Format validations
    {
      name: 'name_format',
      field: 'studentName',
      validator: (value) => {
        if (!value) return { isValid: true }
        const name = String(value).trim()
        const hasValidChars = /^[a-zA-Z\s\.''-]+$/.test(name)
        const hasMinLength = name.length >= 2
        const hasMaxLength = name.length <= 100
        
        if (!hasValidChars) {
          return { isValid: false, message: 'Name contains invalid characters' }
        }
        if (!hasMinLength) {
          return { isValid: false, message: 'Name must be at least 2 characters long' }
        }
        if (!hasMaxLength) {
          return { isValid: false, message: 'Name cannot exceed 100 characters' }
        }
        
        return { isValid: true }
      },
      severity: 'error',
      description: 'Student name format validation'
    },
    {
      name: 'roll_number_format',
      field: 'rollNumber',
      validator: (value) => {
        if (!value) return { isValid: true }
        const rollNo = String(value).trim()
        const hasValidLength = rollNo.length >= 1 && rollNo.length <= 20
        
        if (!hasValidLength) {
          return { isValid: false, message: 'Roll number must be between 1-20 characters' }
        }
        
        return { isValid: true }
      },
      severity: 'error',
      description: 'Roll number format validation'
    },

    // Marks validations
    {
      name: 'marks_range',
      field: 'marks',
      validator: (value, row) => {
        if (!row.marks || typeof row.marks !== 'object') {
          return { isValid: false, message: 'No marks data found' }
        }
        
        const invalidMarks: string[] = []
        
        Object.entries(row.marks).forEach(([subject, marks]) => {
          const numMarks = Number(marks)
          if (isNaN(numMarks) || numMarks < 0 || numMarks > 100) {
            invalidMarks.push(`${subject}: ${marks}`)
          }
        })
        
        if (invalidMarks.length > 0) {
          return {
            isValid: false,
            message: `Invalid marks (must be 0-100): ${invalidMarks.join(', ')}`
          }
        }
        
        return { isValid: true }
      },
      severity: 'error',
      description: 'Marks must be between 0 and 100'
    },

    // Data consistency warnings
    {
      name: 'marks_consistency',
      field: 'marks',
      validator: (value, row) => {
        if (!row.marks || typeof row.marks !== 'object') return { isValid: true }
        
        const marksValues = Object.values(row.marks) as number[]
        const validMarks = marksValues.filter(m => !isNaN(Number(m)) && Number(m) > 0)
        
        if (validMarks.length === 0) {
          return {
            isValid: false,
            message: 'Student has no valid marks in any subject'
          }
        }
        
        // Check for suspiciously high or low performance
        const average = validMarks.reduce((sum, mark) => sum + Number(mark), 0) / validMarks.length
        
        if (average < 10) {
          return {
            isValid: true,
            message: 'Very low average marks - please verify data'
          }
        }
        
        if (average > 95) {
          return {
            isValid: true,
            message: 'Very high average marks - please verify data'
          }
        }
        
        return { isValid: true }
      },
      severity: 'warning',
      description: 'Check marks consistency and reasonableness'
    },

    // Name consistency warnings
    {
      name: 'name_consistency',
      field: 'studentName',
      validator: (value) => {
        if (!value) return { isValid: true }
        
        const name = String(value).trim()
        const words = name.split(/\s+/)
        
        // Check for very short names
        if (words.length === 1 && words[0].length < 3) {
          return {
            isValid: true,
            message: 'Very short name - please verify'
          }
        }
        
        // Check for suspicious patterns
        if (/\d/.test(name)) {
          return {
            isValid: true,
            message: 'Name contains numbers - please verify'
          }
        }
        
        // Check for all caps or all lowercase
        if (name === name.toUpperCase() && name.length > 10) {
          return {
            isValid: true,
            message: 'Name is in all caps - consider proper case'
          }
        }
        
        if (name === name.toLowerCase()) {
          return {
            isValid: true,
            message: 'Name is in all lowercase - consider proper case'
          }
        }
        
        return { isValid: true }
      },
      severity: 'warning',
      description: 'Check name formatting and consistency'
    }
  ]

  /**
   * Validate parsed Excel data
   */
  static validateData(
    data: ParsedExcelData,
    mappings: ColumnMapping[],
    customRules: ValidationRule[] = []
  ): DataValidationResult {
    const allRules = [...this.DEFAULT_RULES, ...customRules]
    const rowResults: RowValidationResult[] = []
    const globalErrors: string[] = []
    const globalWarnings: string[] = []

    // Transform data based on mappings
    const transformedRows = this.transformRowsForValidation(data.rows, mappings)

    // Validate each row
    transformedRows.forEach((row, index) => {
      const rowResult = this.validateRow(row, index, allRules, transformedRows)
      rowResults.push(rowResult)
    })

    // Global validations
    const duplicateAnalysis = this.analyzeDuplicates(transformedRows)
    
    if (duplicateAnalysis.duplicateRollNumbers.length > 0) {
      globalErrors.push(`Found duplicate roll numbers: ${duplicateAnalysis.duplicateRollNumbers.map(d => d.rollNumber).join(', ')}`)
    }

    if (duplicateAnalysis.duplicateNames.length > 0) {
      globalWarnings.push(`Found duplicate names: ${duplicateAnalysis.duplicateNames.map(d => d.name).join(', ')}`)
    }

    // Data quality analysis
    const dataQualityAnalysis = this.analyzeDataQuality(transformedRows, rowResults)

    // Summary
    const validRows = rowResults.filter(r => r.isValid).length
    const invalidRows = rowResults.filter(r => !r.isValid).length
    const warningRows = rowResults.filter(r => r.warnings.length > 0).length

    const summary = {
      totalRows: transformedRows.length,
      validRows,
      invalidRows,
      warningRows
    }

    return {
      isValid: globalErrors.length === 0 && invalidRows === 0,
      summary,
      rowResults,
      globalErrors,
      globalWarnings,
      duplicateAnalysis,
      dataQualityAnalysis
    }
  }

  /**
   * Validate Excel structure before data parsing
   */
  static validateStructure(data: ParsedExcelData): {
    isValid: boolean
    errors: string[]
    warnings: string[]
    recommendations: string[]
  } {
    const errors: string[] = []
    const warnings: string[] = []
    const recommendations: string[] = []

    // Check minimum requirements
    if (data.headers.length === 0) {
      errors.push('No headers found in the file')
    }

    if (data.rows.length === 0) {
      errors.push('No data rows found in the file')
    }

    // Check for reasonable number of columns
    if (data.headers.length < 3) {
      warnings.push('Very few columns detected - ensure file contains student name, roll number, and at least one subject')
    }

    if (data.headers.length > 50) {
      warnings.push('Large number of columns detected - this may slow down processing')
    }

    // Check for reasonable number of rows
    if (data.rows.length > 1000) {
      warnings.push('Large dataset detected - processing may take longer')
    }

    // Check for empty headers
    const emptyHeaders = data.headers.filter(h => !h || h.trim().length === 0)
    if (emptyHeaders.length > 0) {
      warnings.push(`${emptyHeaders.length} empty column headers found`)
      recommendations.push('Consider removing empty columns or providing proper headers')
    }

    // Check for duplicate headers
    const headerCounts = data.headers.reduce((acc, header) => {
      acc[header] = (acc[header] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const duplicateHeaders = Object.entries(headerCounts)
      .filter(([_, count]) => count > 1)
      .map(([header]) => header)

    if (duplicateHeaders.length > 0) {
      errors.push(`Duplicate column headers found: ${duplicateHeaders.join(', ')}`)
      recommendations.push('Ensure all column headers are unique')
    }

    // Check data consistency across rows
    const inconsistentRows = this.findInconsistentRows(data.rows, data.headers)
    if (inconsistentRows.length > 0) {
      warnings.push(`${inconsistentRows.length} rows have inconsistent data structure`)
    }

    // Recommendations based on analysis
    if (data.rows.length < 5) {
      recommendations.push('Consider adding more sample data for better analysis')
    }

    if (!this.hasLikelyStudentNameColumn(data.headers)) {
      recommendations.push('Ensure file contains a student name column')
    }

    if (!this.hasLikelyRollNumberColumn(data.headers)) {
      recommendations.push('Ensure file contains a roll number column')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      recommendations
    }
  }

  // Helper methods
  private static transformRowsForValidation(rows: ExcelRow[], mappings: ColumnMapping[]): any[] {
    return rows.map(row => {
      const transformed: any = { marks: {} }
      
      mappings.forEach(mapping => {
        const value = row[mapping.excelColumn]
        
        if (mapping.dataField.startsWith('subject_')) {
          const subjectName = mapping.dataField.replace('subject_', '')
          transformed.marks[subjectName] = value
        } else {
          transformed[mapping.dataField] = value
        }
      })
      
      return transformed
    })
  }

  private static validateRow(
    row: any,
    rowIndex: number,
    rules: ValidationRule[],
    allRows: any[]
  ): RowValidationResult {
    const errors: RowValidationResult['errors'] = []
    const warnings: RowValidationResult['warnings'] = []

    rules.forEach(rule => {
      try {
        const result = rule.validator(row[rule.field], row, allRows)
        
        if (!result.isValid && result.message) {
          if (rule.severity === 'error') {
            errors.push({
              field: rule.field,
              rule: rule.name,
              message: result.message
            })
          } else {
            warnings.push({
              field: rule.field,
              rule: rule.name,
              message: result.message
            })
          }
        }
      } catch (error) {
        errors.push({
          field: rule.field,
          rule: rule.name,
          message: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
        })
      }
    })

    return {
      rowIndex,
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  private static analyzeDuplicates(rows: any[]) {
    const rollNumberMap: Record<string, number[]> = {}
    const nameMap: Record<string, number[]> = {}

    rows.forEach((row, index) => {
      // Track roll numbers
      if (row.rollNumber) {
        const rollNo = String(row.rollNumber).trim().toLowerCase()
        if (!rollNumberMap[rollNo]) rollNumberMap[rollNo] = []
        rollNumberMap[rollNo].push(index)
      }

      // Track names  
      if (row.studentName) {
        const name = String(row.studentName).trim().toLowerCase()
        if (!nameMap[name]) nameMap[name] = []
        nameMap[name].push(index)
      }
    })

    const duplicateRollNumbers = Object.entries(rollNumberMap)
      .filter(([_, indexes]) => indexes.length > 1)
      .map(([rollNumber, rowIndexes]) => ({ rollNumber, rowIndexes }))

    const duplicateNames = Object.entries(nameMap)
      .filter(([_, indexes]) => indexes.length > 1)
      .map(([name, rowIndexes]) => ({ name, rowIndexes }))

    return {
      duplicateRollNumbers,
      duplicateNames
    }
  }

  private static analyzeDataQuality(rows: any[], validationResults: RowValidationResult[]) {
    const insights: string[] = []

    // Completeness score
    const totalFields = rows.length * 3 // studentName, rollNumber, marks
    const completedFields = rows.reduce((count, row) => {
      let fieldCount = 0
      if (row.studentName) fieldCount++
      if (row.rollNumber) fieldCount++
      if (row.marks && Object.keys(row.marks).length > 0) fieldCount++
      return count + fieldCount
    }, 0)
    const completenessScore = Math.round((completedFields / totalFields) * 100)

    // Consistency score (based on validation results)
    const consistentRows = validationResults.filter(r => r.warnings.length === 0).length
    const consistencyScore = Math.round((consistentRows / rows.length) * 100)

    // Accuracy score (based on validation errors)
    const accurateRows = validationResults.filter(r => r.errors.length === 0).length
    const accuracyScore = Math.round((accurateRows / rows.length) * 100)

    // Overall score
    const overallScore = Math.round((completenessScore + consistencyScore + accuracyScore) / 3)

    // Generate insights
    if (completenessScore < 80) {
      insights.push('Data has missing values in required fields')
    }

    if (consistencyScore < 80) {
      insights.push('Data formatting is inconsistent across rows')
    }

    if (accuracyScore < 90) {
      insights.push('Data contains validation errors that need attention')
    }

    if (overallScore >= 90) {
      insights.push('Data quality is excellent')
    } else if (overallScore >= 70) {
      insights.push('Data quality is good with minor issues')
    } else {
      insights.push('Data quality needs significant improvement')
    }

    return {
      completenessScore,
      consistencyScore,
      accuracyScore,
      overallScore,
      insights
    }
  }

  private static findInconsistentRows(rows: ExcelRow[], headers: string[]): number[] {
    const inconsistentRows: number[] = []

    rows.forEach((row, index) => {
      const rowKeys = Object.keys(row).filter(key => key !== '__rowIndex')
      const missingColumns = headers.filter(header => !(header in row))
      
      if (missingColumns.length > headers.length * 0.5) {
        inconsistentRows.push(index)
      }
    })

    return inconsistentRows
  }

  private static hasLikelyStudentNameColumn(headers: string[]): boolean {
    const namePatterns = [/name/i, /student/i, /full.*name/i]
    return headers.some(header => 
      namePatterns.some(pattern => pattern.test(header))
    )
  }

  private static hasLikelyRollNumberColumn(headers: string[]): boolean {
    const rollPatterns = [/roll/i, /id/i, /number/i, /no/i]
    return headers.some(header => 
      rollPatterns.some(pattern => pattern.test(header))
    )
  }
}
