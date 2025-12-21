/**
 * Mock Storage Service  
 * Implements StoragePort interface for development and testing
 * Will be replaced with Firebase Storage in production
 */

import { StoragePort, FileMetadata, UploadOptions, UploadResult } from '../../application/ports/StoragePort'

interface MockFile {
  id: string
  name: string
  size: number
  type: string
  data: Buffer
  uploadedAt: Date
  uploadedBy: string
  path: string
  url: string
  metadata: Record<string, any>
}

export class MockStorageService implements StoragePort {
  private files: Map<string, MockFile> = new Map()
  private quotas: Map<string, { used: number; total: number }> = new Map()
  
  constructor() {
    // Initialize with some demo files
    this.initializeDemoFiles()
  }

  private initializeDemoFiles() {
    // Create some demo files for testing
    const demoFiles: Omit<MockFile, 'data'>[] = [
      {
        id: 'demo_file_1',
        name: 'class_10_math_results.xlsx',
        size: 2048,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        uploadedAt: new Date('2024-01-15'),
        uploadedBy: 'teacher1',
        path: 'teacher1/excel-files/class_10_math_results.xlsx',
        url: 'https://mock-storage.com/teacher1/excel-files/class_10_math_results.xlsx',
        metadata: {
          title: 'Class 10 Math Results',
          subject: 'Mathematics',
          class: '10'
        }
      },
      {
        id: 'demo_file_2',
        name: 'science_midterm_2024.csv',
        size: 1536,
        type: 'text/csv',
        uploadedAt: new Date('2024-02-01'),
        uploadedBy: 'teacher1',
        path: 'teacher1/excel-files/science_midterm_2024.csv',
        url: 'https://mock-storage.com/teacher1/excel-files/science_midterm_2024.csv',
        metadata: {
          title: 'Science Midterm 2024',
          subject: 'Science',
          examType: 'midterm'
        }
      }
    ]

    demoFiles.forEach(file => {
      const mockFile: MockFile = {
        ...file,
        data: Buffer.from(`Mock file content for ${file.name}`)
      }
      this.files.set(file.id, mockFile)
      
      // Update quota
      this.updateQuota(file.uploadedBy, file.size)
    })
  }

  async uploadFile(
    file: File | Buffer, 
    fileName: string, 
    options?: UploadOptions
  ): Promise<UploadResult> {
    // Simulate upload delay
    await this.delay(1000)

    try {
      // Validate file size (10MB limit)
      const fileSize = file instanceof File ? file.size : file.length
      if (fileSize > 10 * 1024 * 1024) {
        return {
          success: false,
          error: 'File size exceeds 10MB limit'
        }
      }

      // Generate file ID and path
      const fileId = this.generateFileId()
      const folder = options?.folder || 'uploads'
      const path = `${folder}/${fileName}`
      const url = `https://mock-storage.com/${path}`

      // Convert file to buffer
      let buffer: Buffer
      let type: string
      
      if (file instanceof File) {
        buffer = Buffer.from(await file.arrayBuffer())
        type = file.type
      } else {
        buffer = file
        type = this.guessFileType(fileName)
      }

      // Check for overwrite
      if (!options?.overwrite) {
        const existingFile = Array.from(this.files.values())
          .find(f => f.path === path)
        
        if (existingFile) {
          return {
            success: false,
            error: 'File already exists. Set overwrite: true to replace it.'
          }
          }
      }

      // Create file metadata
      const mockFile: MockFile = {
        id: fileId,
        name: fileName,
        size: fileSize,
        type: type,
        data: buffer,
        uploadedAt: new Date(),
        uploadedBy: options?.metadata?.uploadedBy || 'unknown',
        path: path,
        url: url,
        metadata: options?.metadata || {}
      }

      // Store file
      this.files.set(fileId, mockFile)

      // Update quota
      this.updateQuota(mockFile.uploadedBy, fileSize)

      // Return metadata
      const metadata: FileMetadata = {
        id: fileId,
        name: fileName,
        size: fileSize,
        type: type,
        uploadedAt: mockFile.uploadedAt,
        uploadedBy: mockFile.uploadedBy,
        url: url,
        path: path
      }

      return {
        success: true,
        file: metadata
      }

    } catch (error) {
      return {
        success: false,
        error: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  async downloadFile(fileId: string): Promise<{
    success: boolean
    data?: Buffer | Blob
    error?: string
  }> {
    // Simulate download delay
    await this.delay(300)

    const file = this.files.get(fileId)
    
    if (!file) {
      return {
        success: false,
        error: 'File not found'
      }
    }

    return {
      success: true,
      data: file.data
    }
  }

  async getFileMetadata(fileId: string): Promise<{
    success: boolean
    metadata?: FileMetadata
    error?: string
  }> {
    await this.delay(100)

    const file = this.files.get(fileId)
    
    if (!file) {
      return {
        success: false,
        error: 'File not found'
      }
    }

    const metadata: FileMetadata = {
      id: file.id,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: file.uploadedAt,
      uploadedBy: file.uploadedBy,
      url: file.url,
      path: file.path
    }

    return {
      success: true,
      metadata
    }
  }

  async deleteFile(fileId: string): Promise<{
    success: boolean
    error?: string
  }> {
    await this.delay(200)

    const file = this.files.get(fileId)
    
    if (!file) {
      return {
        success: false,
        error: 'File not found'
      }
    }

    // Update quota
    this.updateQuota(file.uploadedBy, -file.size)

    // Delete file
    this.files.delete(fileId)

    return {
      success: true
    }
  }

  async listFiles(folder?: string, userId?: string): Promise<{
    success: boolean
    files?: FileMetadata[]
    error?: string
  }> {
    await this.delay(200)

    try {
      let files = Array.from(this.files.values())

      // Filter by folder
      if (folder) {
        files = files.filter(file => file.path.startsWith(folder))
      }

      // Filter by user
      if (userId) {
        files = files.filter(file => file.uploadedBy === userId)
      }

      // Convert to metadata
      const fileMetadata: FileMetadata[] = files.map(file => ({
        id: file.id,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: file.uploadedAt,
        uploadedBy: file.uploadedBy,
        url: file.url,
        path: file.path
      }))

      // Sort by upload date (newest first)
      fileMetadata.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())

      return {
        success: true,
        files: fileMetadata
      }

    } catch (error) {
      return {
        success: false,
        error: `Failed to list files: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  async getFileUrl(fileId: string, expiresIn?: number): Promise<{
    success: boolean
    url?: string
    error?: string
  }> {
    await this.delay(50)

    const file = this.files.get(fileId)
    
    if (!file) {
      return {
        success: false,
        error: 'File not found'
      }
    }

    // In mock, we'll add expiry parameter to URL if specified
    let url = file.url
    if (expiresIn) {
      const expiry = Date.now() + expiresIn * 1000
      url += `?expires=${expiry}`
    }

    return {
      success: true,
      url
    }
  }

  async fileExists(fileId: string): Promise<boolean> {
    await this.delay(50)
    return this.files.has(fileId)
  }

  async getQuotaInfo(userId: string): Promise<{
    success: boolean
    quota?: {
      used: number
      total: number
      remaining: number
    }
    error?: string
  }> {
    await this.delay(100)

    const quota = this.quotas.get(userId) || { used: 0, total: 100 * 1024 * 1024 } // 100MB default
    
    return {
      success: true,
      quota: {
        used: quota.used,
        total: quota.total,
        remaining: quota.total - quota.used
      }
    }
  }

  async createFolder(path: string): Promise<{
    success: boolean
    error?: string
  }> {
    await this.delay(100)
    
    // In mock storage, folders don't need explicit creation
    // They're created implicitly when files are uploaded
    return {
      success: true
    }
  }

  async copyFile(sourceFileId: string, destinationPath: string): Promise<{
    success: boolean
    newFile?: FileMetadata
    error?: string
  }> {
    await this.delay(300)

    const sourceFile = this.files.get(sourceFileId)
    
    if (!sourceFile) {
      return {
        success: false,
        error: 'Source file not found'
      }
    }

    // Create copy
    const newFileId = this.generateFileId()
    const newFile: MockFile = {
      ...sourceFile,
      id: newFileId,
      path: destinationPath,
      url: `https://mock-storage.com/${destinationPath}`,
      uploadedAt: new Date(),
      metadata: { ...sourceFile.metadata, copiedFrom: sourceFileId }
    }

    this.files.set(newFileId, newFile)
    this.updateQuota(newFile.uploadedBy, newFile.size)

    const metadata: FileMetadata = {
      id: newFileId,
      name: newFile.name,
      size: newFile.size,
      type: newFile.type,
      uploadedAt: newFile.uploadedAt,
      uploadedBy: newFile.uploadedBy,
      url: newFile.url,
      path: newFile.path
    }

    return {
      success: true,
      newFile: metadata
    }
  }

  async moveFile(fileId: string, newPath: string): Promise<{
    success: boolean
    error?: string
  }> {
    await this.delay(200)

    const file = this.files.get(fileId)
    
    if (!file) {
      return {
        success: false,
        error: 'File not found'
      }
    }

    // Update file path
    file.path = newPath
    file.url = `https://mock-storage.com/${newPath}`

    return {
      success: true
    }
  }

  async deleteFiles(fileIds: string[]): Promise<{
    success: boolean
    deletedCount: number
    errors?: string[]
  }> {
    await this.delay(400)

    let deletedCount = 0
    const errors: string[] = []

    for (const fileId of fileIds) {
      const file = this.files.get(fileId)
      
      if (!file) {
        errors.push(`File ${fileId} not found`)
        continue
      }

      // Update quota and delete
      this.updateQuota(file.uploadedBy, -file.size)
      this.files.delete(fileId)
      deletedCount++
    }

    return {
      success: true,
      deletedCount,
      errors: errors.length > 0 ? errors : undefined
    }
  }

  // Helper methods
  private generateFileId(): string {
    return 'file_' + Math.random().toString(36).substr(2, 9)
  }

  private guessFileType(fileName: string): string {
    const extension = fileName.toLowerCase().split('.').pop()
    
    switch (extension) {
      case 'xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      case 'xls':
        return 'application/vnd.ms-excel'
      case 'csv':
        return 'text/csv'
      case 'pdf':
        return 'application/pdf'
      case 'txt':
        return 'text/plain'
      default:
        return 'application/octet-stream'
    }
  }

  private updateQuota(userId: string, sizeChange: number) {
    const current = this.quotas.get(userId) || { used: 0, total: 100 * 1024 * 1024 }
    current.used = Math.max(0, current.used + sizeChange)
    this.quotas.set(userId, current)
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Development helper methods
  reset() {
    this.files.clear()
    this.quotas.clear()
    this.initializeDemoFiles()
  }

  getStoredFiles(): MockFile[] {
    return Array.from(this.files.values())
  }
}
