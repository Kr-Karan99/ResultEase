import { Student } from './Student'
import { Subject } from './Subject'
import { Marks } from '../value-objects/Marks'
import { Percentage } from '../value-objects/Percentage'

/**
 * StudentResult represents a single student's performance across all subjects
 */
export interface StudentResult {
  student: Student
  marks: Map<string, Marks> // subject name -> marks
  totalMarks: Marks
  percentage: Percentage
  rank?: number
}

/**
 * Result Entity (Aggregate Root)
 * Represents the complete result set for a class/exam
 */
export class Result {
  private readonly id: string
  private readonly title: string
  private readonly subjects: Subject[]
  private readonly studentResults: Map<string, StudentResult>
  private readonly createdAt: Date
  private readonly maxTotalMarks: number

  constructor(
    id: string,
    title: string,
    subjects: Subject[],
    studentResults: StudentResult[] = []
  ) {
    this.validateResult(id, title, subjects)
    this.id = id
    this.title = title.trim()
    this.subjects = [...subjects]
    this.studentResults = new Map()
    this.createdAt = new Date()
    this.maxTotalMarks = subjects.reduce((sum, subject) => sum + subject.getMaxMarks(), 0)

    // Add student results
    studentResults.forEach(result => {
      this.addStudentResult(result)
    })
  }

  private validateResult(id: string, title: string, subjects: Subject[]): void {
    if (typeof id !== 'string' || id.trim().length === 0) {
      throw new Error('Result ID must be a non-empty string')
    }
    
    if (typeof title !== 'string' || title.trim().length === 0) {
      throw new Error('Result title must be a non-empty string')
    }
    
    if (!Array.isArray(subjects) || subjects.length === 0) {
      throw new Error('Result must have at least one subject')
    }
  }

  getId(): string {
    return this.id
  }

  getTitle(): string {
    return this.title
  }

  getSubjects(): Subject[] {
    return [...this.subjects]
  }

  getCreatedAt(): Date {
    return this.createdAt
  }

  getMaxTotalMarks(): number {
    return this.maxTotalMarks
  }

  /**
   * Add a student result to the result set
   */
  addStudentResult(studentResult: StudentResult): void {
    this.validateStudentResult(studentResult)
    this.studentResults.set(studentResult.student.getRollNumber(), studentResult)
  }

  private validateStudentResult(studentResult: StudentResult): void {
    // Validate that all subjects are covered
    const resultSubjectNames = Array.from(studentResult.marks.keys())
    const expectedSubjectNames = this.subjects.map(s => s.getName())
    
    for (const expectedSubject of expectedSubjectNames) {
      if (!resultSubjectNames.includes(expectedSubject)) {
        throw new Error(`Missing marks for subject: ${expectedSubject}`)
      }
    }
  }

  /**
   * Get all student results
   */
  getStudentResults(): StudentResult[] {
    return Array.from(this.studentResults.values())
  }

  /**
   * Get student result by roll number
   */
  getStudentResult(rollNumber: string): StudentResult | undefined {
    return this.studentResults.get(rollNumber)
  }

  /**
   * Get total number of students
   */
  getStudentCount(): number {
    return this.studentResults.size
  }

  /**
   * Calculate and assign ranks to all students
   */
  calculateRanks(): void {
    const results = this.getStudentResults()
    
    // Sort by percentage (descending) and then by total marks (descending)
    results.sort((a, b) => {
      const percentageDiff = b.percentage.getValue() - a.percentage.getValue()
      if (percentageDiff !== 0) return percentageDiff
      return b.totalMarks.getValue() - a.totalMarks.getValue()
    })

    // Assign ranks
    let currentRank = 1
    for (let i = 0; i < results.length; i++) {
      if (i > 0 && 
          results[i].percentage.getValue() !== results[i - 1].percentage.getValue()) {
        currentRank = i + 1
      }
      results[i].rank = currentRank
    }
  }

  /**
   * Get students sorted by rank
   */
  getStudentsByRank(): StudentResult[] {
    return this.getStudentResults()
      .filter(result => result.rank !== undefined)
      .sort((a, b) => (a.rank || 0) - (b.rank || 0))
  }

  /**
   * Get top N students
   */
  getTopStudents(count: number = 10): StudentResult[] {
    return this.getStudentsByRank().slice(0, count)
  }

  /**
   * Create a complete result from raw data
   */
  static fromRawData(data: {
    id: string
    title: string
    subjects: string[]
    studentData: Array<{
      name: string
      rollNumber: string
      class?: string
      section?: string
      marks: Record<string, number | string>
    }>
  }): Result {
    // Create subjects
    const subjects = data.subjects.map(name => new Subject(name))
    
    // Create student results
    const studentResults: StudentResult[] = data.studentData.map(studentData => {
      const student = Student.fromRawData(studentData)
      const marks = new Map<string, Marks>()
      
      let totalMarksValue = 0
      
      // Process marks for each subject
      subjects.forEach(subject => {
        const markValue = studentData.marks[subject.getName()]
        let mark: Marks
        
        if (typeof markValue === 'string') {
          mark = Marks.fromString(markValue)
        } else {
          mark = new Marks(markValue || 0)
        }
        
        marks.set(subject.getName(), mark)
        totalMarksValue += mark.getValue()
      })
      
      const totalMarks = Marks.total(totalMarksValue)
      const maxTotalMarks = subjects.reduce((sum, s) => sum + s.getMaxMarks(), 0)
      const percentage = Percentage.fromMarks(totalMarksValue, maxTotalMarks)
      
      return {
        student,
        marks,
        totalMarks,
        percentage
      }
    })
    
    const result = new Result(data.id, data.title, subjects, studentResults)
    result.calculateRanks()
    return result
  }

  /**
   * Export result data for persistence
   */
  toExportData() {
    return {
      id: this.id,
      title: this.title,
      subjects: this.subjects.map(s => ({
        name: s.getName(),
        maxMarks: s.getMaxMarks(),
        isOptional: s.isOptionalSubject()
      })),
      studentResults: this.getStudentResults().map(result => ({
        student: {
          name: result.student.getName(),
          rollNumber: result.student.getRollNumber(),
          class: result.student.getClassName(),
          section: result.student.getSection()
        },
        marks: Object.fromEntries(
          Array.from(result.marks.entries()).map(([subject, marks]) => [
            subject, 
            marks.getValue()
          ])
        ),
        totalMarks: result.totalMarks.getValue(),
        percentage: result.percentage.getValue(),
        rank: result.rank
      })),
      createdAt: this.createdAt.toISOString(),
      maxTotalMarks: this.maxTotalMarks
    }
  }
}
