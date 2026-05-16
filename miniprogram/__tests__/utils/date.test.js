const {
  formatDate,
  getToday,
  getWeekRange,
  getDaysInMonth,
  getPrevMonth,
  getNextMonth,
  formatDisplayDate,
  WEEKDAY_NAMES
} = require('../../utils/date');

describe('date utils', () => {
  describe('formatDate', () => {
    it('formats a date to YYYY-MM-DD', () => {
      const result = formatDate(new Date(2026, 4, 16));
      expect(result).toBe('2026-05-16');
    });

    it('pads single digit month and day', () => {
      const result = formatDate(new Date(2026, 0, 1));
      expect(result).toBe('2026-01-01');
    });

    it('handles date strings', () => {
      const result = formatDate('2026-12-31');
      expect(result).toBe('2026-12-31');
    });
  });

  describe('getToday', () => {
    it('returns today as YYYY-MM-DD string', () => {
      const result = getToday();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('getWeekRange', () => {
    it('returns Monday to Sunday range for a given date', () => {
      const result = getWeekRange('2026-05-16');
      expect(result.startDate).toBe('2026-05-11');
      expect(result.endDate).toBe('2026-05-17');
    });

    it('returns Monday to Sunday for Sunday', () => {
      const result = getWeekRange('2026-05-17');
      expect(result.startDate).toBe('2026-05-11');
      expect(result.endDate).toBe('2026-05-17');
    });

    it('works without argument (today)', () => {
      const result = getWeekRange();
      expect(result).toHaveProperty('startDate');
      expect(result).toHaveProperty('endDate');
      expect(result.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(result.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('getDaysInMonth', () => {
    it('returns 31 for January', () => {
      expect(getDaysInMonth(2026, 1)).toBe(31);
    });

    it('returns 28 for February non-leap year', () => {
      expect(getDaysInMonth(2026, 2)).toBe(28);
    });

    it('returns 29 for February leap year', () => {
      expect(getDaysInMonth(2024, 2)).toBe(29);
    });

    it('returns 30 for April', () => {
      expect(getDaysInMonth(2026, 4)).toBe(30);
    });
  });

  describe('getPrevMonth', () => {
    it('returns previous month within same year', () => {
      expect(getPrevMonth(2026, 5)).toEqual({ year: 2026, month: 4 });
    });

    it('wraps to previous year', () => {
      expect(getPrevMonth(2026, 1)).toEqual({ year: 2025, month: 12 });
    });
  });

  describe('getNextMonth', () => {
    it('returns next month within same year', () => {
      expect(getNextMonth(2026, 5)).toEqual({ year: 2026, month: 6 });
    });

    it('wraps to next year', () => {
      expect(getNextMonth(2026, 12)).toEqual({ year: 2027, month: 1 });
    });
  });

  describe('formatDisplayDate', () => {
    it('formats date to Chinese display format', () => {
      const result = formatDisplayDate(new Date(2026, 4, 16));
      expect(result).toBe('5月16日 周六');
    });

    it('handles Sunday correctly', () => {
      const result = formatDisplayDate(new Date(2026, 4, 17));
      expect(result).toBe('5月17日 周日');
    });
  });

  describe('WEEKDAY_NAMES', () => {
    it('has 7 entries starting with 周日', () => {
      expect(WEEKDAY_NAMES).toHaveLength(7);
      expect(WEEKDAY_NAMES[0]).toBe('周日');
    });
  });
});
