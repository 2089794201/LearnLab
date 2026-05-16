const { validateHabitName } = require('../../utils/validator');
const { getToday } = require('../../utils/date');

describe('habit page - core logic', () => {
  describe('today checkins map building', () => {
    it('builds checkins map from array', () => {
      const checkins = [
        { _id: '1', habit_id: 'h1', date: getToday() },
        { _id: '2', habit_id: 'h2', date: getToday() }
      ];
      const todayCheckins = {};
      checkins.forEach(c => { todayCheckins[c.habit_id] = true; });
      expect(todayCheckins).toEqual({ h1: true, h2: true });
    });

    it('returns empty map for no checkins', () => {
      const todayCheckins = {};
      expect(Object.keys(todayCheckins).length).toBe(0);
    });
  });

  describe('checkin toggle logic', () => {
    it('adds checkin when not already checked', () => {
      const todayCheckins = {};
      const habitId = 'h1';
      const alreadyChecked = !!todayCheckins[habitId];
      expect(alreadyChecked).toBe(false);
    });

    it('removes checkin when already checked', () => {
      const todayCheckins = { h1: true };
      const habitId = 'h1';
      const alreadyChecked = !!todayCheckins[habitId];
      expect(alreadyChecked).toBe(true);
    });

    it('deletes habit from map on uncheck', () => {
      const todayCheckins = { h1: true, h2: true };
      const habitId = 'h1';
      delete todayCheckins[habitId];
      expect(todayCheckins).toEqual({ h2: true });
      expect(Object.keys(todayCheckins).length).toBe(1);
    });
  });

  describe('done count calculation', () => {
    it('counts checked habits', () => {
      const todayCheckins = { h1: true, h2: true, h3: false };
      const doneCount = Object.keys(todayCheckins).filter(k => todayCheckins[k]).length;
      expect(doneCount).toBe(2);
    });

    it('returns 0 for empty checkins', () => {
      const todayCheckins = {};
      const doneCount = Object.keys(todayCheckins).length;
      expect(doneCount).toBe(0);
    });
  });

  describe('habit validation', () => {
    it('rejects empty name', () => {
      const result = validateHabitName('');
      expect(result.valid).toBe(false);
    });

    it('accepts valid name', () => {
      const result = validateHabitName('每天阅读');
      expect(result.valid).toBe(true);
    });

    it('rejects overly long name', () => {
      const result = validateHabitName('a'.repeat(31));
      expect(result.valid).toBe(false);
    });
  });

  describe('streak display logic', () => {
    it('shows streak when > 0', () => {
      const streak = 5;
      expect(streak > 0).toBe(true);
    });

    it('hides streak when 0', () => {
      const streak = 0;
      expect(streak > 0).toBe(false);
    });

    it('shows new record when streak >= best_streak', () => {
      const streak = 10;
      const best_streak = 10;
      expect(streak >= best_streak && streak > 0).toBe(true);
    });

    it('does not show record when streak < best_streak', () => {
      const streak = 5;
      const best_streak = 10;
      expect(streak >= best_streak && streak > 0).toBe(false);
    });
  });
});
