import { Result, StudentResult } from '../entities/Result'
import { Percentage } from '../value-objects/Percentage'

/**
 * Pure functions for analytics and insights generation
 */
export class AnalyticsService {
  
  /**
   * Calculate pass/fail rates for the entire class
   */
  static calculatePassFailRates(result: Result, passingPercentage: number = 40): {
    totalStudents: number
    passed: number
    failed: number
    passPercentage: Percentage
    failPercentage: Percentage
  } {
    const studentResults = result.getStudentResults()
    const totalStudents = studentResults.length
    
    if (totalStudents === 0) {
      return {
        totalStudents: 0,
        passed: 0,
        failed: 0,
        passPercentage: Percentage.zero(),
        failPercentage: Percentage.zero()
      }
    }
    
    const passed = studentResults.filter(sr => 
      sr.percentage.getValue() >= passingPercentage
    ).length
    const failed = totalStudents - passed
    
    return {
      totalStudents,
      passed,
      failed,
      passPercentage: Percentage.fromFraction(passed, totalStudents),
      failPercentage: Percentage.fromFraction(failed, totalStudents)
    }
  }

  /**
   * Calculate pass/fail rates for each subject
   */
  static calculateSubjectPassFailRates(result: Result, passingMarks: number = 40): Record<string, {
    totalStudents: number
    passed: number
    failed: number
    passPercentage: Percentage
    subjectName: string
  }> {
    const subjects = result.getSubjects()
    const studentResults = result.getStudentResults()
    const rates: Record<string, any> = {}
    
    subjects.forEach(subject => {
      const subjectName = subject.getName()
      const totalStudents = studentResults.length
      
      if (totalStudents === 0) {
        rates[subjectName] = {
          totalStudents: 0,
          passed: 0,
          failed: 0,
          passPercentage: Percentage.zero(),
          subjectName
        }
        return
      }
      
      const passed = studentResults.filter(sr => {
        const marks = sr.marks.get(subjectName)
        return marks && marks.getValue() >= passingMarks
      }).length
      
      const failed = totalStudents - passed
      
      rates[subjectName] = {
        totalStudents,
        passed,
        failed,
        passPercentage: Percentage.fromFraction(passed, totalStudents),
        subjectName
      }
    })
    
    return rates
  }

  /**
   * Identify struggling students (multiple subject failures)
   */
  static identifyStrugglingStudents(result: Result, passingMarks: number = 40, minFailures: number = 2): {
    student: StudentResult
    failedSubjects: string[]
    totalFailures: number
  }[] {
    const studentResults = result.getStudentResults()
    const strugglingStudents: {
      student: StudentResult
      failedSubjects: string[]
      totalFailures: number
    }[] = []
    
    studentResults.forEach(studentResult => {
      const failedSubjects: string[] = []
      
      studentResult.marks.forEach((marks, subjectName) => {
        if (marks.getValue() < passingMarks) {
          failedSubjects.push(subjectName)
        }
      })
      
      if (failedSubjects.length >= minFailures) {
        strugglingStudents.push({
          student: studentResult,
          failedSubjects,
          totalFailures: failedSubjects.length
        })
      }
    })
    
    // Sort by number of failures (descending)
    strugglingStudents.sort((a, b) => b.totalFailures - a.totalFailures)
    
    return strugglingStudents
  }

  /**
   * Identify high-performing students
   */
  static identifyHighPerformers(result: Result, excellenceThreshold: number = 85): {
    student: StudentResult
    excellentSubjects: string[]
    overallGrade: string
  }[] {
    const studentResults = result.getStudentResults()
    const highPerformers: {
      student: StudentResult
      excellentSubjects: string[]
      overallGrade: string
    }[] = []
    
    studentResults.forEach(studentResult => {
      const excellentSubjects: string[] = []
      
      studentResult.marks.forEach((marks, subjectName) => {
        if (marks.getValue() >= excellenceThreshold) {
          excellentSubjects.push(subjectName)
        }
      })
      
      // Consider high performers if they excel in at least half subjects or have overall A grade
      const totalSubjects = studentResult.marks.size
      const overallGrade = studentResult.percentage.getLetterGrade()
      
      if (excellentSubjects.length >= Math.ceil(totalSubjects / 2) || 
          overallGrade === 'A+' || overallGrade === 'A') {
        highPerformers.push({
          student: studentResult,
          excellentSubjects,
          overallGrade
        })
      }
    })
    
    // Sort by overall percentage (descending)
    highPerformers.sort((a, b) => 
      b.student.percentage.getValue() - a.student.percentage.getValue()
    )
    
    return highPerformers
  }

  /**
   * Analyze subject difficulty based on class performance
   */
  static analyzeSubjectDifficulty(result: Result): {
    subjectName: string
    averageMarks: number
    passRate: Percentage
    difficulty: 'Easy' | 'Moderate' | 'Difficult' | 'Very Difficult'
    studentsCount: number
  }[] {
    const subjects = result.getSubjects()
    const analysis: any[] = []
    
    subjects.forEach(subject => {
      const subjectName = subject.getName()
      const studentResults = result.getStudentResults()
      
      // Calculate average marks
      const totalMarks = studentResults.reduce((sum, sr) => {
        const marks = sr.marks.get(subjectName)
        return sum + (marks?.getValue() || 0)
      }, 0)
      
      const averageMarks = studentResults.length > 0 ? totalMarks / studentResults.length : 0
      
      // Calculate pass rate
      const passedCount = studentResults.filter(sr => {
        const marks = sr.marks.get(subjectName)
        return marks && marks.getValue() >= 40
      }).length
      
      const passRate = studentResults.length > 0 
        ? Percentage.fromFraction(passedCount, studentResults.length)
        : Percentage.zero()
      
      // Determine difficulty
      let difficulty: 'Easy' | 'Moderate' | 'Difficult' | 'Very Difficult'
      const passPercentage = passRate.getValue()
      
      if (passPercentage >= 90 && averageMarks >= 75) {
        difficulty = 'Easy'
      } else if (passPercentage >= 75 && averageMarks >= 60) {
        difficulty = 'Moderate'
      } else if (passPercentage >= 50 && averageMarks >= 45) {
        difficulty = 'Difficult'
      } else {
        difficulty = 'Very Difficult'
      }
      
      analysis.push({
        subjectName,
        averageMarks: Math.round(averageMarks * 100) / 100,
        passRate,
        difficulty,
        studentsCount: studentResults.length
      })
    })
    
    // Sort by difficulty (easiest first)
    const difficultyOrder: Record<'Easy' | 'Moderate' | 'Difficult' | 'Very Difficult', number> = { 
      'Easy': 0, 
      'Moderate': 1, 
      'Difficult': 2, 
      'Very Difficult': 3 
    }
    analysis.sort((a, b) => {
      const aOrder = difficultyOrder[a.difficulty as keyof typeof difficultyOrder]
      const bOrder = difficultyOrder[b.difficulty as keyof typeof difficultyOrder]
      return aOrder - bOrder
    })
    
    return analysis
  }

  /**
   * Generate performance insights
   */
  static generatePerformanceInsights(result: Result): {
    classPerformance: 'Excellent' | 'Good' | 'Average' | 'Below Average' | 'Poor'
    keyInsights: string[]
    recommendations: string[]
    statistics: {
      totalStudents: number
      classAverage: number
      topPerformers: number
      strugglingStudents: number
      mostDifficultSubject: string
      easiestSubject: string
    }
  } {
    const studentResults = result.getStudentResults()
    const totalStudents = studentResults.length
    
    if (totalStudents === 0) {
      return {
        classPerformance: 'Poor',
        keyInsights: ['No student data available'],
        recommendations: ['Upload student results to get insights'],
        statistics: {
          totalStudents: 0,
          classAverage: 0,
          topPerformers: 0,
          strugglingStudents: 0,
          mostDifficultSubject: '',
          easiestSubject: ''
        }
      }
    }
    
    // Calculate class average
    const classAverage = studentResults.reduce((sum, sr) => sum + sr.percentage.getValue(), 0) / totalStudents
    
    // Determine class performance
    let classPerformance: 'Excellent' | 'Good' | 'Average' | 'Below Average' | 'Poor'
    if (classAverage >= 85) classPerformance = 'Excellent'
    else if (classAverage >= 70) classPerformance = 'Good'
    else if (classAverage >= 55) classPerformance = 'Average'
    else if (classAverage >= 40) classPerformance = 'Below Average'
    else classPerformance = 'Poor'
    
    // Count top performers and struggling students
    const topPerformers = this.identifyHighPerformers(result).length
    const strugglingStudents = this.identifyStrugglingStudents(result).length
    
    // Analyze subjects
    const subjectAnalysis = this.analyzeSubjectDifficulty(result)
    const mostDifficultSubject = subjectAnalysis[subjectAnalysis.length - 1]?.subjectName || ''
    const easiestSubject = subjectAnalysis[0]?.subjectName || ''
    
    // Generate insights
    const keyInsights: string[] = []
    const recommendations: string[] = []
    
    keyInsights.push(`Class average is ${classAverage.toFixed(1)}% (${classPerformance})`)
    
    if (topPerformers > 0) {
      keyInsights.push(`${topPerformers} students (${Math.round(topPerformers/totalStudents*100)}%) are high performers`)
    }
    
    if (strugglingStudents > 0) {
      keyInsights.push(`${strugglingStudents} students (${Math.round(strugglingStudents/totalStudents*100)}%) need additional support`)
      recommendations.push('Provide extra coaching for struggling students')
    }
    
    if (mostDifficultSubject) {
      keyInsights.push(`${mostDifficultSubject} is the most challenging subject for students`)
      recommendations.push(`Focus on improving teaching methods for ${mostDifficultSubject}`)
    }
    
    if (classAverage < 60) {
      recommendations.push('Consider reviewing curriculum difficulty and teaching pace')
      recommendations.push('Implement regular assessment and feedback cycles')
    }
    
    if (topPerformers > totalStudents * 0.3) {
      recommendations.push('Consider advanced learning opportunities for high performers')
    }
    
    return {
      classPerformance,
      keyInsights,
      recommendations,
      statistics: {
        totalStudents,
        classAverage: Math.round(classAverage * 100) / 100,
        topPerformers,
        strugglingStudents,
        mostDifficultSubject,
        easiestSubject
      }
    }
  }

  /**
   * Compare performance across multiple results (trends)
   */
  static analyzePerformanceTrends(results: Result[]): {
    trend: 'Improving' | 'Declining' | 'Stable'
    averageChange: number
    insights: string[]
  } {
    if (results.length < 2) {
      return {
        trend: 'Stable',
        averageChange: 0,
        insights: ['Need at least two results to analyze trends']
      }
    }
    
    const averages = results.map(result => {
      const studentResults = result.getStudentResults()
      return studentResults.length > 0 
        ? studentResults.reduce((sum, sr) => sum + sr.percentage.getValue(), 0) / studentResults.length
        : 0
    })
    
    // Calculate trend
    const firstAverage = averages[0]
    const lastAverage = averages[averages.length - 1]
    const averageChange = lastAverage - firstAverage
    
    let trend: 'Improving' | 'Declining' | 'Stable'
    if (averageChange > 5) trend = 'Improving'
    else if (averageChange < -5) trend = 'Declining'
    else trend = 'Stable'
    
    // Generate insights
    const insights: string[] = []
    
    if (trend === 'Improving') {
      insights.push(`Class performance has improved by ${averageChange.toFixed(1)}% over time`)
    } else if (trend === 'Declining') {
      insights.push(`Class performance has declined by ${Math.abs(averageChange).toFixed(1)}% over time`)
    } else {
      insights.push('Class performance has remained relatively stable')
    }
    
    // Find best and worst periods
    const maxAverage = Math.max(...averages)
    const minAverage = Math.min(...averages)
    
    if (maxAverage - minAverage > 10) {
      insights.push(`Performance varies significantly across periods (${minAverage.toFixed(1)}% to ${maxAverage.toFixed(1)}%)`)
    }
    
    return {
      trend,
      averageChange: Math.round(averageChange * 100) / 100,
      insights
    }
  }
}
