/**
 * Excel Parser
 * Handles parsing of Excel (.xlsx/.xls) and CSV files using SheetJS
 */

import * as XLSX from 'xlsx'

export interface ExcelRow {
  [key: string]: any
}

export interface ParsedExcelData {
  headers: string[]
  rows: ExcelRow[]
  metadata: {
    fileName: string
    sheetName: string
    totalRows: number
    totalColumns: number
    fileType: string
    lastModified?: Date
  }
  warnings: string[]
}

export interface ParseOptions {
  sheetIndex?: number
  sheetName?: string
  skipEmptyRows?: boolean
  skipEmptyColumns?: boolean
  headerRow?: number
  maxRows?: number
  dateFormat?: string
}

export class ExcelParser {
  /**
   * Parse Excel or CSV file from File object
   */
  static async parseFile(file: File, options: ParseOptions = {}): Promise<{
    success: boolean
    data?: ParsedExcelData
    error?: string
  }> {
    try {
      // Validate file
      const validation = this.validateFile(file)
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        }
      }

      // Read file as array buffer
      const arrayBuffer = await file.arrayBuffer()
      
      // Parse with SheetJS
      const workbook = XLSX.read(arrayBuffer, {
        type: 'array',
        cellDates: true,
        cellNF: false,
        cellText: false
      })

      return this.parseWorkbook(workbook, file.name, file.type, options)

    } catch (error) {
      return {
        success: false,
        error: `Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Parse Excel or CSV file from buffer
   */
  static parseBuffer(
    buffer: Buffer, 
    fileName: string, 
    mimeType: string, 
    options: ParseOptions = {}
  ): {
    success: boolean
    data?: ParsedExcelData
    error?: string
  } {
    try {
      // Parse with SheetJS
      const workbook = XLSX.read(buffer, {
        type: 'buffer',
        cellDates: true,
        cellNF: false,
        cellText: false
      })

      return this.parseWorkbook(workbook, fileName, mimeType, options)

    } catch (error) {
      return {
        success: false,
        error: `Failed to parse buffer: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Parse workbook object
   */
  private static parseWorkbook(
    workbook: XLSX.WorkBook, 
    fileName: string, 
    fileType: string, 
    options: ParseOptions
  ): {
    success: boolean
    data?: ParsedExcelData
    error?: string
  } {
    try {
      const warnings: string[] = []

      // Determine which sheet to parse
      let sheetName: string
      
      if (options.sheetName) {
        // Use specified sheet name
        if (!workbook.Sheets[options.sheetName]) {
          return {
            success: false,
            error: `Sheet '${options.sheetName}' not found`
          }
        }
        sheetName = options.sheetName
      } else if (options.sheetIndex !== undefined) {
        // Use specified sheet index
        const sheetNames = workbook.SheetNames
        if (options.sheetIndex >= sheetNames.length) {
          return {
            success: false,
            error: `Sheet index ${options.sheetIndex} is out of range`
          }
        }
        sheetName = sheetNames[options.sheetIndex]
      } else {
        // Use first sheet
        sheetName = workbook.SheetNames[0]
      }

      const worksheet = workbook.Sheets[sheetName]

      // Get worksheet range
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
      const totalRows = range.e.r + 1
      const totalColumns = range.e.c + 1

      // Warn if multiple sheets available but only parsing one
      if (workbook.SheetNames.length > 1) {
        warnings.push(`File contains ${workbook.SheetNames.length} sheets. Only parsing '${sheetName}'.`)
      }

      // Convert to JSON with headers
      const headerRow = options.headerRow || 0
      const rawData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1, // Return array of arrays
        range: headerRow,
        defval: '', // Default value for empty cells
        blankrows: !options.skipEmptyRows
      }) as any[][]

      if (rawData.length === 0) {
        return {
          success: false,
          error: 'No data found in the sheet'
        }
      }

      // Extract headers
      const headers = rawData[0]?.map((header, index) => {
        const headerStr = String(header || '').trim()
        return headerStr || `Column_${index + 1}`
      }) || []

      if (headers.length === 0) {
        return {
          success: false,
          error: 'No headers found in the sheet'
        }
      }

      // Extract data rows
      const dataRows = rawData.slice(1)
      const maxRows = options.maxRows || dataRows.length
      const limitedRows = dataRows.slice(0, maxRows)

      if (maxRows < dataRows.length) {
        warnings.push(`Limited to first ${maxRows} rows. ${dataRows.length - maxRows} rows skipped.`)
      }

      // Convert rows to objects
      const rows: ExcelRow[] = limitedRows
        .map((row, index) => {
          const rowObj: ExcelRow = {}
          
          headers.forEach((header, colIndex) => {
            const cellValue = row[colIndex]
            rowObj[header] = this.processCellValue(cellValue)
          })

          // Add row metadata
          rowObj.__rowIndex = index + headerRow + 1 // 1-based row number
          
          return rowObj
        })
        .filter(row => {
          // Skip empty rows if requested
          if (options.skipEmptyRows) {
            const nonEmptyValues = Object.values(row)
              .filter(val => val !== '' && val !== null && val !== undefined)
            return nonEmptyValues.length > 1 // More than just __rowIndex
          }
          return true
        })

      // Remove empty columns if requested
      let finalHeaders = headers
      if (options.skipEmptyColumns) {
        const nonEmptyColumns = headers.filter(header => {
          return rows.some(row => {
            const value = row[header]
            return value !== '' && value !== null && value !== undefined
          })
        })
        
        if (nonEmptyColumns.length !== headers.length) {
          warnings.push(`Removed ${headers.length - nonEmptyColumns.length} empty columns.`)
          finalHeaders = nonEmptyColumns
          
          // Update rows to only include non-empty columns
          rows.forEach(row => {
            Object.keys(row).forEach(key => {
              if (!nonEmptyColumns.includes(key) && key !== '__rowIndex') {
                delete row[key]
              }
            })
          })
        }
      }

      const parsedData: ParsedExcelData = {
        headers: finalHeaders,
        rows,
        metadata: {
          fileName,
          sheetName,
          totalRows,
          totalColumns,
          fileType,
        },
        warnings
      }

      return {
        success: true,
        data: parsedData
      }

    } catch (error) {
      return {
        success: false,
        error: `Failed to parse workbook: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Process individual cell values
   */
  private static processCellValue(value: any): any {
    if (value === null || value === undefined) {
      return ''
    }

    // Handle dates
    if (value instanceof Date) {
      return value.toISOString().split('T')[0] // Return YYYY-MM-DD format
    }

    // Handle numbers
    if (typeof value === 'number') {
      // Check if it's a date serial number
      if (this.isDateSerial(value)) {
        const date = XLSX.SSF.parse_date_code(value)
        if (date) {
          return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`
        }
      }
      return value
    }

    // Handle strings
    if (typeof value === 'string') {
      return value.trim()
    }

    // Convert to string for other types
    return String(value)
  }

  /**
   * Check if number might be a date serial
   */
  private static isDateSerial(num: number): boolean {
    // Excel date serials are typically between 1 (1900-01-01) and 2958465 (9999-12-31)
    return num > 0 && num < 3000000 && num % 1 !== 0
  }

  /**
   * Validate file before parsing
   */
  private static validateFile(file: File): { isValid: boolean; error?: string } {
    // Check file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      return {
        isValid: false,
        error: 'File size exceeds 50MB limit'
      }
    }

    // Check file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls  
      'text/csv', // .csv
      'application/csv'
    ]

    if (!allowedTypes.includes(file.type)) {
      // Also check file extension as fallback
      const extension = file.name.toLowerCase().split('.').pop()
      const allowedExtensions = ['xlsx', 'xls', 'csv']
      
      if (!extension || !allowedExtensions.includes(extension)) {
        return {
          isValid: false,
          error: 'Only Excel (.xlsx, .xls) and CSV files are allowed'
        }
      }
    }

    return { isValid: true }
  }

  /**
   * Get available sheet names from file
   */
  static async getSheetNames(file: File): Promise<{
    success: boolean
    sheets?: string[]
    error?: string
  }> {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })
      
      return {
        success: true,
        sheets: workbook.SheetNames
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to read sheet names: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Preview first few rows without full parsing
   */
  static async previewFile(file: File, maxRows: number = 5): Promise<{
    success: boolean
    preview?: {
      headers: string[]
      rows: ExcelRow[]
      totalRows: number
    }
    error?: string
  }> {
    const result = await this.parseFile(file, {
      maxRows,
      skipEmptyRows: true
    })

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error
      }
    }

    return {
      success: true,
      preview: {
        headers: result.data.headers,
        rows: result.data.rows,
        totalRows: result.data.metadata.totalRows
      }
    }
  }
}
