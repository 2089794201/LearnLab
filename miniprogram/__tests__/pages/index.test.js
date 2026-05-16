const { formatDate, getToday, formatDisplayDate, getPrevMonth, getNextMonth, getDaysInMonth } = require('../../utils/date');

describe('index page - core logic', () => {
  describe('date navigation', () => {
    it('computes previous day', () => {
      const date = new Date(2026, 4, 16);
      date.setDate(date.getDate() - 1);
      expect(formatDate(date)).toBe('2026-05-15');
    });

    it('computes next day', () => {
      const date = new Date(2026, 4, 16);
      date.setDate(date.getDate() + 1);
      expect(formatDate(date)).toBe('2026-05-17');
    });

    it('handles month boundary - prev', () => {
      const date = new Date(2026, 4, 1);
      date.setDate(date.getDate() - 1);
      expect(formatDate(date)).toBe('2026-04-30');
    });

    it('handles month boundary - next', () => {
      const date = new Date(2026, 4, 31);
      date.setDate(date.getDate() + 1);
      expect(formatDate(date)).toBe('2026-06-01');
    });
  });

  describe('task completion toggle', () => {
    it('toggles completed from false to true', () => {
      const task = { _id: '1', completed: false };
      const newCompleted = !task.completed;
      expect(newCompleted).toBe(true);
    });

    it('toggles completed from true to false', () => {
      const task = { _id: '1', completed: true };
      const newCompleted = !task.completed;
      expect(newCompleted).toBe(false);
    });
  });

  describe('marked dates aggregation', () => {
    it('deduplicates dates', () => {
      const data = [
        { date: '2026-05-16' },
        { date: '2026-05-16' },
        { date: '2026-05-17' }
      ];
      const dates = new Set();
      data.forEach(item => dates.add(item.date));
      expect([...dates]).toEqual(['2026-05-16', '2026-05-17']);
    });

    it('returns empty array for no data', () => {
      const dates = new Set();
      expect([...dates]).toEqual([]);
    });
  });

  describe('month navigation for calendar', () => {
    it('getPrevMonth within same year', () => {
      expect(getPrevMonth(2026, 5)).toEqual({ year: 2026, month: 4 });
    });

    it('getPrevMonth wraps year', () => {
      expect(getPrevMonth(2026, 1)).toEqual({ year: 2025, month: 12 });
    });

    it('getNextMonth within same year', () => {
      expect(getNextMonth(2026, 5)).toEqual({ year: 2026, month: 6 });
    });

    it('getNextMonth wraps year', () => {
      expect(getNextMonth(2026, 12)).toEqual({ year: 2027, month: 1 });
    });
  });
});
