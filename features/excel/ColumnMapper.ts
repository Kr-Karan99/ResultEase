/**
 * Column Mapper
 * Handles dynamic mapping between Excel columns and expected data fields
 */

import { ExcelRow } from './ExcelParser'

export interface ColumnMapping {
  excelColumn: string // Column name from Excel file
  dataField: string   // Expected data field (studentName, rollNumber, subject name, etc.)
  isRequired: boolean
  dataType: 'string' | 'number' | 'date'
  transformer?: (value: any) => any
}

export interface MappingTemplate {
  name: string
  description: string
  mappings: ColumnMapping[]
  requiredFields: string[]
  subjectColumns: string[] // Columns that represent subjects
}

export interface AutoMappingResult {
  mappings: ColumnMapping[]
  confidence: number // 0-1 score indicating confidence in auto-mapping
  suggestions: {
    excelColumn: string
    suggestedField: string
    confidence: number
    reason: string
  }[]
  unmappedColumns: string[]
  missingRequiredFields: string[]
}

export interface MappingValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  stats: {
    totalColumns: number
    mappedColumns: number
    requiredFieldsMapped: number
    subjectColumnCount: number
  }
}

export class ColumnMapper {
  private static readonly REQUIRED_FIELDS = [
    'studentName',
    'rollNumber'
  ]

  private static readonly OPTIONAL_FIELDS = [
    'class',
    'section',
    'fatherName',
    'motherName',
    'dateOfBirth',
    'totalMarks',
    'percentage',
    'grade',
    'rank'
  ]

  private static readonly FIELD_PATTERNS: Record<string, RegExp[]> = {
    studentName: [
      /^(student.*name|name.*student|student|name)$/i,
      /^(full.*name|complete.*name)$/i,
      /^(first.*name|last.*name)$/i
    ],
    rollNumber: [
      /^(roll.*num|roll.*no|roll|admission.*no|id|student.*id)$/i,
      /^(reg.*no|registration|reg.*num)$/i,
      /^(index.*no|index)$/i
    ],
    class: [
      /^(class|standard|std|grade|level)$/i,
      /^(class.*name|class.*num)$/i
    ],
    section: [
      /^(section|sec|division|div)$/i,
      /^(class.*section|sec.*name)$/i
    ],
    totalMarks: [
      /^(total.*mark|total.*score|total|grand.*total)$/i,
      /^(sum.*mark|aggregate|overall)$/i
    ],
    percentage: [
      /^(percent|percentage|%|per)$/i,
      /^(percent.*mark|mark.*percent)$/i
    ],
    grade: [
      /^(grade|letter.*grade|final.*grade)$/i,
      /^(class.*grade|overall.*grade)$/i
    ],
    rank: [
      /^(rank|position|pos|standing)$/i,
      /^(class.*rank|overall.*rank)$/i
    ]
  }

  /**
   * Auto-map Excel columns to data fields
   */
  static autoMapColumns(headers: string[], sampleRows: ExcelRow[] = []): AutoMappingResult {
    const mappings: ColumnMapping[] = []
    const suggestions: AutoMappingResult['suggestions'] = []
    const unmappedColumns: string[] = []

    // Track which fields have been mapped
    const mappedFields = new Set<string>()

    // First, try to map required and optional fields
    headers.forEach(header => {
      const normalizedHeader = header.trim().toLowerCase()
      let bestMatch: { field: string; confidence: number } | null = null

      // Check against all known field patterns
      for (const [fieldName, patterns] of Object.entries(this.FIELD_PATTERNS)) {
        if (mappedFields.has(fieldName)) continue

        for (const pattern of patterns) {
          if (pattern.test(normalizedHeader)) {
            const confidence = this.calculatePatternConfidence(normalizedHeader, pattern)
            
            if (!bestMatch || confidence > bestMatch.confidence) {
              bestMatch = { field: fieldName, confidence }
            }
          }
        }
      }

      if (bestMatch && bestMatch.confidence > 0.6) {
        // High confidence mapping
        mappings.push({
          excelColumn: header,
          dataField: bestMatch.field,
          isRequired: this.REQUIRED_FIELDS.includes(bestMatch.field),
          dataType: this.getFieldDataType(bestMatch.field),
          transformer: this.getFieldTransformer(bestMatch.field)
        })
        mappedFields.add(bestMatch.field)
      } else if (bestMatch && bestMatch.confidence > 0.3) {
        // Low confidence - add as suggestion
        suggestions.push({
          excelColumn: header,
          suggestedField: bestMatch.field,
          confidence: bestMatch.confidence,
          reason: `Column name similarity to ${bestMatch.field}`
        })
        unmappedColumns.push(header)
      } else {
        // Check if it might be a subject column
        if (this.looksLikeSubjectColumn(header, sampleRows)) {
          mappings.push({
            excelColumn: header,
            dataField: `subject_${this.normalizeSubjectName(header)}`,
            isRequired: false,
            dataType: 'number',
            transformer: this.getMarksTransformer()
          })
        } else {
          unmappedColumns.push(header)
        }
      }
    })

    // Check for missing required fields
    const missingRequiredFields = this.REQUIRED_FIELDS.filter(field => !mappedFields.has(field))

    // Try to suggest unmapped columns for missing required fields
    missingRequiredFields.forEach(missingField => {
      const unmappedSuggestions = unmappedColumns
        .map(column => ({
          column,
          similarity: this.calculateStringSimilarity(column.toLowerCase(), missingField)
        }))
        .filter(item => item.similarity > 0.3)
        .sort((a, b) => b.similarity - a.similarity)

      if (unmappedSuggestions.length > 0) {
        suggestions.push({
          excelColumn: unmappedSuggestions[0].column,
          suggestedField: missingField,
          confidence: unmappedSuggestions[0].similarity,
          reason: `Suggested for missing required field: ${missingField}`
        })
      }
    })

    // Calculate overall confidence
    const requiredMappedCount = mappings.filter(m => m.isRequired).length
    const confidence = requiredMappedCount / this.REQUIRED_FIELDS.length

    return {
      mappings,
      confidence,
      suggestions,
      unmappedColumns,
      missingRequiredFields
    }
  }

  /**
   * Validate column mappings
   */
  static validateMappings(mappings: ColumnMapping[], headers: string[]): MappingValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Check that all mapped columns exist in headers
    mappings.forEach(mapping => {
      if (!headers.includes(mapping.excelColumn)) {
        errors.push(`Mapped column '${mapping.excelColumn}' not found in Excel headers`)
      }
    })

    // Check for required fields
    const mappedFields = mappings.map(m => m.dataField)
    const missingRequired = this.REQUIRED_FIELDS.filter(field => !mappedFields.includes(field))
    
    if (missingRequired.length > 0) {
      errors.push(`Missing required fields: ${missingRequired.join(', ')}`)
    }

    // Check for duplicate mappings
    const fieldCounts = mappedFields.reduce((acc, field) => {
      acc[field] = (acc[field] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    Object.entries(fieldCounts).forEach(([field, count]) => {
      if (count > 1) {
        errors.push(`Field '${field}' is mapped multiple times`)
      }
    })

    // Check for subject columns
    const subjectColumns = mappings.filter(m => m.dataField.startsWith('subject_'))
    if (subjectColumns.length === 0) {
      warnings.push('No subject columns mapped - ensure at least one subject is included')
    }

    // Warn about unmapped columns that might be important
    const unmappedHeaders = headers.filter(header => 
      !mappings.some(m => m.excelColumn === header)
    )
    
    if (unmappedHeaders.length > 0) {
      warnings.push(`Unmapped columns: ${unmappedHeaders.join(', ')}`)
    }

    const stats = {
      totalColumns: headers.length,
      mappedColumns: mappings.length,
      requiredFieldsMapped: mappings.filter(m => m.isRequired).length,
      subjectColumnCount: subjectColumns.length
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      stats
    }
  }

  /**
   * Apply mappings to transform Excel rows to structured data
   */
  static applyMappings(
    rows: ExcelRow[], 
    mappings: ColumnMapping[]
  ): {
    success: boolean
    transformedData?: Array<{
      studentName: string
      rollNumber: string
      class?: string
      section?: string
      marks: Record<string, number>
      totalMarks?: number
      percentage?: number
      grade?: string
      rank?: number
      __originalRow: ExcelRow
    }>
    errors: string[]
    warnings: string[]
  } {
    const transformedData: any[] = []
    const errors: string[] = []
    const warnings: string[] = []

    rows.forEach((row, index) => {
      try {
        const transformedRow: any = {
          marks: {},
          __originalRow: row
        }

        let hasValidData = false

        mappings.forEach(mapping => {
          const rawValue = row[mapping.excelColumn]
          
          try {
            // Apply transformer if available
            const processedValue = mapping.transformer 
              ? mapping.transformer(rawValue)
              : rawValue

            // Handle subject columns
            if (mapping.dataField.startsWith('subject_')) {
              const subjectName = mapping.dataField.replace('subject_', '')
              transformedRow.marks[subjectName] = processedValue || 0
              hasValidData = true
            } else {
              // Handle other fields
              transformedRow[mapping.dataField] = processedValue
              
              if (mapping.isRequired && processedValue) {
                hasValidData = true
              }
            }
          } catch (error) {
            warnings.push(`Row ${index + 1}: Failed to transform '${mapping.excelColumn}': ${error}`)
          }
        })

        // Skip rows without required data
        if (!hasValidData) {
          warnings.push(`Row ${index + 1}: Skipped due to missing required data`)
          return
        }

        // Validate required fields
        const missingRequired = this.REQUIRED_FIELDS.filter(field => 
          !transformedRow[field] || transformedRow[field] === ''
        )

        if (missingRequired.length > 0) {
          warnings.push(`Row ${index + 1}: Missing required fields: ${missingRequired.join(', ')}`)
          return
        }

        transformedData.push(transformedRow)

      } catch (error) {
        errors.push(`Row ${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    })

    return {
      success: errors.length === 0,
      transformedData,
      errors,
      warnings
    }
  }

  /**
   * Create mapping template from successful mapping
   */
  static createTemplate(
    name: string, 
    description: string, 
    mappings: ColumnMapping[]
  ): MappingTemplate {
    const subjectColumns = mappings
      .filter(m => m.dataField.startsWith('subject_'))
      .map(m => m.excelColumn)

    return {
      name,
      description,
      mappings,
      requiredFields: this.REQUIRED_FIELDS,
      subjectColumns
    }
  }

  /**
   * Get predefined mapping templates
   */
  static getDefaultTemplates(): MappingTemplate[] {
    return [
      {
        name: 'Standard School Report',
        description: 'Common format: Name, Roll No, subjects as columns',
        mappings: [
          {
            excelColumn: 'Name',
            dataField: 'studentName',
            isRequired: true,
            dataType: 'string',
            transformer: (v) => String(v || '').trim()
          },
          {
            excelColumn: 'Roll No',
            dataField: 'rollNumber',
            isRequired: true,
            dataType: 'string',
            transformer: (v) => String(v || '').trim()
          },
          {
            excelColumn: 'Class',
            dataField: 'class',
            isRequired: false,
            dataType: 'string',
            transformer: (v) => String(v || '').trim()
          }
        ],
        requiredFields: this.REQUIRED_FIELDS,
        subjectColumns: []
      }
    ]
  }

  // Helper methods
  private static calculatePatternConfidence(text: string, pattern: RegExp): number {
    // Simple pattern matching confidence
    return pattern.test(text) ? 0.8 : 0
  }

  private static calculateStringSimilarity(str1: string, str2: string): number {
    // Simple similarity based on common characters and length
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1
    
    if (longer.length === 0) return 1.0
    
    const distance = this.levenshteinDistance(longer, shorter)
    return (longer.length - distance) / longer.length
  }

  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = []
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }
    
    return matrix[str2.length][str1.length]
  }

  private static looksLikeSubjectColumn(header: string, sampleRows: ExcelRow[]): boolean {
    // Check if column contains mostly numeric values (likely marks)
    const values = sampleRows.map(row => row[header]).filter(v => v !== null && v !== undefined && v !== '')
    
    if (values.length === 0) return false
    
    const numericValues = values.filter(v => !isNaN(parseFloat(String(v))))
    const numericRatio = numericValues.length / values.length
    
    // If >70% of values are numeric and header doesn't match standard fields, likely a subject
    return numericRatio > 0.7 && !this.matchesStandardField(header)
  }

  private static matchesStandardField(header: string): boolean {
    const normalizedHeader = header.toLowerCase()
    const allFields = [...this.REQUIRED_FIELDS, ...this.OPTIONAL_FIELDS]
    
    return allFields.some(field => 
      this.FIELD_PATTERNS[field]?.some(pattern => pattern.test(normalizedHeader))
    )
  }

  private static normalizeSubjectName(name: string): string {
    return name.trim()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .toLowerCase()
  }

  private static getFieldDataType(fieldName: string): 'string' | 'number' | 'date' {
    const numberFields = ['totalMarks', 'percentage', 'rank']
    const dateFields = ['dateOfBirth']
    
    if (numberFields.includes(fieldName)) return 'number'
    if (dateFields.includes(fieldName)) return 'date'
    return 'string'
  }

  private static getFieldTransformer(fieldName: string): ((value: any) => any) | undefined {
    switch (fieldName) {
      case 'studentName':
      case 'class':
      case 'section':
        return (v) => String(v || '').trim()
      
      case 'rollNumber':
        return (v) => String(v || '').trim()
      
      case 'totalMarks':
      case 'percentage':
      case 'rank':
        return (v) => {
          const num = parseFloat(String(v || '0'))
          return isNaN(num) ? 0 : num
        }
      
      default:
        return undefined
    }
  }

  private static getMarksTransformer(): (value: any) => number {
    return (value: any) => {
      if (value === null || value === undefined || value === '') return 0
      
      const str = String(value).toLowerCase().trim()
      
      // Handle special cases
      if (str === 'absent' || str === 'ab' || str === 'a') return 0
      if (str === 'pass' || str === 'p') return 40
      if (str === 'fail' || str === 'f') return 0
      
      const num = parseFloat(str)
      return isNaN(num) ? 0 : Math.max(0, Math.min(100, num)) // Clamp between 0-100
    }
  }
}
