/**
 * Student Entity
 * Represents a student with personal information
 */
export class Student {
  private readonly name: string
  private readonly rollNumber: string
  private readonly className?: string
  private readonly section?: string

  constructor(
    name: string, 
    rollNumber: string, 
    className?: string, 
    section?: string
  ) {
    this.validateStudent(name, rollNumber)
    this.name = name.trim()
    this.rollNumber = rollNumber.trim()
    this.className = className?.trim()
    this.section = section?.trim()
  }

  private validateStudent(name: string, rollNumber: string): void {
    if (typeof name !== 'string' || name.trim().length === 0) {
      throw new Error('Student name must be a non-empty string')
    }
    
    if (name.trim().length < 2) {
      throw new Error('Student name must be at least 2 characters long')
    }
    
    if (typeof rollNumber !== 'string' || rollNumber.trim().length === 0) {
      throw new Error('Roll number must be a non-empty string')
    }
  }

  getName(): string {
    return this.name
  }

  getRollNumber(): string {
    return this.rollNumber
  }

  getClassName(): string | undefined {
    return this.className
  }

  getSection(): string | undefined {
    return this.section
  }

  /**
   * Get full display name
   */
  getDisplayName(): string {
    return this.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  /**
   * Get full identifier (name + roll number)
   */
  getFullIdentifier(): string {
    return `${this.getDisplayName()} (${this.rollNumber})`
  }

  /**
   * Get class and section display
   */
  getClassDisplay(): string {
    if (this.className && this.section) {
      return `${this.className}-${this.section}`
    }
    if (this.className) {
      return this.className
    }
    return 'N/A'
  }

  /**
   * Check if this student matches another by roll number
   */
  matches(otherStudent: Student): boolean {
    return this.rollNumber.toLowerCase() === otherStudent.rollNumber.toLowerCase()
  }

  /**
   * Check if student matches by roll number string
   */
  matchesRollNumber(rollNumber: string): boolean {
    return this.rollNumber.toLowerCase() === rollNumber.toLowerCase()
  }

  /**
   * Get normalized roll number for sorting/comparison
   */
  getNormalizedRollNumber(): string {
    return this.rollNumber.toLowerCase().replace(/[^a-z0-9]/g, '')
  }

  toString(): string {
    return this.getFullIdentifier()
  }

  /**
   * Create student from raw data (for Excel parsing)
   */
  static fromRawData(data: {
    name?: string
    rollNumber?: string
    class?: string
    section?: string
  }): Student {
    if (!data.name) {
      throw new Error('Student name is required')
    }
    
    if (!data.rollNumber) {
      throw new Error('Student roll number is required')
    }
    
    return new Student(
      data.name,
      data.rollNumber,
      data.class,
      data.section
    )
  }

  /**
   * Validate if raw data can create a valid student
   */
  static canCreateFrom(data: any): boolean {
    try {
      Student.fromRawData(data)
      return true
    } catch {
      return false
    }
  }

  /**
   * Compare students for sorting by roll number
   */
  static compare(a: Student, b: Student): number {
    // Try numeric comparison first
    const aNum = parseInt(a.rollNumber, 10)
    const bNum = parseInt(b.rollNumber, 10)
    
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum
    }
    
    // Fall back to string comparison
    return a.rollNumber.localeCompare(b.rollNumber)
  }
}
