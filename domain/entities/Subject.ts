/**
 * Subject Entity
 * Represents a school subject with name and maximum marks
 */
export class Subject {
  private readonly name: string
  private readonly maxMarks: number
  private readonly isOptional: boolean

  constructor(name: string, maxMarks: number = 100, isOptional: boolean = false) {
    this.validateSubject(name, maxMarks)
    this.name = name.trim()
    this.maxMarks = maxMarks
    this.isOptional = isOptional
  }

  private validateSubject(name: string, maxMarks: number): void {
    if (typeof name !== 'string' || name.trim().length === 0) {
      throw new Error('Subject name must be a non-empty string')
    }
    
    if (typeof maxMarks !== 'number' || maxMarks <= 0) {
      throw new Error('Maximum marks must be a positive number')
    }
    
    if (maxMarks > 1000) {
      throw new Error('Maximum marks cannot exceed 1000')
    }
  }

  getName(): string {
    return this.name
  }

  getMaxMarks(): number {
    return this.maxMarks
  }

  isOptionalSubject(): boolean {
    return this.isOptional
  }

  /**
   * Get normalized subject name for comparison
   */
  getNormalizedName(): string {
    return this.name.toLowerCase().replace(/[^a-z0-9]/g, '')
  }

  /**
   * Get display name with proper formatting
   */
  getDisplayName(): string {
    return this.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  /**
   * Check if this subject matches another by name
   */
  matches(otherSubject: Subject): boolean {
    return this.getNormalizedName() === otherSubject.getNormalizedName()
  }

  /**
   * Check if subject name matches a string
   */
  matchesName(name: string): boolean {
    return this.getNormalizedName() === name.toLowerCase().replace(/[^a-z0-9]/g, '')
  }

  /**
   * Calculate percentage for given marks
   */
  calculatePercentage(marks: number): number {
    return (marks / this.maxMarks) * 100
  }

  toString(): string {
    return `${this.name} (${this.maxMarks} marks)`
  }

  /**
   * Create subject from string (for Excel parsing)
   */
  static fromString(subjectString: string, maxMarks: number = 100): Subject {
    const cleaned = subjectString.trim()
    
    if (cleaned.length === 0) {
      throw new Error('Subject name cannot be empty')
    }
    
    return new Subject(cleaned, maxMarks)
  }

  /**
   * Create standard subjects list
   */
  static createStandardSubjects(): Subject[] {
    return [
      new Subject('Mathematics', 100),
      new Subject('Science', 100),
      new Subject('English', 100),
      new Subject('Social Studies', 100),
      new Subject('Hindi', 100),
    ]
  }

  /**
   * Validate if a string is a valid subject name
   */
  static isValidName(name: string): boolean {
    try {
      new Subject(name)
      return true
    } catch {
      return false
    }
  }
}
