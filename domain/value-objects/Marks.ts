/**
 * Marks Value Object
 * Represents a student's marks in a subject with validation
 */
export class Marks {
  private readonly value: number

  constructor(marks: number, isTotal: boolean = false) {
    this.validateMarks(marks, isTotal)
    this.value = marks
  }

  private validateMarks(marks: number, isTotal: boolean = false): void {
    if (typeof marks !== 'number') {
      throw new Error('Marks must be a number')
    }
    
    if (isNaN(marks)) {
      throw new Error('Marks cannot be NaN')
    }
    
    if (marks < 0) {
      throw new Error('Marks cannot be negative')
    }
    
    if (!isTotal && marks > 100) {
      throw new Error('Marks cannot exceed 100')
    }
  }

  getValue(): number {
    return this.value
  }

  /**
   * Check if marks represent a pass (>= 40%)
   */
  isPassing(passPercentage: number = 40): boolean {
    return this.value >= passPercentage
  }

  /**
   * Get letter grade based on marks
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
   * Add marks (for total calculation)
   */
  add(other: Marks): Marks {
    return new Marks(this.value + other.value, true) // Total marks can exceed 100
  }

  /**
   * Compare marks
   */
  isGreaterThan(other: Marks): boolean {
    return this.value > other.value
  }

  isEqualTo(other: Marks): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value.toString()
  }

  /**
   * Create Marks from string input (for Excel parsing)
   */
  static fromString(marksString: string): Marks {
    const trimmed = marksString.trim()
    
    if (trimmed === '' || trimmed.toLowerCase() === 'absent' || trimmed.toLowerCase() === 'ab') {
      return new Marks(0)
    }
    
    const parsed = parseFloat(trimmed)
    
    if (isNaN(parsed)) {
      throw new Error(`Invalid marks format: ${marksString}`)
    }
    
    return new Marks(parsed)
  }

  /**
   * Create zero marks
   */
  static zero(): Marks {
    return new Marks(0)
  }

  /**
   * Create total marks (can exceed 100)
   */
  static total(marks: number): Marks {
    return new Marks(marks, true)
  }
}
