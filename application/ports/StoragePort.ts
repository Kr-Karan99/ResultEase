/**
 * Storage Port Interface
 * Defines the contract for file storage services
 * This interface will be implemented by mock services now and Firebase Storage later
 */

export interface FileMetadata {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: Date
  uploadedBy: string
  url?: string
  path: string
}

export interface UploadOptions {
  folder?: string
  overwrite?: boolean
  metadata?: Record<string, any>
}

export interface UploadResult {
  success: boolean
  file?: FileMetadata
  error?: string
}

export interface StoragePort {
  /**
   * Upload a file to storage
   */
  uploadFile(
    file: File | Buffer,
    fileName: string,
    options?: UploadOptions
  ): Promise<UploadResult>
  
  /**
   * Download a file from storage
   */
  downloadFile(fileId: string): Promise<{
    success: boolean
    data?: Buffer | Blob
    error?: string
  }>
  
  /**
   * Get file metadata
   */
  getFileMetadata(fileId: string): Promise<{
    success: boolean
    metadata?: FileMetadata
    error?: string
  }>
  
  /**
   * Delete a file from storage
   */
  deleteFile(fileId: string): Promise<{
    success: boolean
    error?: string
  }>
  
  /**
   * List files in a folder
   */
  listFiles(folder?: string, userId?: string): Promise<{
    success: boolean
    files?: FileMetadata[]
    error?: string
  }>
  
  /**
   * Get file download URL (temporary or permanent)
   */
  getFileUrl(fileId: string, expiresIn?: number): Promise<{
    success: boolean
    url?: string
    error?: string
  }>
  
  /**
   * Check if file exists
   */
  fileExists(fileId: string): Promise<boolean>
  
  /**
   * Get storage quota information
   */
  getQuotaInfo(userId: string): Promise<{
    success: boolean
    quota?: {
      used: number
      total: number
      remaining: number
    }
    error?: string
  }>
  
  /**
   * Create a folder/directory
   */
  createFolder(path: string): Promise<{
    success: boolean
    error?: string
  }>
  
  /**
   * Copy file to another location
   */
  copyFile(sourceFileId: string, destinationPath: string): Promise<{
    success: boolean
    newFile?: FileMetadata
    error?: string
  }>
  
  /**
   * Move file to another location
   */
  moveFile(fileId: string, newPath: string): Promise<{
    success: boolean
    error?: string
  }>
  
  /**
   * Batch delete multiple files
   */
  deleteFiles(fileIds: string[]): Promise<{
    success: boolean
    deletedCount: number
    errors?: string[]
  }>
}
