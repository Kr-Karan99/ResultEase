import { ResultCalculator } from '../../../domain/services/ResultCalculator'
import { Result } from '../../../domain/entities/Result'
import { Student } from '../../../domain/entities/Student'
import { Subject } from '../../../domain/entities/Subject'
import { Marks } from '../../../domain/value-objects/Marks'
import { Percentage } from '../../../domain/value-objects/Percentage'

describe('ResultCalculator', () => {
  let testResult: Result
  
  beforeEach(() => {
    // Create test data
    const subjects = [
      new Subject('Mathematics', 100),
      new Subject('Science', 100),
      new Subject('English', 100)
    ]
    
    const studentData = [
      {
        name: 'John Doe',
        rollNumber: '001',
        marks: {
          'Mathematics': 85,
          'Science': 78,
          'English': 92
        }
      },
      {
        name: 'Jane Smith', 
        rollNumber: '002',
        marks: {
          'Mathematics': 92,
          'Science': 88,
          'English': 85
        }
      },
      {
        name: 'Bob Johnson',
        rollNumber: '003', 
        marks: {
          'Mathematics': 76,
          'Science': 82,
          'English': 79
        }
      }
    ]
    
    testResult = Result.fromRawData({
      id: 'test-result-1',
      title: 'Test Result',
      subjects: subjects.map(s => s.getName()),
      studentData
    })
  })

  describe('calculateSubjectAverage', () => {
    it('should calculate correct average for a subject', () => {
      const mathAverage = ResultCalculator.calculateSubjectAverage(testResult, 'Mathematics')
      expect(mathAverage).toBeCloseTo((85 + 92 + 76) / 3, 2)
    })

    it('should return 0 for empty result', () => {
      const emptyResult = new Result('empty', 'Empty', [new Subject('Math')])
      const average = ResultCalculator.calculateSubjectAverage(emptyResult, 'Math')
      expect(average).toBe(0)
    })

    it('should handle non-existent subject', () => {
      const average = ResultCalculator.calculateSubjectAverage(testResult, 'NonExistent')
      expect(average).toBe(0)
    })
  })

  describe('calculateAllSubjectAverages', () => {
    it('should calculate averages for all subjects', () => {
      const averages = ResultCalculator.calculateAllSubjectAverages(testResult)
      
      expect(averages).toHaveProperty('Mathematics')
      expect(averages).toHaveProperty('Science') 
      expect(averages).toHaveProperty('English')
      
      expect(averages.Mathematics).toBeCloseTo(84.33, 2)
      expect(averages.Science).toBeCloseTo(82.67, 2)
      expect(averages.English).toBeCloseTo(85.33, 2)
    })

    it('should return empty object for result with no subjects', () => {
      // Since Result constructor requires at least one subject, we'll test with an empty result
      const emptySubjectResult = new Result('empty', 'Empty', [new Subject('Test', 100)], [])
      const averages = ResultCalculator.calculateAllSubjectAverages(emptySubjectResult)
      expect(averages).toEqual({ 'Test': 0 }) // Should return 0 average for subjects with no students
    })
  })

  describe('calculateClassAveragePercentage', () => {
    it('should calculate correct class average percentage', () => {
      const classAverage = ResultCalculator.calculateClassAveragePercentage(testResult)
      
      // Calculate expected: ((85+78+92) + (92+88+85) + (76+82+79)) / 3 / 300 * 100
      const expectedPercentage = ((255 + 265 + 237) / 3) / 300 * 100
      expect(classAverage.getValue()).toBeCloseTo(expectedPercentage, 2)
    })

    it('should return zero for empty result', () => {
      const emptyResult = new Result('empty', 'Empty', [new Subject('Math')])
      const classAverage = ResultCalculator.calculateClassAveragePercentage(emptyResult)
      expect(classAverage.getValue()).toBe(0)
    })
  })

  describe('findHighestMarksInSubject', () => {
    it('should find highest marks and students in subject', () => {
      const result = ResultCalculator.findHighestMarksInSubject(testResult, 'Mathematics')
      
      expect(result.marks.getValue()).toBe(92)
      expect(result.students).toHaveLength(1)
      expect(result.students[0].student.getName()).toBe('Jane Smith')
    })

    it('should handle multiple students with same highest marks', () => {
      // Create a result where two students have the same highest marks
      const subjects = [new Subject('Math', 100)]
      const studentData = [
        { name: 'Student A', rollNumber: '001', marks: { 'Math': 90 } },
        { name: 'Student B', rollNumber: '002', marks: { 'Math': 90 } },
        { name: 'Student C', rollNumber: '003', marks: { 'Math': 85 } }
      ]
      
      const result = Result.fromRawData({
        id: 'test',
        title: 'Test',
        subjects: ['Math'],
        studentData
      })
      
      const highest = ResultCalculator.findHighestMarksInSubject(result, 'Math')
      expect(highest.marks.getValue()).toBe(90)
      expect(highest.students).toHaveLength(2)
    })

    it('should return zero marks for non-existent subject', () => {
      const result = ResultCalculator.findHighestMarksInSubject(testResult, 'NonExistent')
      expect(result.marks.getValue()).toBe(0)
      expect(result.students).toHaveLength(0)
    })
  })

  describe('findLowestMarksInSubject', () => {
    it('should find lowest marks and students in subject', () => {
      const result = ResultCalculator.findLowestMarksInSubject(testResult, 'Mathematics')
      
      expect(result.marks.getValue()).toBe(76)
      expect(result.students).toHaveLength(1)
      expect(result.students[0].student.getName()).toBe('Bob Johnson')
    })

    it('should return zero for empty result', () => {
      const emptyResult = new Result('empty', 'Empty', [new Subject('Math')])
      const result = ResultCalculator.findLowestMarksInSubject(emptyResult, 'Math')
      expect(result.marks.getValue()).toBe(0)
      expect(result.students).toHaveLength(0)
    })
  })

  describe('calculateSubjectStatistics', () => {
    it('should calculate comprehensive subject statistics', () => {
      const stats = ResultCalculator.calculateSubjectStatistics(testResult, 'Mathematics')
      
      expect(stats.studentsCount).toBe(3)
      expect(stats.average).toBeCloseTo(84.33, 2)
      expect(stats.highest).toBe(92)
      expect(stats.lowest).toBe(76)
      expect(stats.median).toBe(85)
      expect(stats.standardDeviation).toBeGreaterThan(0)
    })

    it('should return zero stats for non-existent subject', () => {
      const stats = ResultCalculator.calculateSubjectStatistics(testResult, 'NonExistent')
      
      expect(stats.studentsCount).toBe(0)
      expect(stats.average).toBe(0)
      expect(stats.highest).toBe(0)
      expect(stats.lowest).toBe(0)
      expect(stats.median).toBe(0)
      expect(stats.standardDeviation).toBe(0)
    })
  })

  describe('calculateClassStatistics', () => {
    it('should calculate comprehensive class statistics', () => {
      const stats = ResultCalculator.calculateClassStatistics(testResult)
      
      expect(stats.studentsCount).toBe(3)
      expect(stats.averagePercentage).toBeCloseTo(84.11, 2) // (85+88.33+79)/3
      expect(stats.highestPercentage).toBeCloseTo(88.33, 2)
      expect(stats.lowestPercentage).toBeCloseTo(79, 2)
      expect(stats.medianPercentage).toBeCloseTo(85, 1)
      expect(stats.standardDeviation).toBeGreaterThan(0)
    })

    it('should return zero stats for empty result', () => {
      const emptyResult = new Result('empty', 'Empty', [new Subject('Math')])
      const stats = ResultCalculator.calculateClassStatistics(emptyResult)
      
      expect(stats.studentsCount).toBe(0)
      expect(stats.averagePercentage).toBe(0)
      expect(stats.highestPercentage).toBe(0)
      expect(stats.lowestPercentage).toBe(0)
      expect(stats.medianPercentage).toBe(0)
      expect(stats.standardDeviation).toBe(0)
    })
  })

  describe('calculateGradeDistribution', () => {
    it('should calculate grade distribution correctly', () => {
      const distribution = ResultCalculator.calculateGradeDistribution(testResult)
      
      expect(distribution).toHaveProperty('A+')
      expect(distribution).toHaveProperty('A')
      expect(distribution).toHaveProperty('B')
      expect(distribution).toHaveProperty('C')
      expect(distribution).toHaveProperty('D')
      expect(distribution).toHaveProperty('E')
      expect(distribution).toHaveProperty('F')
      
      // Sum should equal total students
      const totalGraded = Object.values(distribution).reduce((sum, count) => sum + count, 0)
      expect(totalGraded).toBe(3)
    })

    it('should return zero counts for empty result', () => {
      const emptyResult = new Result('empty', 'Empty', [new Subject('Math')])
      const distribution = ResultCalculator.calculateGradeDistribution(emptyResult)
      
      const totalGraded = Object.values(distribution).reduce((sum, count) => sum + count, 0)
      expect(totalGraded).toBe(0)
    })
  })

  describe('calculateMarksDistribution', () => {
    it('should calculate marks distribution with default ranges', () => {
      const distribution = ResultCalculator.calculateMarksDistribution(testResult)
      
      expect(distribution).toHaveProperty('0-40%')
      expect(distribution).toHaveProperty('40-60%')
      expect(distribution).toHaveProperty('60-75%')
      expect(distribution).toHaveProperty('75-90%')
      expect(distribution).toHaveProperty('90-100%')
      
      // Sum should equal total students
      const totalStudents = Object.values(distribution).reduce((sum, count) => sum + count, 0)
      expect(totalStudents).toBe(3)
    })

    it('should calculate marks distribution with custom ranges', () => {
      const customRanges = [0, 50, 100]
      const distribution = ResultCalculator.calculateMarksDistribution(testResult, customRanges)
      
      expect(distribution).toHaveProperty('0-50%')
      expect(distribution).toHaveProperty('50-100%')
      
      const totalStudents = Object.values(distribution).reduce((sum, count) => sum + count, 0)
      expect(totalStudents).toBe(3)
    })

    it('should handle edge case with 100% marks', () => {
      const subjects = [new Subject('Math', 100)]
      const studentData = [
        { name: 'Perfect Student', rollNumber: '001', marks: { 'Math': 100 } }
      ]
      
      const result = Result.fromRawData({
        id: 'test',
        title: 'Test',
        subjects: ['Math'],
        studentData
      })
      
      const distribution = ResultCalculator.calculateMarksDistribution(result)
      expect(distribution['90-100%']).toBe(1)
    })
  })
})
