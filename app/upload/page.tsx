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

type UploadStep = 'upload' | 'preview' | 'mapping' | 'processing' | 'complete'

export default function UploadPage() {
  // Protect this route - redirects unauthenticated users
  useProtectedRoute()

  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<UploadStep>('upload')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [title, setTitle] = useState('')
  const [previewData, setPreviewData] = useState<any>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [warnings, setWarnings] = useState<string[]>([])

  // Mock preview data for demonstration
  const mockPreviewData = {
    headers: ['Name', 'Roll No', 'Math', 'Science', 'English', 'Total', 'Percentage'],
    rows: [
      {
        'Name': 'John Smith',
        'Roll No': '001',
        'Math': '85',
        'Science': '78',
        'English': '92',
        'Total': '255',
        'Percentage': '85%'
      },
      {
        'Name': 'Sarah Johnson',
        'Roll No': '002', 
        'Math': '92',
        'Science': '88',
        'English': '85',
        'Total': '265',
        'Percentage': '88.3%'
      },
      {
        'Name': 'Mike Davis',
        'Roll No': '003',
        'Math': '76',
        'Science': '82',
        'English': '79',
        'Total': '237',
        'Percentage': '79%'
      }
    ],
    metadata: {
      totalRows: 25,
      fileName: selectedFile?.name || ''
    }
  }

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ]

    if (!allowedTypes.includes(file.type)) {
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
    
    // Simulate file processing
    simulateFileProcessing()
  }, [])

  const simulateFileProcessing = () => {
    setProcessing(true)
    setUploadProgress(0)
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setProcessing(false)
          setPreviewData(mockPreviewData)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleProceedToMapping = () => {
    setCurrentStep('mapping')
  }

  const handleCompleteMapping = () => {
    setCurrentStep('processing')
    
    // Simulate processing
    setTimeout(() => {
      setCurrentStep('complete')
    }, 2000)
  }

  const handleCreateReport = () => {
    // In real app, this would create a report and redirect
    router.push('/reports/demo-report-1')
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
            <label htmlFor="file-upload">
              <Button variant="school" className="cursor-pointer">
                Select File
              </Button>
            </label>
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

  const renderMappingStep = () => (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Column Mapping</CardTitle>
          <CardDescription>
            Confirm how your Excel columns map to our system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Alert variant="info">
              <AlertTitle>Auto-mapping Successful</AlertTitle>
              <AlertDescription>
                We've automatically mapped your columns. Review and adjust if needed.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Excel Columns</h4>
                <div className="space-y-2">
                  {previewData?.headers.map((header: string, index: number) => (
                    <div key={index} className="p-3 border rounded-lg bg-gray-50">
                      {header}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Mapped To</h4>
                <div className="space-y-2">
                  <div className="p-3 border rounded-lg bg-green-50">
                    Student Name ✓
                  </div>
                  <div className="p-3 border rounded-lg bg-green-50">
                    Roll Number ✓
                  </div>
                  <div className="p-3 border rounded-lg bg-blue-50">
                    Mathematics (Subject)
                  </div>
                  <div className="p-3 border rounded-lg bg-blue-50">
                    Science (Subject)
                  </div>
                  <div className="p-3 border rounded-lg bg-blue-50">
                    English (Subject)
                  </div>
                  <div className="p-3 border rounded-lg bg-gray-50">
                    Total (Calculated)
                  </div>
                  <div className="p-3 border rounded-lg bg-gray-50">
                    Percentage (Calculated)
                  </div>
                </div>
              </div>
            </div>

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

  const renderCompleteStep = () => (
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
                <div className="text-2xl font-bold text-blue-600">{mockPreviewData.metadata.totalRows}</div>
                <div className="text-sm text-gray-600">Students</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">3</div>
                <div className="text-sm text-gray-600">Subjects</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">84.5%</div>
                <div className="text-sm text-gray-600">Class Avg</div>
              </div>
            </div>

            <Button variant="school" size="lg" onClick={handleCreateReport}>
              View Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

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
