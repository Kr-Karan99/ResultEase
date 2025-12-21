// Application constants
export const APP_NAME = 'ResultEase'
export const APP_DESCRIPTION = 'School result analysis SaaS tool'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// File upload limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_FILE_TYPES = ['.xlsx', '.csv']
export const MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'application/csv'
]

// Grade boundaries (customizable per school)
export const DEFAULT_GRADE_BOUNDARIES = {
  A: 90,
  B: 80,
  C: 70,
  D: 60,
  F: 0
}

// Pass percentage threshold
export const PASS_PERCENTAGE = 40

// Chart colors (school-friendly)
export const CHART_COLORS = {
  primary: '#3B82F6',    // Blue
  secondary: '#10B981',   // Green
  accent: '#F59E0B',      // Orange
  warning: '#EF4444',     // Red
  muted: '#6B7280'        // Gray
}

// Maximum number of subjects to display in charts
export const MAX_SUBJECTS_DISPLAY = 10

// Local storage keys
export const STORAGE_KEYS = {
  REPORTS: 'resultease_reports',
  SETTINGS: 'resultease_settings',
  USER_PREFS: 'resultease_user_preferences'
}
