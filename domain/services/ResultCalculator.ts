import { Result, StudentResult } from '../entities/Result'
import { Subject } from '../entities/Subject'
import { Marks } from '../value-objects/Marks'
import { Percentage } from '../value-objects/Percentage'

/**
 * Pure calculation functions for result analysis
 */
export class ResultCalculator {
  
  /**
   * Calculate average marks for a specific subject
   */
  static calculateSubjectAverage(result: Result, subjectName: string): number {
    const studentResults = result.getStudentResults()
    
    if (studentResults.length === 0) {
      return 0
    }
    
    const totalMarks = studentResults.reduce((sum, studentResult) => {
      const marks = studentResult.marks.get(subjectName)
      return sum + (marks?.getValue() || 0)
    }, 0)
    
    return totalMarks / studentResults.length
  }

  /**
   * Calculate averages for all subjects
   */
  static calculateAllSubjectAverages(result: Result): Record<string, number> {
    const subjects = result.getSubjects()
    const averages: Record<string, number> = {}
    
    subjects.forEach(subject => {
      averages[subject.getName()] = this.calculateSubjectAverage(result, subject.getName())
    })
    
    return averages
  }

  /**
   * Calculate class average percentage
   */
  static calculateClassAveragePercentage(result: Result): Percentage {
    const studentResults = result.getStudentResults()
    
    if (studentResults.length === 0) {
      return Percentage.zero()
    }
    
    const totalPercentage = studentResults.reduce((sum, studentResult) => {
      return sum + studentResult.percentage.getValue()
    }, 0)
    
    return new Percentage(totalPercentage / studentResults.length)
  }

  /**
   * Find highest marks in a subject
   */
  static findHighestMarksInSubject(result: Result, subjectName: string): {
    marks: Marks
    students: StudentResult[]
  } {
    const studentResults = result.getStudentResults()
    let highestMarks = Marks.zero()
    const topStudents: StudentResult[] = []
    
    studentResults.forEach(studentResult => {
      const marks = studentResult.marks.get(subjectName)
      if (marks) {
        if (marks.isGreaterThan(highestMarks)) {
          highestMarks = marks
          topStudents.length = 0
          topStudents.push(studentResult)
        } else if (marks.isEqualTo(highestMarks)) {
          topStudents.push(studentResult)
        }
      }
    })
    
    return {
      marks: highestMarks,
      students: topStudents
    }
  }

  /**
   * Find lowest marks in a subject
   */
  static findLowestMarksInSubject(result: Result, subjectName: string): {
    marks: Marks
    students: StudentResult[]
  } {
    const studentResults = result.getStudentResults()
    
    if (studentResults.length === 0) {
      return {
        marks: Marks.zero(),
        students: []
      }
    }
    
    let lowestMarks: Marks | null = null
    const bottomStudents: StudentResult[] = []
    
    studentResults.forEach(studentResult => {
      const marks = studentResult.marks.get(subjectName)
      if (marks) {
        if (!lowestMarks || marks.getValue() < lowestMarks.getValue()) {
          lowestMarks = marks
          bottomStudents.length = 0
          bottomStudents.push(studentResult)
        } else if (marks.getValue() === lowestMarks.getValue()) {
          bottomStudents.push(studentResult)
        }
      }
    })
    
    return {
      marks: lowestMarks || Marks.zero(),
      students: bottomStudents
    }
  }

  /**
   * Calculate subject-wise statistics
   */
  static calculateSubjectStatistics(result: Result, subjectName: string) {
    const studentResults = result.getStudentResults()
    const marks = studentResults
      .map(sr => sr.marks.get(subjectName)?.getValue() || 0)
      .filter(m => m > 0)
    
    if (marks.length === 0) {
      return {
        average: 0,
        highest: 0,
        lowest: 0,
        median: 0,
        standardDeviation: 0,
        studentsCount: 0
      }
    }
    
    marks.sort((a, b) => a - b)
    
    const sum = marks.reduce((a, b) => a + b, 0)
    const average = sum / marks.length
    const highest = Math.max(...marks)
    const lowest = Math.min(...marks)
    
    // Calculate median
    const mid = Math.floor(marks.length / 2)
    const median = marks.length % 2 === 0 
      ? (marks[mid - 1] + marks[mid]) / 2 
      : marks[mid]
    
    // Calculate standard deviation
    const squaredDifferences = marks.map(mark => Math.pow(mark - average, 2))
    const variance = squaredDifferences.reduce((a, b) => a + b, 0) / marks.length
    const standardDeviation = Math.sqrt(variance)
    
    return {
      average: Math.round(average * 100) / 100,
      highest,
      lowest,
      median,
      standardDeviation: Math.round(standardDeviation * 100) / 100,
      studentsCount: marks.length
    }
  }

  /**
   * Calculate overall class statistics
   */
  static calculateClassStatistics(result: Result) {
    const studentResults = result.getStudentResults()
    const percentages = studentResults.map(sr => sr.percentage.getValue())
    
    if (percentages.length === 0) {
      return {
        studentsCount: 0,
        averagePercentage: 0,
        highestPercentage: 0,
        lowestPercentage: 0,
        medianPercentage: 0,
        standardDeviation: 0
      }
    }
    
    percentages.sort((a, b) => a - b)
    
    const sum = percentages.reduce((a, b) => a + b, 0)
    const average = sum / percentages.length
    const highest = Math.max(...percentages)
    const lowest = Math.min(...percentages)
    
    // Calculate median
    const mid = Math.floor(percentages.length / 2)
    const median = percentages.length % 2 === 0 
      ? (percentages[mid - 1] + percentages[mid]) / 2 
      : percentages[mid]
    
    // Calculate standard deviation
    const squaredDifferences = percentages.map(p => Math.pow(p - average, 2))
    const variance = squaredDifferences.reduce((a, b) => a + b, 0) / percentages.length
    const standardDeviation = Math.sqrt(variance)
    
    return {
      studentsCount: percentages.length,
      averagePercentage: Math.round(average * 100) / 100,
      highestPercentage: highest,
      lowestPercentage: lowest,
      medianPercentage: median,
      standardDeviation: Math.round(standardDeviation * 100) / 100
    }
  }

  /**
   * Calculate grade distribution
   */
  static calculateGradeDistribution(result: Result): Record<string, number> {
    const studentResults = result.getStudentResults()
    const gradeCount: Record<string, number> = {
      'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0, 'F': 0
    }
    
    studentResults.forEach(studentResult => {
      const grade = studentResult.percentage.getLetterGrade()
      gradeCount[grade] = (gradeCount[grade] || 0) + 1
    })
    
    return gradeCount
  }

  /**
   * Calculate total marks distribution
   */
  static calculateMarksDistribution(result: Result, ranges: number[] = [0, 40, 60, 75, 90, 100]): Record<string, number> {
    const studentResults = result.getStudentResults()
    const distribution: Record<string, number> = {}
    
    // Initialize ranges
    for (let i = 0; i < ranges.length - 1; i++) {
      const rangeKey = `${ranges[i]}-${ranges[i + 1]}%`
      distribution[rangeKey] = 0
    }
    
    studentResults.forEach(studentResult => {
      const percentage = studentResult.percentage.getValue()
      
      for (let i = 0; i < ranges.length - 1; i++) {
        if (percentage >= ranges[i] && percentage < ranges[i + 1]) {
          const rangeKey = `${ranges[i]}-${ranges[i + 1]}%`
          distribution[rangeKey]++
          break
        }
      }
      
      // Handle 100% case
      if (percentage === 100) {
        const lastRangeKey = `${ranges[ranges.length - 2]}-${ranges[ranges.length - 1]}%`
        distribution[lastRangeKey]++
      }
    })
    
    return distribution
  }
}
