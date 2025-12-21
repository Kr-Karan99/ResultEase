import { AnalyticsService } from '../../../domain/services/AnalyticsService'
import { Result } from '../../../domain/entities/Result'
import { Subject } from '../../../domain/entities/Subject'

describe('AnalyticsService', () => {
  let testResult: Result
  
  beforeEach(() => {
    // Create comprehensive test data
    const subjects = [
      new Subject('Mathematics', 100),
      new Subject('Science', 100),
      new Subject('English', 100)
    ]
    
    const studentData = [
      {
        name: 'Excellent Student',
        rollNumber: '001',
        marks: {
          'Mathematics': 95,
          'Science': 92,
          'English': 88
        }
      },
      {
        name: 'Good Student',
        rollNumber: '002',
        marks: {
          'Mathematics': 78,
          'Science': 82,
          'English': 76
        }
      },
      {
        name: 'Average Student',
        rollNumber: '003',
        marks: {
          'Mathematics': 65,
          'Science': 68,
          'English': 62
        }
      },
      {
        name: 'Struggling Student',
        rollNumber: '004',
        marks: {
          'Mathematics': 35,
          'Science': 38,
          'English': 42
        }
      },
      {
        name: 'Failed Student',
        rollNumber: '005',
        marks: {
          'Mathematics': 25,
          'Science': 28,
          'English': 32
        }
      }
    ]
    
    testResult = Result.fromRawData({
      id: 'analytics-test',
      title: 'Analytics Test Result',
      subjects: subjects.map(s => s.getName()),
      studentData
    })
  })

  describe('calculatePassFailRates', () => {
    it('should calculate pass/fail rates with default threshold (40%)', () => {
      const rates = AnalyticsService.calculatePassFailRates(testResult)
      
      expect(rates.totalStudents).toBe(5)
      expect(rates.passed).toBe(3) // Students 1, 2, 3
      expect(rates.failed).toBe(2) // Students 4, 5
      expect(rates.passPercentage.getValue()).toBe(60) // 3/5 * 100
      expect(rates.failPercentage.getValue()).toBe(40) // 2/5 * 100
    })

    it('should calculate pass/fail rates with custom threshold', () => {
      const rates = AnalyticsService.calculatePassFailRates(testResult, 70)
      
      expect(rates.totalStudents).toBe(5)
      expect(rates.passed).toBe(2) // Only top 2 students pass with 70% threshold
      expect(rates.failed).toBe(3)
      expect(rates.passPercentage.getValue()).toBe(40) // 2/5 * 100
      expect(rates.failPercentage.getValue()).toBe(60) // 3/5 * 100
    })

    it('should handle empty result', () => {
      const emptyResult = new Result('empty', 'Empty', [new Subject('Math')])
      const rates = AnalyticsService.calculatePassFailRates(emptyResult)
      
      expect(rates.totalStudents).toBe(0)
      expect(rates.passed).toBe(0)
      expect(rates.failed).toBe(0)
      expect(rates.passPercentage.getValue()).toBe(0)
      expect(rates.failPercentage.getValue()).toBe(0)
    })

    it('should handle all students passing', () => {
      const subjects = [new Subject('Math', 100)]
      const studentData = [
        { name: 'Student A', rollNumber: '001', marks: { 'Math': 80 } },
        { name: 'Student B', rollNumber: '002', marks: { 'Math': 90 } }
      ]
      
      const result = Result.fromRawData({
        id: 'all-pass',
        title: 'All Pass',
        subjects: ['Math'],
        studentData
      })
      
      const rates = AnalyticsService.calculatePassFailRates(result)
      expect(rates.passed).toBe(2)
      expect(rates.failed).toBe(0)
      expect(rates.passPercentage.getValue()).toBe(100)
    })
  })

  describe('calculateSubjectPassFailRates', () => {
    it('should calculate pass/fail rates for each subject', () => {
      const rates = AnalyticsService.calculateSubjectPassFailRates(testResult)
      
      expect(rates).toHaveProperty('Mathematics')
      expect(rates).toHaveProperty('Science')
      expect(rates).toHaveProperty('English')
      
      // Check Mathematics rates
      expect(rates.Mathematics.totalStudents).toBe(5)
      expect(rates.Mathematics.passed).toBe(3) // 95, 78, 65 >= 40
      expect(rates.Mathematics.failed).toBe(2) // 35, 25 < 40
      expect(rates.Mathematics.passPercentage.getValue()).toBe(60)
    })

    it('should use custom passing marks threshold', () => {
      const rates = AnalyticsService.calculateSubjectPassFailRates(testResult, 70)
      
      // With 70 as threshold, only top students should pass
      expect(rates.Mathematics.passed).toBe(2) // 95, 78 >= 70
      expect(rates.Mathematics.failed).toBe(3) // 65, 35, 25 < 70
    })

    it('should handle empty result', () => {
      const emptyResult = new Result('empty', 'Empty', [new Subject('Math')])
      const rates = AnalyticsService.calculateSubjectPassFailRates(emptyResult)
      
      expect(rates.Math.totalStudents).toBe(0)
      expect(rates.Math.passed).toBe(0)
      expect(rates.Math.failed).toBe(0)
    })
  })

  describe('identifyStrugglingStudents', () => {
    it('should identify students failing multiple subjects', () => {
      const struggling = AnalyticsService.identifyStrugglingStudents(testResult, 40, 2)
      
      expect(struggling).toHaveLength(2) // Students 4 and 5 fail multiple subjects
      
      const strugglingStudent = struggling.find(s => s.student.student.getName() === 'Struggling Student')
      expect(strugglingStudent?.failedSubjects).toHaveLength(2) // Math and Science < 40
      expect(strugglingStudent?.totalFailures).toBe(2)
      
      const failedStudent = struggling.find(s => s.student.student.getName() === 'Failed Student')
      expect(failedStudent?.failedSubjects).toHaveLength(3) // All subjects < 40
      expect(failedStudent?.totalFailures).toBe(3)
    })

    it('should use custom passing marks and minimum failures', () => {
      const struggling = AnalyticsService.identifyStrugglingStudents(testResult, 70, 1)
      
      // With 70% threshold, more students should be identified as struggling
      expect(struggling.length).toBeGreaterThan(2)
    })

    it('should sort by number of failures (descending)', () => {
      const struggling = AnalyticsService.identifyStrugglingStudents(testResult, 40, 2)
      
      if (struggling.length > 1) {
        expect(struggling[0].totalFailures).toBeGreaterThanOrEqual(struggling[1].totalFailures)
      }
    })

    it('should return empty array when no students meet criteria', () => {
      const struggling = AnalyticsService.identifyStrugglingStudents(testResult, 20, 5)
      expect(struggling).toEqual([])
    })

    it('should handle empty result', () => {
      const emptyResult = new Result('empty', 'Empty', [new Subject('Math')])
      const struggling = AnalyticsService.identifyStrugglingStudents(emptyResult)
      expect(struggling).toEqual([])
    })
  })

  describe('identifyHighPerformers', () => {
    it('should identify high-performing students', () => {
      const highPerformers = AnalyticsService.identifyHighPerformers(testResult, 85)
      
      expect(highPerformers).toHaveLength(1) // Only 'Excellent Student' meets criteria
      
      const topPerformer = highPerformers[0]
      expect(topPerformer.student.student.getName()).toBe('Excellent Student')
      expect(topPerformer.excellentSubjects.length).toBeGreaterThan(0)
      expect(topPerformer.overallGrade).toMatch(/A\+?/)
    })

    it('should use custom excellence threshold', () => {
      const highPerformers = AnalyticsService.identifyHighPerformers(testResult, 70)
      
      // With lower threshold, more students should qualify
      expect(highPerformers.length).toBeGreaterThan(1)
    })

    it('should sort by overall percentage (descending)', () => {
      const highPerformers = AnalyticsService.identifyHighPerformers(testResult, 60)
      
      if (highPerformers.length > 1) {
        const first = highPerformers[0].student.percentage.getValue()
        const second = highPerformers[1].student.percentage.getValue()
        expect(first).toBeGreaterThanOrEqual(second)
      }
    })

    it('should include students with A grades even without excellent subjects', () => {
      // Test edge case where student has A grade but no subjects above excellence threshold
      const subjects = [new Subject('Math', 100)]
      const studentData = [
        { name: 'A Grade Student', rollNumber: '001', marks: { 'Math': 82 } } // 82% = A grade but < 85 threshold
      ]
      
      const result = Result.fromRawData({
        id: 'a-grade-test',
        title: 'A Grade Test',
        subjects: ['Math'],
        studentData
      })
      
      const highPerformers = AnalyticsService.identifyHighPerformers(result, 85)
      expect(highPerformers).toHaveLength(1) // Should include due to A grade
    })

    it('should return empty array when no students meet criteria', () => {
      // Create a result with students who don't have A+ grades
      const lowGradeStudentData = [
        {
          name: 'Average Student 1',
          rollNumber: '001',
          marks: { 'Mathematics': 65, 'Science': 68, 'English': 62 }
        },
        {
          name: 'Average Student 2',
          rollNumber: '002',
          marks: { 'Mathematics': 60, 'Science': 63, 'English': 65 }
        }
      ]
      
      const averageResult = Result.fromRawData({
        id: 'average-test-result',
        title: 'Average Test Result',
        subjects: ['Mathematics', 'Science', 'English'],
        studentData: lowGradeStudentData
      })
      
      const highPerformers = AnalyticsService.identifyHighPerformers(averageResult, 85)
      expect(highPerformers).toEqual([])
    })
  })

  describe('analyzeSubjectDifficulty', () => {
    it('should analyze and classify subject difficulty', () => {
      const analysis = AnalyticsService.analyzeSubjectDifficulty(testResult)
      
      expect(analysis).toHaveLength(3) // One for each subject
      
      analysis.forEach(subject => {
        expect(subject).toHaveProperty('subjectName')
        expect(subject).toHaveProperty('averageMarks')
        expect(subject).toHaveProperty('passRate')
        expect(subject).toHaveProperty('difficulty')
        expect(subject).toHaveProperty('studentsCount')
        
        expect(['Easy', 'Moderate', 'Difficult', 'Very Difficult']).toContain(subject.difficulty)
        expect(subject.studentsCount).toBe(5)
      })
    })

    it('should sort subjects by difficulty (easiest first)', () => {
      const analysis = AnalyticsService.analyzeSubjectDifficulty(testResult)
      
      const difficultyOrder = { 'Easy': 0, 'Moderate': 1, 'Difficult': 2, 'Very Difficult': 3 }
      
      for (let i = 1; i < analysis.length; i++) {
        const prevDifficulty = difficultyOrder[analysis[i-1].difficulty]
        const currDifficulty = difficultyOrder[analysis[i].difficulty]
        expect(currDifficulty).toBeGreaterThanOrEqual(prevDifficulty)
      }
    })

    it('should correctly classify easy subjects', () => {
      // Create a result where all students perform well
      const subjects = [new Subject('Easy Math', 100)]
      const studentData = [
        { name: 'Student A', rollNumber: '001', marks: { 'Easy Math': 90 } },
        { name: 'Student B', rollNumber: '002', marks: { 'Easy Math': 95 } },
        { name: 'Student C', rollNumber: '003', marks: { 'Easy Math': 88 } }
      ]
      
      const result = Result.fromRawData({
        id: 'easy-test',
        title: 'Easy Test',
        subjects: ['Easy Math'],
        studentData
      })
      
      const analysis = AnalyticsService.analyzeSubjectDifficulty(result)
      expect(analysis[0].difficulty).toBe('Easy')
    })

    it('should handle empty result', () => {
      const emptyResult = new Result('empty', 'Empty', [new Subject('Math')])
      const analysis = AnalyticsService.analyzeSubjectDifficulty(emptyResult)
      
      expect(analysis).toHaveLength(1)
      expect(analysis[0].averageMarks).toBe(0)
      expect(analysis[0].passRate.getValue()).toBe(0)
      expect(analysis[0].studentsCount).toBe(0)
    })
  })

  describe('generatePerformanceInsights', () => {
    it('should generate comprehensive performance insights', () => {
      const insights = AnalyticsService.generatePerformanceInsights(testResult)
      
      expect(insights).toHaveProperty('classPerformance')
      expect(insights).toHaveProperty('keyInsights')
      expect(insights).toHaveProperty('recommendations')
      expect(insights).toHaveProperty('statistics')
      
      expect(['Excellent', 'Good', 'Average', 'Below Average', 'Poor']).toContain(insights.classPerformance)
      
      expect(Array.isArray(insights.keyInsights)).toBe(true)
      expect(Array.isArray(insights.recommendations)).toBe(true)
      expect(insights.keyInsights.length).toBeGreaterThan(0)
      
      expect(insights.statistics.totalStudents).toBe(5)
      expect(insights.statistics.classAverage).toBeGreaterThan(0)
      expect(insights.statistics.topPerformers).toBeGreaterThanOrEqual(0)
      expect(insights.statistics.strugglingStudents).toBeGreaterThanOrEqual(0)
    })

    it('should provide appropriate recommendations based on performance', () => {
      const insights = AnalyticsService.generatePerformanceInsights(testResult)
      
      // Should have recommendations for struggling students
      const hasStrugglingSupportRecommendation = insights.recommendations.some(rec => 
        rec.toLowerCase().includes('struggling') || rec.toLowerCase().includes('support')
      )
      expect(hasStrugglingSupportRecommendation).toBe(true)
    })

    it('should handle excellent class performance', () => {
      // Create a class with all excellent students
      const subjects = [new Subject('Math', 100)]
      const studentData = [
        { name: 'Student A', rollNumber: '001', marks: { 'Math': 95 } },
        { name: 'Student B', rollNumber: '002', marks: { 'Math': 92 } },
        { name: 'Student C', rollNumber: '003', marks: { 'Math': 88 } }
      ]
      
      const result = Result.fromRawData({
        id: 'excellent-test',
        title: 'Excellent Test',
        subjects: ['Math'],
        studentData
      })
      
      const insights = AnalyticsService.generatePerformanceInsights(result)
      expect(insights.classPerformance).toBe('Excellent')
    })

    it('should handle empty result gracefully', () => {
      const emptyResult = new Result('empty', 'Empty', [new Subject('Math')])
      const insights = AnalyticsService.generatePerformanceInsights(emptyResult)
      
      expect(insights.classPerformance).toBe('Poor')
      expect(insights.keyInsights).toContain('No student data available')
      expect(insights.recommendations).toContain('Upload student results to get insights')
      expect(insights.statistics.totalStudents).toBe(0)
    })
  })

  describe('analyzePerformanceTrends', () => {
    it('should analyze trends across multiple results', () => {
      // Create a second result with improved performance
      const improvedStudentData = [
        { name: 'Excellent Student', rollNumber: '001', marks: { 'Mathematics': 98, 'Science': 95, 'English': 90 } },
        { name: 'Good Student', rollNumber: '002', marks: { 'Mathematics': 82, 'Science': 85, 'English': 80 } },
        { name: 'Average Student', rollNumber: '003', marks: { 'Mathematics': 70, 'Science': 72, 'English': 68 } },
        { name: 'Struggling Student', rollNumber: '004', marks: { 'Mathematics': 45, 'Science': 48, 'English': 50 } },
        { name: 'Failed Student', rollNumber: '005', marks: { 'Mathematics': 35, 'Science': 38, 'English': 42 } }
      ]
      
      const improvedResult = Result.fromRawData({
        id: 'improved-test',
        title: 'Improved Test',
        subjects: ['Mathematics', 'Science', 'English'],
        studentData: improvedStudentData
      })
      
      const trends = AnalyticsService.analyzePerformanceTrends([testResult, improvedResult])
      
      expect(trends.trend).toBe('Improving')
      expect(trends.averageChange).toBeGreaterThan(0)
      expect(trends.insights.length).toBeGreaterThan(0)
    })

    it('should detect declining performance', () => {
      // Create a result with worse performance
      const decliningStudentData = [
        { name: 'Excellent Student', rollNumber: '001', marks: { 'Mathematics': 85, 'Science': 82, 'English': 78 } },
        { name: 'Good Student', rollNumber: '002', marks: { 'Mathematics': 65, 'Science': 68, 'English': 62 } },
        { name: 'Average Student', rollNumber: '003', marks: { 'Mathematics': 50, 'Science': 52, 'English': 48 } },
        { name: 'Struggling Student', rollNumber: '004', marks: { 'Mathematics': 25, 'Science': 28, 'English': 32 } },
        { name: 'Failed Student', rollNumber: '005', marks: { 'Mathematics': 15, 'Science': 18, 'English': 22 } }
      ]
      
      const decliningResult = Result.fromRawData({
        id: 'declining-test',
        title: 'Declining Test', 
        subjects: ['Mathematics', 'Science', 'English'],
        studentData: decliningStudentData
      })
      
      const trends = AnalyticsService.analyzePerformanceTrends([testResult, decliningResult])
      
      expect(trends.trend).toBe('Declining')
      expect(trends.averageChange).toBeLessThan(0)
    })

    it('should handle single result', () => {
      const trends = AnalyticsService.analyzePerformanceTrends([testResult])
      
      expect(trends.trend).toBe('Stable')
      expect(trends.averageChange).toBe(0)
      expect(trends.insights).toContain('Need at least two results to analyze trends')
    })

    it('should detect stable performance', () => {
      // Create a result with nearly identical performance
      const stableResult = Result.fromRawData({
        id: 'stable-test',
        title: 'Stable Test',
        subjects: ['Mathematics', 'Science', 'English'],
        studentData: testResult.toExportData().studentResults.map(sr => ({
          name: sr.student.name,
          rollNumber: sr.student.rollNumber,
          marks: sr.marks
        }))
      })
      
      const trends = AnalyticsService.analyzePerformanceTrends([testResult, stableResult])
      
      expect(trends.trend).toBe('Stable')
      expect(Math.abs(trends.averageChange)).toBeLessThan(5)
    })
  })
})
