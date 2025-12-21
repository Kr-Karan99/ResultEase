import { Marks } from '../../../domain/value-objects/Marks'

describe('Marks', () => {
  describe('constructor and validation', () => {
    it('should create valid marks within range', () => {
      const marks = new Marks(85)
      expect(marks.getValue()).toBe(85)
    })

    it('should accept zero marks', () => {
      const marks = new Marks(0)
      expect(marks.getValue()).toBe(0)
    })

    it('should accept maximum marks (100)', () => {
      const marks = new Marks(100)
      expect(marks.getValue()).toBe(100)
    })

    it('should throw error for negative marks', () => {
      expect(() => new Marks(-1)).toThrow('Marks cannot be negative')
    })

    it('should throw error for marks exceeding 100', () => {
      expect(() => new Marks(101)).toThrow('Marks cannot exceed 100')
    })

    it('should throw error for non-numeric input', () => {
      expect(() => new Marks(NaN)).toThrow('Marks cannot be NaN')
      expect(() => new Marks('85' as any)).toThrow('Marks must be a number')
    })
  })

  describe('isPassing', () => {
    it('should return true for marks above default pass threshold (40)', () => {
      const marks = new Marks(45)
      expect(marks.isPassing()).toBe(true)
    })

    it('should return true for marks equal to pass threshold', () => {
      const marks = new Marks(40)
      expect(marks.isPassing()).toBe(true)
    })

    it('should return false for marks below pass threshold', () => {
      const marks = new Marks(35)
      expect(marks.isPassing()).toBe(false)
    })

    it('should use custom pass threshold', () => {
      const marks = new Marks(60)
      expect(marks.isPassing(70)).toBe(false)
      expect(marks.isPassing(50)).toBe(true)
    })

    it('should handle zero marks', () => {
      const marks = new Marks(0)
      expect(marks.isPassing()).toBe(false)
    })
  })

  describe('getLetterGrade', () => {
    it('should return A+ for marks >= 90', () => {
      expect(new Marks(95).getLetterGrade()).toBe('A+')
      expect(new Marks(90).getLetterGrade()).toBe('A+')
    })

    it('should return A for marks 80-89', () => {
      expect(new Marks(85).getLetterGrade()).toBe('A')
      expect(new Marks(80).getLetterGrade()).toBe('A')
    })

    it('should return B for marks 70-79', () => {
      expect(new Marks(75).getLetterGrade()).toBe('B')
      expect(new Marks(70).getLetterGrade()).toBe('B')
    })

    it('should return C for marks 60-69', () => {
      expect(new Marks(65).getLetterGrade()).toBe('C')
      expect(new Marks(60).getLetterGrade()).toBe('C')
    })

    it('should return D for marks 50-59', () => {
      expect(new Marks(55).getLetterGrade()).toBe('D')
      expect(new Marks(50).getLetterGrade()).toBe('D')
    })

    it('should return E for marks 40-49', () => {
      expect(new Marks(45).getLetterGrade()).toBe('E')
      expect(new Marks(40).getLetterGrade()).toBe('E')
    })

    it('should return F for marks below 40', () => {
      expect(new Marks(35).getLetterGrade()).toBe('F')
      expect(new Marks(0).getLetterGrade()).toBe('F')
    })
  })

  describe('add', () => {
    it('should add two marks correctly', () => {
      const marks1 = new Marks(40)
      const marks2 = new Marks(35)
      const total = marks1.add(marks2)
      
      expect(total.getValue()).toBe(75)
      expect(total).toBeInstanceOf(Marks)
    })

    it('should handle adding zero', () => {
      const marks = new Marks(80)
      const zero = new Marks(0)
      const result = marks.add(zero)
      
      expect(result.getValue()).toBe(80)
    })

    it('should allow sum to exceed 100 for totals', () => {
      const marks1 = new Marks(60)
      const marks2 = new Marks(50)
      
      const total = marks1.add(marks2)
      expect(total.getValue()).toBe(110)
    })
  })

  describe('comparison methods', () => {
    describe('isGreaterThan', () => {
      it('should return true when marks are greater', () => {
        const higher = new Marks(80)
        const lower = new Marks(70)
        
        expect(higher.isGreaterThan(lower)).toBe(true)
        expect(lower.isGreaterThan(higher)).toBe(false)
      })

      it('should return false when marks are equal', () => {
        const marks1 = new Marks(75)
        const marks2 = new Marks(75)
        
        expect(marks1.isGreaterThan(marks2)).toBe(false)
      })
    })

    describe('isEqualTo', () => {
      it('should return true for equal marks', () => {
        const marks1 = new Marks(85)
        const marks2 = new Marks(85)
        
        expect(marks1.isEqualTo(marks2)).toBe(true)
      })

      it('should return false for different marks', () => {
        const marks1 = new Marks(85)
        const marks2 = new Marks(80)
        
        expect(marks1.isEqualTo(marks2)).toBe(false)
      })
    })
  })

  describe('toString', () => {
    it('should return string representation of marks', () => {
      const marks = new Marks(85)
      expect(marks.toString()).toBe('85')
    })

    it('should handle zero marks', () => {
      const marks = new Marks(0)
      expect(marks.toString()).toBe('0')
    })
  })

  describe('static factory methods', () => {
    describe('fromString', () => {
      it('should create marks from valid numeric string', () => {
        const marks = Marks.fromString('85')
        expect(marks.getValue()).toBe(85)
      })

      it('should create marks from string with whitespace', () => {
        const marks = Marks.fromString('  75  ')
        expect(marks.getValue()).toBe(75)
      })

      it('should handle decimal numbers', () => {
        const marks = Marks.fromString('85.5')
        expect(marks.getValue()).toBe(85.5)
      })

      it('should create zero marks for absent indicators', () => {
        expect(Marks.fromString('absent').getValue()).toBe(0)
        expect(Marks.fromString('ABSENT').getValue()).toBe(0)
        expect(Marks.fromString('ab').getValue()).toBe(0)
        expect(Marks.fromString('AB').getValue()).toBe(0)
      })

      it('should create zero marks for empty string', () => {
        const marks = Marks.fromString('')
        expect(marks.getValue()).toBe(0)
      })

      it('should throw error for invalid string', () => {
        expect(() => Marks.fromString('invalid')).toThrow('Invalid marks format')
        expect(() => Marks.fromString('abc123')).toThrow('Invalid marks format')
      })

      it('should validate range for string input', () => {
        expect(() => Marks.fromString('-5')).toThrow('Marks cannot be negative')
        expect(() => Marks.fromString('105')).toThrow('Marks cannot exceed 100')
      })
    })

    describe('zero', () => {
      it('should create zero marks', () => {
        const marks = Marks.zero()
        expect(marks.getValue()).toBe(0)
      })

      it('should create valid Marks instance', () => {
        const marks = Marks.zero()
        expect(marks).toBeInstanceOf(Marks)
        expect(marks.isPassing()).toBe(false)
        expect(marks.getLetterGrade()).toBe('F')
      })
    })
  })

  describe('edge cases', () => {
    it('should handle floating point precision', () => {
      const marks = new Marks(33.333333)
      expect(marks.getValue()).toBeCloseTo(33.333333, 6)
    })

    it('should work with very small positive numbers', () => {
      const marks = new Marks(0.01)
      expect(marks.getValue()).toBe(0.01)
      expect(marks.isPassing()).toBe(false)
    })

    it('should work with numbers very close to boundaries', () => {
      const marks99_99 = new Marks(99.99)
      const marks100 = new Marks(100)
      
      expect(marks99_99.getLetterGrade()).toBe('A+')
      expect(marks100.getLetterGrade()).toBe('A+')
    })
  })

  describe('immutability', () => {
    it('should not allow external modification of internal value', () => {
      const marks = new Marks(85)
      const originalValue = marks.getValue()
      
      // Attempt to modify (should not be possible due to private field)
      expect(marks.getValue()).toBe(originalValue)
    })

    it('should create new instance when adding', () => {
      const marks1 = new Marks(40)
      const marks2 = new Marks(30)
      const result = marks1.add(marks2)
      
      expect(result).not.toBe(marks1)
      expect(result).not.toBe(marks2)
      expect(marks1.getValue()).toBe(40) // Original unchanged
      expect(marks2.getValue()).toBe(30) // Original unchanged
    })
  })
})
