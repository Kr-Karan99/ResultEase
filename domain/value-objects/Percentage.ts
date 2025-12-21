/**
 * Percentage Value Object
 * Represents a percentage value with validation and formatting
 */
export class Percentage {
  private readonly value: number

  constructor(percentage: number) {
    this.validatePercentage(percentage)
    this.value = percentage
  }

  private validatePercentage(percentage: number): void {
    if (typeof percentage !== 'number') {
      throw new Error('Percentage must be a number')
    }
    
    if (isNaN(percentage)) {
      throw new Error('Percentage cannot be NaN')
    }
    
    if (percentage < 0) {
      throw new Error('Percentage cannot be negative')
    }
    
    if (percentage > 100) {
      throw new Error('Percentage cannot exceed 100')
    }
  }

  getValue(): number {
    return this.value
  }

  /**
   * Format percentage for display
   */
  format(decimals: number = 2): string {
    return `${this.value.toFixed(decimals)}%`
  }

  /**
   * Check if percentage represents a pass
   */
  isPassing(passThreshold: number = 40): boolean {
    return this.value >= passThreshold
  }

  /**
   * Get letter grade based on percentage
   */
  getLetterGrade(): string {
    if (this.value >= 90) return 'A+'
    if (this.value >= 80) return 'A'
    if (this.value >= 70) return 'B'
    if (this.value >= 60) return 'C'
    if (this.value >= 50) return 'D'
    if (this.value >= 40) return 'E'
    return 'F'
  }

  /**
   * Get performance category
   */
  getPerformanceCategory(): 'Excellent' | 'Good' | 'Average' | 'Below Average' | 'Poor' {
    if (this.value >= 90) return 'Excellent'
    if (this.value >= 75) return 'Good'
    if (this.value >= 60) return 'Average'
    if (this.value >= 40) return 'Below Average'
    return 'Poor'
  }

  /**
   * Compare percentages
   */
  isGreaterThan(other: Percentage): boolean {
    return this.value > other.value
  }

  isEqualTo(other: Percentage): boolean {
    return this.value === other.value
  }

  /**
   * Calculate percentage from marks
   */
  static fromMarks(obtained: number, total: number): Percentage {
    if (total <= 0) {
      throw new Error('Total marks must be greater than zero')
    }
    
    const percentage = (obtained / total) * 100
    return new Percentage(percentage)
  }

  /**
   * Calculate percentage from fraction
   */
  static fromFraction(numerator: number, denominator: number): Percentage {
    if (denominator <= 0) {
      throw new Error('Denominator must be greater than zero')
    }
    
    const percentage = (numerator / denominator) * 100
    return new Percentage(percentage)
  }

  /**
   * Create zero percentage
   */
  static zero(): Percentage {
    return new Percentage(0)
  }

  /**
   * Create hundred percentage
   */
  static hundred(): Percentage {
    return new Percentage(100)
  }

  toString(): string {
    return this.format()
  }
}
