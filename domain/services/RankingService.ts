import { Result, StudentResult } from '../entities/Result'

/**
 * Pure functions for student ranking calculations
 */
export class RankingService {
  
  /**
   * Rank students by total percentage (primary) and total marks (secondary)
   */
  static rankByPercentage(studentResults: StudentResult[]): StudentResult[] {
    const rankedStudents = [...studentResults]
    
    // Sort by percentage (descending), then by total marks (descending)
    rankedStudents.sort((a, b) => {
      const percentageDiff = b.percentage.getValue() - a.percentage.getValue()
      if (percentageDiff !== 0) return percentageDiff
      return b.totalMarks.getValue() - a.totalMarks.getValue()
    })
    
    // Assign ranks (handle ties with dense ranking)
    // Dense ranking: #1, #1, #1, #2, #2, #3... (ties don't skip ranks)
    let currentRank = 1
    for (let i = 0; i < rankedStudents.length; i++) {
      if (i > 0) {
        const current = rankedStudents[i]
        const previous = rankedStudents[i - 1]
        
        // If different percentage or different total marks, increment rank by 1
        if (current.percentage.getValue() !== previous.percentage.getValue() ||
            current.totalMarks.getValue() !== previous.totalMarks.getValue()) {
          currentRank++
        }
        // If same percentage AND same marks, keep same rank (tie)
      }
      
      rankedStudents[i].rank = currentRank
    }
    
    return rankedStudents
  }

  /**
   * Rank students by specific subject marks
   */
  static rankBySubject(studentResults: StudentResult[], subjectName: string): StudentResult[] {
    const studentsWithSubject = studentResults.filter(sr => sr.marks.has(subjectName))
    
    // Sort by subject marks (descending)
    studentsWithSubject.sort((a, b) => {
      const aMarks = a.marks.get(subjectName)?.getValue() || 0
      const bMarks = b.marks.get(subjectName)?.getValue() || 0
      return bMarks - aMarks
    })
    
    // Assign ranks (handle ties with dense ranking)
    let currentRank = 1
    for (let i = 0; i < studentsWithSubject.length; i++) {
      if (i > 0) {
        const currentMarks = studentsWithSubject[i].marks.get(subjectName)?.getValue() || 0
        const previousMarks = studentsWithSubject[i - 1].marks.get(subjectName)?.getValue() || 0
        
        if (currentMarks !== previousMarks) {
          currentRank++
        }
      }
      
      // Create a temporary rank property for subject ranking
      (studentsWithSubject[i] as any).subjectRank = currentRank
    }
    
    return studentsWithSubject
  }

  /**
   * Get top N students by overall performance
   */
  static getTopStudents(result: Result, count: number = 10): StudentResult[] {
    const rankedStudents = this.rankByPercentage(result.getStudentResults())
    return rankedStudents.slice(0, count)
  }

  /**
   * Get bottom N students by overall performance
   */
  static getBottomStudents(result: Result, count: number = 10): StudentResult[] {
    const rankedStudents = this.rankByPercentage(result.getStudentResults())
    return rankedStudents.slice(-count).reverse() // Reverse to show worst first
  }

  /**
   * Get students in specific rank range
   */
  static getStudentsByRankRange(result: Result, startRank: number, endRank: number): StudentResult[] {
    const rankedStudents = this.rankByPercentage(result.getStudentResults())
    
    return rankedStudents.filter(student => {
      const rank = student.rank || 0
      return rank >= startRank && rank <= endRank
    })
  }

  /**
   * Calculate rank percentile for a student
   */
  static calculatePercentile(studentResult: StudentResult, allResults: StudentResult[]): number {
    const rank = studentResult.rank || 0
    const totalStudents = allResults.length
    
    if (totalStudents === 0 || rank === 0) return 0
    
    // Percentile = ((Total students - Rank) / Total students) * 100
    return ((totalStudents - rank + 1) / totalStudents) * 100
  }

  /**
   * Get students who improved or declined compared to previous result
   */
  static compareWithPreviousResult(
    currentResult: Result, 
    previousResult: Result
  ): {
    improved: Array<{student: StudentResult, rankChange: number}>
    declined: Array<{student: StudentResult, rankChange: number}>
    maintained: Array<{student: StudentResult, rank: number}>
  } {
    const currentRanked = this.rankByPercentage(currentResult.getStudentResults())
    const previousRanked = this.rankByPercentage(previousResult.getStudentResults())
    
    const improved: Array<{student: StudentResult, rankChange: number}> = []
    const declined: Array<{student: StudentResult, rankChange: number}> = []
    const maintained: Array<{student: StudentResult, rank: number}> = []
    
    currentRanked.forEach(currentStudent => {
      const rollNumber = currentStudent.student.getRollNumber()
      const previousStudent = previousRanked.find(ps => 
        ps.student.getRollNumber() === rollNumber
      )
      
      if (previousStudent) {
        const currentRank = currentStudent.rank || 0
        const previousRank = previousStudent.rank || 0
        const rankChange = previousRank - currentRank // Positive if improved
        
        if (rankChange > 0) {
          improved.push({ student: currentStudent, rankChange })
        } else if (rankChange < 0) {
          declined.push({ student: currentStudent, rankChange: Math.abs(rankChange) })
        } else {
          maintained.push({ student: currentStudent, rank: currentRank })
        }
      }
    })
    
    return { improved, declined, maintained }
  }

  /**
   * Find students with consistent performance (low rank variance)
   */
  static findConsistentPerformers(results: Result[], varianceThreshold: number = 5): {
    student: string // Roll number
    ranks: number[]
    variance: number
  }[] {
    if (results.length < 2) return []
    
    const studentRankHistory: Map<string, number[]> = new Map()
    
    // Collect rank history for each student
    results.forEach(result => {
      const rankedStudents = this.rankByPercentage(result.getStudentResults())
      rankedStudents.forEach(studentResult => {
        const rollNumber = studentResult.student.getRollNumber()
        const rank = studentResult.rank || 0
        
        if (!studentRankHistory.has(rollNumber)) {
          studentRankHistory.set(rollNumber, [])
        }
        studentRankHistory.get(rollNumber)?.push(rank)
      })
    })
    
    // Calculate variance for students who appeared in all results
    const consistentPerformers: {student: string, ranks: number[], variance: number}[] = []
    
    studentRankHistory.forEach((ranks, rollNumber) => {
      if (ranks.length === results.length) { // Student appeared in all results
        const average = ranks.reduce((a, b) => a + b, 0) / ranks.length
        const variance = ranks.reduce((sum, rank) => sum + Math.pow(rank - average, 2), 0) / ranks.length
        
        if (variance <= varianceThreshold) {
          consistentPerformers.push({
            student: rollNumber,
            ranks,
            variance: Math.round(variance * 100) / 100
          })
        }
      }
    })
    
    // Sort by lowest variance (most consistent)
    consistentPerformers.sort((a, b) => a.variance - b.variance)
    
    return consistentPerformers
  }

  /**
   * Calculate rank distribution statistics
   */
  static calculateRankDistribution(result: Result): {
    topQuartile: number // Students in top 25%
    secondQuartile: number // Students in 25-50%
    thirdQuartile: number // Students in 50-75%
    bottomQuartile: number // Students in bottom 25%
  } {
    const totalStudents = result.getStudentCount()
    
    if (totalStudents === 0) {
      return {
        topQuartile: 0,
        secondQuartile: 0,
        thirdQuartile: 0,
        bottomQuartile: 0
      }
    }
    
    const quartileSize = Math.ceil(totalStudents / 4)
    
    return {
      topQuartile: Math.min(quartileSize, totalStudents),
      secondQuartile: Math.min(quartileSize, Math.max(0, totalStudents - quartileSize)),
      thirdQuartile: Math.min(quartileSize, Math.max(0, totalStudents - 2 * quartileSize)),
      bottomQuartile: Math.min(quartileSize, Math.max(0, totalStudents - 3 * quartileSize))
    }
  }
}
