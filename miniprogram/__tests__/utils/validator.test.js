const {
  validateTaskName,
  validateTimeRange,
  validateHabitName
} = require('../../utils/validator');

describe('validator utils', () => {
  describe('validateTaskName', () => {
    it('rejects empty name', () => {
      const result = validateTaskName('');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('任务名称不能为空');
    });

    it('rejects whitespace-only name', () => {
      const result = validateTaskName('   ');
      expect(result.valid).toBe(false);
    });

    it('rejects name longer than 50 chars', () => {
      const result = validateTaskName('a'.repeat(51));
      expect(result.valid).toBe(false);
      expect(result.message).toBe('任务名称不能超过50个字符');
    });

    it('accepts valid name', () => {
      const result = validateTaskName('完成作业');
      expect(result.valid).toBe(true);
    });

    it('accepts name at max length', () => {
      const result = validateTaskName('a'.repeat(50));
      expect(result.valid).toBe(true);
    });
  });

  describe('validateTimeRange', () => {
    it('rejects invalid start time format', () => {
      const result = validateTimeRange('abc', '10:00');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('时间格式不正确');
    });

    it('rejects invalid end time format', () => {
      const result = validateTimeRange('09:00', '25:00');
      expect(result.valid).toBe(false);
    });

    it('rejects end time before start time', () => {
      const result = validateTimeRange('10:00', '09:00');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('结束时间必须大于开始时间');
    });

    it('rejects end time equal to start time', () => {
      const result = validateTimeRange('09:00', '09:00');
      expect(result.valid).toBe(false);
    });

    it('accepts valid time range', () => {
      const result = validateTimeRange('09:00', '10:30');
      expect(result.valid).toBe(true);
    });

    it('accepts valid time range with same hour', () => {
      const result = validateTimeRange('09:00', '09:01');
      expect(result.valid).toBe(true);
    });
  });

  describe('validateHabitName', () => {
    it('rejects empty name', () => {
      const result = validateHabitName('');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('习惯名称不能为空');
    });

    it('rejects whitespace-only name', () => {
      const result = validateHabitName('   ');
      expect(result.valid).toBe(false);
    });

    it('rejects name longer than 30 chars', () => {
      const result = validateHabitName('a'.repeat(31));
      expect(result.valid).toBe(false);
      expect(result.message).toBe('习惯名称不能超过30个字符');
    });

    it('accepts valid name', () => {
      const result = validateHabitName('每天阅读');
      expect(result.valid).toBe(true);
    });
  });
});
