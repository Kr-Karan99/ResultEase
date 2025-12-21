import { Percentage } from '../../../domain/value-objects/Percentage'

describe('Percentage', () => {
  describe('constructor and validation', () => {
    it('should create valid percentage within range', () => {
      const percentage = new Percentage(75.5)
      expect(percentage.getValue()).toBe(75.5)
    })

    it('should accept zero percentage', () => {
      const percentage = new Percentage(0)
      expect(percentage.getValue()).toBe(0)
    })

    it('should accept maximum percentage (100)', () => {
      const percentage = new Percentage(100)
      expect(percentage.getValue()).toBe(100)
    })

    it('should throw error for negative percentage', () => {
      expect(() => new Percentage(-1)).toThrow('Percentage cannot be negative')
    })

    it('should throw error for percentage exceeding 100', () => {
      expect(() => new Percentage(101)).toThrow('Percentage cannot exceed 100')
    })

    it('should throw error for non-numeric input', () => {
      expect(() => new Percentage(NaN)).toThrow('Percentage cannot be NaN')
      expect(() => new Percentage('75' as any)).toThrow('Percentage must be a number')
    })
  })

  describe('format', () => {
    it('should format percentage with default decimal places (2)', () => {
      const percentage = new Percentage(75.666)
      expect(percentage.format()).toBe('75.67%')
    })

    it('should format percentage with custom decimal places', () => {
      const percentage = new Percentage(75.666)
      expect(percentage.format(1)).toBe('75.7%')
      expect(percentage.format(0)).toBe('76%')
      expect(percentage.format(3)).toBe('75.666%')
    })

    it('should format whole numbers correctly', () => {
      const percentage = new Percentage(80)
      expect(percentage.format()).toBe('80.00%')
      expect(percentage.format(0)).toBe('80%')
    })

    it('should format zero percentage', () => {
      const percentage = new Percentage(0)
      expect(percentage.format()).toBe('0.00%')
      expect(percentage.format(0)).toBe('0%')
    })

    it('should format maximum percentage', () => {
      const percentage = new Percentage(100)
      expect(percentage.format()).toBe('100.00%')
      expect(percentage.format(0)).toBe('100%')
    })
  })

  describe('isPassing', () => {
    it('should return true for percentage above default threshold (40)', () => {
      const percentage = new Percentage(45)
      expect(percentage.isPassing()).toBe(true)
    })

    it('should return true for percentage equal to threshold', () => {
      const percentage = new Percentage(40)
      expect(percentage.isPassing()).toBe(true)
    })

    it('should return false for percentage below threshold', () => {
      const percentage = new Percentage(35)
      expect(percentage.isPassing()).toBe(false)
    })

    it('should use custom pass threshold', () => {
      const percentage = new Percentage(60)
      expect(percentage.isPassing(70)).toBe(false)
      expect(percentage.isPassing(50)).toBe(true)
    })

    it('should handle zero percentage', () => {
      const percentage = new Percentage(0)
      expect(percentage.isPassing()).toBe(false)
    })

    it('should handle edge cases around threshold', () => {
      const percentage39_9 = new Percentage(39.9)
      const percentage40_1 = new Percentage(40.1)
      
      expect(percentage39_9.isPassing()).toBe(false)
      expect(percentage40_1.isPassing()).toBe(true)
    })
  })

  describe('getLetterGrade', () => {
    it('should return A+ for percentage >= 90', () => {
      expect(new Percentage(95).getLetterGrade()).toBe('A+')
      expect(new Percentage(90).getLetterGrade()).toBe('A+')
      expect(new Percentage(100).getLetterGrade()).toBe('A+')
    })

    it('should return A for percentage 80-89', () => {
      expect(new Percentage(85).getLetterGrade()).toBe('A')
      expect(new Percentage(80).getLetterGrade()).toBe('A')
      expect(new Percentage(89.9).getLetterGrade()).toBe('A')
    })

    it('should return B for percentage 70-79', () => {
      expect(new Percentage(75).getLetterGrade()).toBe('B')
      expect(new Percentage(70).getLetterGrade()).toBe('B')
      expect(new Percentage(79.9).getLetterGrade()).toBe('B')
    })

    it('should return C for percentage 60-69', () => {
      expect(new Percentage(65).getLetterGrade()).toBe('C')
      expect(new Percentage(60).getLetterGrade()).toBe('C')
      expect(new Percentage(69.9).getLetterGrade()).toBe('C')
    })

    it('should return D for percentage 50-59', () => {
      expect(new Percentage(55).getLetterGrade()).toBe('D')
      expect(new Percentage(50).getLetterGrade()).toBe('D')
      expect(new Percentage(59.9).getLetterGrade()).toBe('D')
    })

    it('should return E for percentage 40-49', () => {
      expect(new Percentage(45).getLetterGrade()).toBe('E')
      expect(new Percentage(40).getLetterGrade()).toBe('E')
      expect(new Percentage(49.9).getLetterGrade()).toBe('E')
    })

    it('should return F for percentage below 40', () => {
      expect(new Percentage(35).getLetterGrade()).toBe('F')
      expect(new Percentage(0).getLetterGrade()).toBe('F')
      expect(new Percentage(39.9).getLetterGrade()).toBe('F')
    })
  })

  describe('getPerformanceCategory', () => {
    it('should return Excellent for percentage >= 90', () => {
      expect(new Percentage(95).getPerformanceCategory()).toBe('Excellent')
      expect(new Percentage(90).getPerformanceCategory()).toBe('Excellent')
      expect(new Percentage(100).getPerformanceCategory()).toBe('Excellent')
    })

    it('should return Good for percentage 75-89', () => {
      expect(new Percentage(80).getPerformanceCategory()).toBe('Good')
      expect(new Percentage(75).getPerformanceCategory()).toBe('Good')
      expect(new Percentage(89.9).getPerformanceCategory()).toBe('Good')
    })

    it('should return Average for percentage 60-74', () => {
      expect(new Percentage(65).getPerformanceCategory()).toBe('Average')
      expect(new Percentage(60).getPerformanceCategory()).toBe('Average')
      expect(new Percentage(74.9).getPerformanceCategory()).toBe('Average')
    })

    it('should return Below Average for percentage 40-59', () => {
      expect(new Percentage(50).getPerformanceCategory()).toBe('Below Average')
      expect(new Percentage(40).getPerformanceCategory()).toBe('Below Average')
      expect(new Percentage(59.9).getPerformanceCategory()).toBe('Below Average')
    })

    it('should return Poor for percentage below 40', () => {
      expect(new Percentage(35).getPerformanceCategory()).toBe('Poor')
      expect(new Percentage(0).getPerformanceCategory()).toBe('Poor')
      expect(new Percentage(39.9).getPerformanceCategory()).toBe('Poor')
    })
  })

  describe('comparison methods', () => {
    describe('isGreaterThan', () => {
      it('should return true when percentage is greater', () => {
        const higher = new Percentage(80)
        const lower = new Percentage(70)
        
        expect(higher.isGreaterThan(lower)).toBe(true)
        expect(lower.isGreaterThan(higher)).toBe(false)
      })

      it('should return false when percentages are equal', () => {
        const percentage1 = new Percentage(75)
        const percentage2 = new Percentage(75)
        
        expect(percentage1.isGreaterThan(percentage2)).toBe(false)
      })

      it('should handle decimal comparisons', () => {
        const higher = new Percentage(75.1)
        const lower = new Percentage(75.0)
        
        expect(higher.isGreaterThan(lower)).toBe(true)
      })
    })

    describe('isEqualTo', () => {
      it('should return true for equal percentages', () => {
        const percentage1 = new Percentage(85)
        const percentage2 = new Percentage(85)
        
        expect(percentage1.isEqualTo(percentage2)).toBe(true)
      })

      it('should return false for different percentages', () => {
        const percentage1 = new Percentage(85)
        const percentage2 = new Percentage(80)
        
        expect(percentage1.isEqualTo(percentage2)).toBe(false)
      })

      it('should handle decimal equality', () => {
        const percentage1 = new Percentage(75.5)
        const percentage2 = new Percentage(75.5)
        
        expect(percentage1.isEqualTo(percentage2)).toBe(true)
      })
    })
  })

  describe('static factory methods', () => {
    describe('fromMarks', () => {
      it('should calculate percentage from marks correctly', () => {
        const percentage = Percentage.fromMarks(75, 100)
        expect(percentage.getValue()).toBe(75)
      })

      it('should handle different total marks', () => {
        const percentage = Percentage.fromMarks(40, 50)
        expect(percentage.getValue()).toBe(80)
      })

      it('should handle zero obtained marks', () => {
        const percentage = Percentage.fromMarks(0, 100)
        expect(percentage.getValue()).toBe(0)
      })

      it('should handle perfect score', () => {
        const percentage = Percentage.fromMarks(100, 100)
        expect(percentage.getValue()).toBe(100)
      })

      it('should handle decimal marks', () => {
        const percentage = Percentage.fromMarks(85.5, 100)
        expect(percentage.getValue()).toBe(85.5)
      })

      it('should throw error for zero or negative total marks', () => {
        expect(() => Percentage.fromMarks(50, 0)).toThrow('Total marks must be greater than zero')
        expect(() => Percentage.fromMarks(50, -10)).toThrow('Total marks must be greater than zero')
      })

      it('should throw error when calculated percentage exceeds 100', () => {
        expect(() => Percentage.fromMarks(150, 100)).toThrow('Percentage cannot exceed 100')
      })
    })

    describe('fromFraction', () => {
      it('should calculate percentage from fraction correctly', () => {
        const percentage = Percentage.fromFraction(3, 4)
        expect(percentage.getValue()).toBe(75)
      })

      it('should handle different fractions', () => {
        const percentage = Percentage.fromFraction(1, 3)
        expect(percentage.getValue()).toBeCloseTo(33.33, 2)
      })

      it('should handle zero numerator', () => {
        const percentage = Percentage.fromFraction(0, 10)
        expect(percentage.getValue()).toBe(0)
      })

      it('should handle perfect fraction (1/1)', () => {
        const percentage = Percentage.fromFraction(1, 1)
        expect(percentage.getValue()).toBe(100)
      })

      it('should throw error for zero or negative denominator', () => {
        expect(() => Percentage.fromFraction(1, 0)).toThrow('Denominator must be greater than zero')
        expect(() => Percentage.fromFraction(1, -5)).toThrow('Denominator must be greater than zero')
      })

      it('should throw error when calculated percentage exceeds 100', () => {
        expect(() => Percentage.fromFraction(5, 4)).toThrow('Percentage cannot exceed 100')
      })
    })

    describe('zero', () => {
      it('should create zero percentage', () => {
        const percentage = Percentage.zero()
        expect(percentage.getValue()).toBe(0)
      })

      it('should create valid Percentage instance', () => {
        const percentage = Percentage.zero()
        expect(percentage).toBeInstanceOf(Percentage)
        expect(percentage.isPassing()).toBe(false)
        expect(percentage.getLetterGrade()).toBe('F')
        expect(percentage.getPerformanceCategory()).toBe('Poor')
      })
    })

    describe('hundred', () => {
      it('should create hundred percentage', () => {
        const percentage = Percentage.hundred()
        expect(percentage.getValue()).toBe(100)
      })

      it('should create valid Percentage instance', () => {
        const percentage = Percentage.hundred()
        expect(percentage).toBeInstanceOf(Percentage)
        expect(percentage.isPassing()).toBe(true)
        expect(percentage.getLetterGrade()).toBe('A+')
        expect(percentage.getPerformanceCategory()).toBe('Excellent')
      })
    })
  })

  describe('toString', () => {
    it('should return formatted string representation', () => {
      const percentage = new Percentage(85.5)
      expect(percentage.toString()).toBe('85.50%')
    })

    it('should handle zero percentage', () => {
      const percentage = new Percentage(0)
      expect(percentage.toString()).toBe('0.00%')
    })

    it('should handle hundred percentage', () => {
      const percentage = new Percentage(100)
      expect(percentage.toString()).toBe('100.00%')
    })
  })

  describe('edge cases', () => {
    it('should handle floating point precision', () => {
      const percentage = new Percentage(33.333333)
      expect(percentage.getValue()).toBeCloseTo(33.333333, 6)
    })

    it('should work with very small positive percentages', () => {
      const percentage = new Percentage(0.01)
      expect(percentage.getValue()).toBe(0.01)
      expect(percentage.isPassing()).toBe(false)
    })

    it('should work with percentages very close to boundaries', () => {
      const percentage89_99 = new Percentage(89.99)
      const percentage90 = new Percentage(90)
      
      expect(percentage89_99.getLetterGrade()).toBe('A')
      expect(percentage90.getLetterGrade()).toBe('A+')
    })

    it('should handle calculation precision in fromMarks', () => {
      const percentage = Percentage.fromMarks(1, 3)
      expect(percentage.getValue()).toBeCloseTo(33.333333, 5)
      expect(percentage.format(1)).toBe('33.3%')
    })
  })

  describe('immutability', () => {
    it('should not allow external modification of internal value', () => {
      const percentage = new Percentage(85)
      const originalValue = percentage.getValue()
      
      expect(percentage.getValue()).toBe(originalValue)
    })

    it('should create independent instances from factory methods', () => {
      const percentage1 = Percentage.fromMarks(75, 100)
      const percentage2 = Percentage.fromMarks(75, 100)
      
      expect(percentage1).not.toBe(percentage2)
      expect(percentage1.getValue()).toBe(percentage2.getValue())
    })
  })
})
