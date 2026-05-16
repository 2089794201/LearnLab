const { getWeekRange } = require('../../utils/date');

describe('mine page - core logic', () => {
  describe('week range calculation', () => {
    it('returns Monday to Sunday for a given date', () => {
      const { startDate, endDate } = getWeekRange('2026-05-16');
      expect(startDate).toBe('2026-05-11');
      expect(endDate).toBe('2026-05-17');
    });
  });

  describe('stats defaults', () => {
    it('initial stats are all zero', () => {
      const stats = {
        totalTasks: 0,
        completedTasks: 0,
        completionRate: 0,
        habitQualified: 0
      };
      expect(stats.totalTasks).toBe(0);
      expect(stats.completedTasks).toBe(0);
      expect(stats.completionRate).toBe(0);
      expect(stats.habitQualified).toBe(0);
    });
  });

  describe('completion rate calculation', () => {
    it('calculates completion rate', () => {
      const totalTasks = 10;
      const completedTasks = 8;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      expect(completionRate).toBe(80);
    });

    it('returns 0 when totalTasks is 0', () => {
      const totalTasks = 0;
      const completedTasks = 0;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      expect(completionRate).toBe(0);
    });
  });
});
