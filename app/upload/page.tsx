'use client'

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute'
import { ExcelParser, ParsedExcelData } from '@/features/excel/ExcelParser'
import { AnalyzeResultUseCase } from '@/application/use-cases/AnalyzeResultUseCase'
import { useAuth } from '@/context/AuthContext'

type UploadStep = 'upload' | 'preview' | 'mapping' | 'processing' | 'complete'

export default function UploadPage() {
  // Protect this route - redirects unauthenticated users
  useProtectedRoute()

  const router = useRouter()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState<UploadStep>('upload')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [title, setTitle] = useState('')
  const [previewData, setPreviewData] = useState<ParsedExcelData | null>(null)
  const [parsedData, setParsedData] = useState<ParsedExcelData | null>(null)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [warnings, setWarnings] = useState<string[]>([])
  const [detectedSubjects, setDetectedSubjects] = useState<string[]>([])
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({})

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ]

    const fileExtension = file.name.toLowerCase().split('.').pop()
    const allowedExtensions = ['xlsx', 'xls', 'csv']
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension || '')) {
      setErrors(['Only Excel (.xlsx, .xls) and CSV files are allowed'])
      return
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrors(['File size must be less than 10MB'])
      return
    }

    setSelectedFile(file)
    setTitle(file.name.replace(/\.[^/.]+$/, ''))
    setErrors([])
    setCurrentStep('preview')
    setProcessing(true)
    
    // Actually parse the file
    await parseExcelFile(file)
  }, [])

  const parseExcelFile = async (file: File) => {
    try {
      setUploadProgress(0)
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      // Parse the file using ExcelParser
      const parseResult = await ExcelParser.parseFile(file, {
        skipEmptyRows: true,
        skipEmptyColumns: false
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!parseResult.success || !parseResult.data) {
        setErrors([parseResult.error || 'Failed to parse file'])
        setProcessing(false)
        setCurrentStep('upload')
        return
      }

      const data = parseResult.data
      
      // Set warnings if any
      if (data.warnings && data.warnings.length > 0) {
        setWarnings(data.warnings)
      }

      // Detect subjects from headers (exclude name, roll number, class, section)
      const excludeColumns = ['student name', 'name', 'roll number', 'roll no', 'class', 'section', 'total', 'percentage', 'grade', 'rank']
      const subjects = data.headers.filter(header => 
        !excludeColumns.includes(header.toLowerCase().trim())
      )
      
      setDetectedSubjects(subjects)
      setParsedData(data)
      setPreviewData(data)
      setProcessing(false)

    } catch (error) {
      setErrors([`Error parsing file: ${error instanceof Error ? error.message : 'Unknown error'}`])
      setProcessing(false)
      setCurrentStep('upload')
    }
  }

  const handleProceedToMapping = () => {
    setCurrentStep('mapping')
  }

  const handleCompleteMapping = async () => {
    if (!parsedData || !user) {
      console.error('Missing required data:', { parsedData: !!parsedData, user: !!user })
      setErrors(['Missing required data. Please try uploading the file again.'])
      return
    }

    if (detectedSubjects.length === 0) {
      setErrors(['No subjects detected in the file. Please ensure your file has subject columns.'])
      return
    }

    setCurrentStep('processing')
    setErrors([]) // Clear previous errors

    try {
      console.log('Starting analysis...', { 
        rows: parsedData.rows.length, 
        subjects: detectedSubjects 
      })

      // Transform parsed data into format needed by AnalyzeResultUseCase
      const studentData = parsedData.rows.map((row, index) => {
        const marks: Record<string, number> = {}
        
        detectedSubjects.forEach(subject => {
          const value = row[subject]
          const numValue = typeof value === 'number' ? value : parseFloat(String(value))
          marks[subject] = isNaN(numValue) ? 0 : numValue
        })

        return {
          name: String(row['Student Name'] || row['Name'] || `Student ${index + 1}`),
          rollNumber: String(row['Roll Number'] || row['Roll No'] || row['Roll'] || `${index + 1}`),
          class: String(row['Class'] || ''),
          section: String(row['Section'] || ''),
          marks
        }
      })

      console.log('Transformed student data:', studentData.slice(0, 2))

      // Create analysis request
      const analysisRequest = {
        resultData: {
          id: `result-${Date.now()}`,
          title: title || 'Result Analysis',
          subjects: detectedSubjects,
          studentData
        },
        userId: user.id,
        options: {
          passingPercentage: 40,
          generateRanks: true,
          includeInsights: true
        }
      }

      console.log('Analysis request created:', {
        id: analysisRequest.resultData.id,
        studentCount: studentData.length,
        subjectCount: detectedSubjects.length
      })

      // Analyze using AnalyzeResultUseCase with Firebase auth service
      const { firebaseAuthService } = await import('@/infrastructure/firebase/FirebaseAuthService')
      const analyzeUseCase = new AnalyzeResultUseCase(firebaseAuthService)
      
      console.log('Executing analysis...')
      const result = await analyzeUseCase.execute(analysisRequest)
      console.log('Analysis result:', result)

      if (result.success && result.analysis) {
        console.log('Analysis successful!', result.analysis.summary)
        setAnalysisResult(result.analysis)
        setCurrentStep('complete')
      } else {
        console.error('Analysis failed:', result.errors)
        setErrors(result.errors || ['Analysis failed'])
        setCurrentStep('mapping')
      }

    } catch (error) {
      console.error('Analysis error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      const errorStack = error instanceof Error ? error.stack : ''
      console.error('Error stack:', errorStack)
      
      setErrors([`Analysis error: ${errorMessage}`])
      setCurrentStep('mapping')
    }
  }

  const handleCreateReport = () => {
    if (!analysisResult) return

    // Store analysis result in sessionStorage so the report page can access it
    const reportId = analysisResult.resultId || `report-${Date.now()}`
    
    const reportData = {
      id: reportId,
      title: title,
      createdAt: new Date().toISOString(),
      analysis: analysisResult,
      fileName: selectedFile?.name || 'Unknown',
      timestamp: Date.now()
    }

    sessionStorage.setItem(`report-${reportId}`, JSON.stringify(reportData))
    
    console.log('Navigating to report:', reportId)
    router.push(`/reports/${reportId}`)
  }

  const renderUploadStep = () => (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Upload Your Results File</CardTitle>
          <CardDescription>
            Upload Excel (.xlsx, .xls) or CSV files with student results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Choose a file or drag and drop
            </h3>
            <p className="text-gray-500 mb-4">
              Excel (.xlsx, .xls) or CSV files up to 10MB
            </p>
            
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <Button asChild variant="school" className="cursor-pointer">
              <label htmlFor="file-upload">
                Select File
              </label>
            </Button>
          </div>

          {errors.length > 0 && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Upload Error</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-4">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">File Format Tips:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Include student name and roll number columns</li>
              <li>• Each subject should have its own column</li>
              <li>• Use consistent headers (Name, Roll No, Math, Science, etc.)</li>
              <li>• Mark absent students as "0" or "Absent"</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderPreviewStep = () => (
    <div className="max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>File Preview</span>
            {processing && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>}
          </CardTitle>
          <CardDescription>
            Review your file structure and data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {processing ? (
            <div className="text-center py-8">
              <Progress value={uploadProgress} className="mb-4" />
              <p className="text-gray-600">Processing file... {uploadProgress}%</p>
            </div>
          ) : previewData ? (
            <div className="space-y-6">
              {/* File Info */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">{previewData.metadata.fileName}</h3>
                  <p className="text-sm text-gray-600">
                    {previewData.metadata.totalRows} total rows • {previewData.headers.length} columns
                  </p>
                </div>
                <Badge variant="success">Valid Format</Badge>
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <Label htmlFor="title">Report Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter report title..."
                />
              </div>

              {/* Data Preview */}
              <div>
                <h4 className="font-medium mb-3">Data Preview (First 3 rows)</h4>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        {previewData.headers.map((header: string, index: number) => (
                          <th key={index} className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.rows.map((row: any, index: number) => (
                        <tr key={index} className="border-t">
                          {previewData.headers.map((header: string, colIndex: number) => (
                            <td key={colIndex} className="px-4 py-2 text-sm">
                              {row[header]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep('upload')}>
                  Back
                </Button>
                <Button variant="school" onClick={handleProceedToMapping}>
                  Continue to Analysis
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )

  const renderMappingStep = () => {
    if (!previewData) return null
    
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Column Mapping</CardTitle>
            <CardDescription>
              Detected {detectedSubjects.length} subjects from your file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-4">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <Alert variant="info">
                <AlertTitle>Auto-mapping Successful</AlertTitle>
                <AlertDescription>
                  We've automatically detected {detectedSubjects.length} subjects from your Excel file.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3 text-green-700">✓ Detected Subjects ({detectedSubjects.length}):</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {detectedSubjects.map((subject, index) => (
                      <div key={index} className="p-3 border rounded-lg bg-blue-50 text-sm">
                        {subject}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 text-gray-700">All Columns in File:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {previewData.headers.map((header: string, index: number) => {
                      const isSubject = detectedSubjects.includes(header)
                      return (
                        <div 
                          key={index} 
                          className={`p-3 border rounded-lg text-sm ${
                            isSubject ? 'bg-blue-50 border-blue-300' : 'bg-gray-50'
                          }`}
                        >
                          {header} {isSubject && '(Subject)'}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {warnings.length > 0 && (
                <Alert variant="warning">
                  <AlertTitle>Warnings</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-4">
                      {warnings.map((warning, idx) => (
                        <li key={idx}>{warning}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep('preview')}>
                  Back
                </Button>
                <Button variant="school" onClick={handleCompleteMapping}>
                  Start Analysis
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderProcessingStep = () => (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardContent className="pt-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold mb-2">Analyzing Results...</h3>
            <p className="text-gray-600 mb-4">
              We're processing your data and generating insights
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>✓ Validating student data</p>
              <p>✓ Calculating averages and totals</p>
              <p>✓ Generating rankings</p>
              <p>⏳ Creating visual reports</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderCompleteStep = () => {
    if (!analysisResult) return null
    
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-semibold mb-2">Analysis Complete!</h3>
              <p className="text-gray-600 mb-6">
                Your result analysis is ready. View comprehensive insights, rankings, and visual reports.
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{analysisResult.summary.totalStudents}</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{analysisResult.summary.totalSubjects}</div>
                  <div className="text-sm text-gray-600">Subjects</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{analysisResult.summary.classAverage.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Class Avg</div>
                </div>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg text-left">
                <h4 className="font-semibold mb-2">Quick Stats:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Pass Rate: {analysisResult.summary.passPercentage.toFixed(1)}%</li>
                  <li>• Highest Score: {analysisResult.summary.highestPercentage.toFixed(1)}%</li>
                  <li>• Top Performer: {analysisResult.studentRankings[0]?.name}</li>
                </ul>
              </div>

              <Button variant="school" size="lg" onClick={handleCreateReport}>
                View Detailed Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStepNumber = (step: UploadStep): number => {
    const steps: UploadStep[] = ['upload', 'preview', 'mapping', 'processing', 'complete']
    return steps.indexOf(step) + 1
  }

  const renderStepIndicator = () => (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-center space-x-8">
        {['Upload', 'Preview', 'Mapping', 'Processing', 'Complete'].map((step, index) => {
          const stepNumber = index + 1
          const currentStepNumber = getStepNumber(currentStep)
          const isActive = stepNumber === currentStepNumber
          const isCompleted = stepNumber < currentStepNumber
          
          return (
            <div key={step} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${isActive ? 'bg-blue-600 text-white' : 
                  isCompleted ? 'bg-green-600 text-white' : 
                  'bg-gray-200 text-gray-600'}
              `}>
                {isCompleted ? '✓' : stepNumber}
              </div>
              <span className={`ml-2 text-sm ${isActive ? 'font-medium' : 'text-gray-500'}`}>
                {step}
              </span>
              {index < 4 && (
                <div className={`ml-8 w-8 h-0.5 ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="school-container py-8">
        {renderStepIndicator()}
        
        {currentStep === 'upload' && renderUploadStep()}
        {currentStep === 'preview' && renderPreviewStep()}
        {currentStep === 'mapping' && renderMappingStep()}
        {currentStep === 'processing' && renderProcessingStep()}
        {currentStep === 'complete' && renderCompleteStep()}
      </main>

      <Footer />
    </div>
  )
}
