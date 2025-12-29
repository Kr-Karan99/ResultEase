import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format number to display with proper decimal places
 */
export function formatNumber(num: number, decimals: number = 2): string {
  return num.toFixed(decimals)
}

/**
 * Format percentage with % symbol
 */
export function formatPercentage(num: number, decimals: number = 2): string {
  return `${num.toFixed(decimals)}%`
}

/**
 * Generate a unique ID for reports
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * Validate if a value is a valid numeric mark
 */
export function isValidMark(value: any): boolean {
  const num = parseFloat(value)
  return !isNaN(num) && num >= 0 && num <= 100
}

/**
 * Convert string to title case
 */
export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}
