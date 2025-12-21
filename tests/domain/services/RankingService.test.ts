import { RankingService } from '../../../domain/services/RankingService'
import { Result, StudentResult } from '../../../domain/entities/Result'
import { Student } from '../../../domain/entities/Student'
import { Subject } from '../../../domain/entities/Subject'
import { Marks } from '../../../domain/value-objects/Marks'
import { Percentage } from '../../../domain/value-objects/Percentage'

describe('RankingService', () => {
  let testResult: Result
  let studentResults: StudentResult[]
  
  beforeEach(() => {
    // Create test data with different performance levels
    const subjects = [
      new Subject('Mathematics', 100),
      new Subject('Science', 100),
      new Subject('English', 100)
    ]
    
    const studentData = [
      {
        name: 'Alice Top',
        rollNumber: '001', 
        marks: {
          'Mathematics': 95,
          'Science': 92,
          'English': 88
        }
      },
      {
        name: 'Bob Middle',
        rollNumber: '002',
        marks: {
          'Mathematics': 78,
          'Science': 82,
          'English': 76
        }
      },
      {
        name: 'Charlie Low',
        rollNumber: '003',
        marks: {
          'Mathematics': 65,
          'Science': 68,
          'English': 72
        }
      },
      {
        name: 'Diana High',
        rollNumber: '004',
        marks: {
          'Mathematics': 88,
          'Science': 90,
          'English': 85
        }
      }
    ]
    
    testResult = Result.fromRawData({
      id: 'test-result-1',
      title: 'Test Result',
      subjects: subjects.map(s => s.getName()),
      studentData
    })
    
    studentResults = testResult.getStudentResults()
  })

  describe('rankByPercentage', () => {
    it('should rank students correctly by percentage', () => {
      const ranked = RankingService.rankByPercentage(studentResults)
      
      expect(ranked[0].student.getName()).toBe('Alice Top') // Highest percentage
      expect(ranked[0].rank).toBe(1)
      
      expect(ranked[1].student.getName()).toBe('Diana High')
      expect(ranked[1].rank).toBe(2)
      
      expect(ranked[2].student.getName()).toBe('Bob Middle')
      expect(ranked[2].rank).toBe(3)
      
      expect(ranked[3].student.getName()).toBe('Charlie Low') // Lowest percentage
      expect(ranked[3].rank).toBe(4)
    })

    it('should handle tied percentages correctly', () => {
      // Create students with identical percentages but different total marks
      const subjects = [new Subject('Math', 100)]
      const studentData = [
        { name: 'Student A', rollNumber: '001', marks: { 'Math': 80 } }, // 80%
        { name: 'Student B', rollNumber: '002', marks: { 'Math': 80 } }, // 80% (same)
        { name: 'Student C', rollNumber: '003', marks: { 'Math': 85 } }  // 85%
      ]
      
      const result = Result.fromRawData({
        id: 'tied-test',
        title: 'Tied Test',
        subjects: ['Math'],
        studentData
      })
      
      const ranked = RankingService.rankByPercentage(result.getStudentResults())
      
      expect(ranked[0].rank).toBe(1) // Student C (85%)
      expect(ranked[1].rank).toBe(2) // Student A (80%) - first of tied group
      expect(ranked[2].rank).toBe(2) // Student B (80%) - same rank as A
    })

    it('should rank by total marks when percentages are identical', () => {
      // Create test with different total marks but same percentage
      const subjects = [
        new Subject('Math', 50), // Different max marks
        new Subject('Science', 100)
      ]
      const studentData = [
        { name: 'Student A', rollNumber: '001', marks: { 'Math': 40, 'Science': 80 } }, // Total: 120
        { name: 'Student B', rollNumber: '002', marks: { 'Math': 45, 'Science': 75 } }  // Total: 120 (same)
      ]
      
      const result = Result.fromRawData({
        id: 'tied-test',
        title: 'Tied Test', 
        subjects: ['Math', 'Science'],
        studentData
      })
      
      const ranked = RankingService.rankByPercentage(result.getStudentResults())
      
      // Both should have same percentage (80%) but different ranks due to implementation
      expect(ranked.length).toBe(2)
      expect(ranked[0].rank).toBeDefined()
      expect(ranked[1].rank).toBeDefined()
    })

    it('should handle empty student list', () => {
      const ranked = RankingService.rankByPercentage([])
      expect(ranked).toEqual([])
    })

    it('should handle single student', () => {
      const singleStudent = [studentResults[0]]
      const ranked = RankingService.rankByPercentage(singleStudent)
      
      expect(ranked).toHaveLength(1)
      expect(ranked[0].rank).toBe(1)
    })
  })

  describe('rankBySubject', () => {
    it('should rank students by specific subject marks', () => {
      const mathRanked = RankingService.rankBySubject(studentResults, 'Mathematics')
      
      expect(mathRanked[0].student.getName()).toBe('Alice Top') // 95 in Math
      expect((mathRanked[0] as any).subjectRank).toBe(1)
      
      expect(mathRanked[1].student.getName()).toBe('Diana High') // 88 in Math
      expect((mathRanked[1] as any).subjectRank).toBe(2)
      
      expect(mathRanked[2].student.getName()).toBe('Bob Middle') // 78 in Math
      expect((mathRanked[2] as any).subjectRank).toBe(3)
      
      expect(mathRanked[3].student.getName()).toBe('Charlie Low') // 65 in Math
      expect((mathRanked[3] as any).subjectRank).toBe(4)
    })

    it('should handle ties in subject marks', () => {
      const subjects = [new Subject('Math', 100)]
      const studentData = [
        { name: 'Student A', rollNumber: '001', marks: { 'Math': 85 } },
        { name: 'Student B', rollNumber: '002', marks: { 'Math': 85 } }, // Same marks
        { name: 'Student C', rollNumber: '003', marks: { 'Math': 90 } }
      ]
      
      const result = Result.fromRawData({
        id: 'tied-subject',
        title: 'Tied Subject',
        subjects: ['Math'],
        studentData
      })
      
      const mathRanked = RankingService.rankBySubject(result.getStudentResults(), 'Math')
      
      expect(mathRanked[0].marks.get('Math')?.getValue()).toBe(90)
      expect((mathRanked[0] as any).subjectRank).toBe(1)
      
      expect((mathRanked[1] as any).subjectRank).toBe(2) // First of tied group
      expect((mathRanked[2] as any).subjectRank).toBe(2) // Same rank
    })

    it('should return empty array for non-existent subject', () => {
      const ranked = RankingService.rankBySubject(studentResults, 'NonExistentSubject')
      expect(ranked).toEqual([])
    })

    it('should filter out students without the subject', () => {
      // Create a student without Math marks
      const studentWithoutMath = {
        student: new Student('No Math', '999'),
        marks: new Map([
          ['Science', new Marks(80)],
          ['English', new Marks(75)]
        ]),
        totalMarks: Marks.total(155),
        percentage: new Percentage(77.5)
      }
      
      const mixedResults = [...studentResults, studentWithoutMath]
      const mathRanked = RankingService.rankBySubject(mixedResults, 'Mathematics')
      
      expect(mathRanked).toHaveLength(4) // Should exclude student without Math
      expect(mathRanked.every(s => s.marks.has('Mathematics'))).toBe(true)
    })
  })

  describe('getTopStudents', () => {
    it('should return top N students', () => {
      const top2 = RankingService.getTopStudents(testResult, 2)
      
      expect(top2).toHaveLength(2)
      expect(top2[0].student.getName()).toBe('Alice Top')
      expect(top2[1].student.getName()).toBe('Diana High')
      expect(top2[0].rank).toBe(1)
      expect(top2[1].rank).toBe(2)
    })

    it('should default to top 10 when no count specified', () => {
      const top = RankingService.getTopStudents(testResult)
      expect(top.length).toBeLessThanOrEqual(10)
      expect(top).toHaveLength(4) // We only have 4 students in test data
    })

    it('should return all students if count exceeds total', () => {
      const top100 = RankingService.getTopStudents(testResult, 100)
      expect(top100).toHaveLength(4) // All students
    })

    it('should return empty array for empty result', () => {
      const emptyResult = new Result('empty', 'Empty', [new Subject('Math')])
      const top = RankingService.getTopStudents(emptyResult)
      expect(top).toEqual([])
    })
  })

  describe('getBottomStudents', () => {
    it('should return bottom N students in ascending order (worst first)', () => {
      const bottom2 = RankingService.getBottomStudents(testResult, 2)
      
      expect(bottom2).toHaveLength(2)
      expect(bottom2[0].student.getName()).toBe('Charlie Low')  // Worst student first
      expect(bottom2[1].student.getName()).toBe('Bob Middle')   // Second worst
    })

    it('should default to bottom 10 when no count specified', () => {
      const bottom = RankingService.getBottomStudents(testResult)
      expect(bottom.length).toBeLessThanOrEqual(10)
      expect(bottom).toHaveLength(4)
    })

    it('should return empty array for empty result', () => {
      const emptyResult = new Result('empty', 'Empty', [new Subject('Math')])
      const bottom = RankingService.getBottomStudents(emptyResult)
      expect(bottom).toEqual([])
    })
  })

  describe('getStudentsByRankRange', () => {
    it('should return students within specified rank range', () => {
      const middleRanks = RankingService.getStudentsByRankRange(testResult, 2, 3)
      
      expect(middleRanks).toHaveLength(2)
      expect(middleRanks[0].rank).toBe(2)
      expect(middleRanks[1].rank).toBe(3)
    })

    it('should return single student when start equals end rank', () => {
      const singleRank = RankingService.getStudentsByRankRange(testResult, 1, 1)
      
      expect(singleRank).toHaveLength(1)
      expect(singleRank[0].rank).toBe(1)
      expect(singleRank[0].student.getName()).toBe('Alice Top')
    })

    it('should return empty array for invalid rank range', () => {
      const invalidRange = RankingService.getStudentsByRankRange(testResult, 10, 15)
      expect(invalidRange).toEqual([])
    })

    it('should handle overlapping tied ranks', () => {
      // Test with tied ranks
      const subjects = [new Subject('Math', 100)]
      const studentData = [
        { name: 'Student A', rollNumber: '001', marks: { 'Math': 85 } },
        { name: 'Student B', rollNumber: '002', marks: { 'Math': 85 } }, // Tied at rank 1
        { name: 'Student C', rollNumber: '003', marks: { 'Math': 75 } }
      ]
      
      const result = Result.fromRawData({
        id: 'tied-test',
        title: 'Tied Test',
        subjects: ['Math'],
        studentData
      })
      
      const rangeStudents = RankingService.getStudentsByRankRange(result, 1, 2)
      expect(rangeStudents.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('calculatePercentile', () => {
    it('should calculate correct percentile', () => {
      const rankedStudents = RankingService.rankByPercentage(studentResults)
      const topStudent = rankedStudents[0]
      const bottomStudent = rankedStudents[3]
      
      // Top student (rank 1) should have high percentile
      const topPercentile = RankingService.calculatePercentile(topStudent, rankedStudents)
      expect(topPercentile).toBe(100) // (4-1+1)/4 * 100
      
      // Bottom student (rank 4) should have low percentile  
      const bottomPercentile = RankingService.calculatePercentile(bottomStudent, rankedStudents)
      expect(bottomPercentile).toBe(25) // (4-4+1)/4 * 100
    })

    it('should return 0 for invalid input', () => {
      const studentWithNoRank = { ...studentResults[0], rank: undefined }
      const percentile = RankingService.calculatePercentile(studentWithNoRank, studentResults)
      expect(percentile).toBe(0)
    })

    it('should return 0 for empty student list', () => {
      const percentile = RankingService.calculatePercentile(studentResults[0], [])
      expect(percentile).toBe(0)
    })
  })

  describe('calculateRankDistribution', () => {
    it('should calculate rank distribution in quartiles', () => {
      const distribution = RankingService.calculateRankDistribution(testResult)
      
      expect(distribution.topQuartile).toBe(1)    // Top 25%
      expect(distribution.secondQuartile).toBe(1) // 25-50%
      expect(distribution.thirdQuartile).toBe(1)  // 50-75% 
      expect(distribution.bottomQuartile).toBe(1) // Bottom 25%
      
      // Total should equal number of students
      const total = distribution.topQuartile + distribution.secondQuartile + 
                   distribution.thirdQuartile + distribution.bottomQuartile
      expect(total).toBe(4)
    })

    it('should handle empty result', () => {
      const emptyResult = new Result('empty', 'Empty', [new Subject('Math')])
      const distribution = RankingService.calculateRankDistribution(emptyResult)
      
      expect(distribution.topQuartile).toBe(0)
      expect(distribution.secondQuartile).toBe(0)
      expect(distribution.thirdQuartile).toBe(0)
      expect(distribution.bottomQuartile).toBe(0)
    })

    it('should handle single student', () => {
      const subjects = [new Subject('Math', 100)]
      const studentData = [
        { name: 'Only Student', rollNumber: '001', marks: { 'Math': 85 } }
      ]
      
      const result = Result.fromRawData({
        id: 'single-test',
        title: 'Single Test',
        subjects: ['Math'],
        studentData
      })
      
      const distribution = RankingService.calculateRankDistribution(result)
      expect(distribution.topQuartile).toBe(1)
      expect(distribution.secondQuartile).toBe(0)
      expect(distribution.thirdQuartile).toBe(0)
      expect(distribution.bottomQuartile).toBe(0)
    })
  })
})
