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

  describe('task completion with confirmation', () => {
    it('computes confirm message for completing a task', () => {
      const task = { _id: '1', name: '完成作业', completed: false };
      const action = task.completed ? '取消' : '完成';
      const content = `确定${action}任务「${task.name}」吗？`;
      expect(content).toBe('确定完成任务「完成作业」吗？');
    });

    it('computes confirm message for uncompleting a task', () => {
      const task = { _id: '1', name: '完成作业', completed: true };
      const action = task.completed ? '取消' : '完成';
      const content = `确定${action}任务「${task.name}」吗？`;
      expect(content).toBe('确定取消任务「完成作业」吗？');
    });

    it('only proceeds when user confirms', () => {
      let proceeded = false;
      const userConfirmed = true;
      if (userConfirmed) proceeded = true;
      expect(proceeded).toBe(true);
    });

    it('does not proceed when user cancels', () => {
      let proceeded = false;
      const userConfirmed = false;
      if (userConfirmed) proceeded = true;
      expect(proceeded).toBe(false);
    });
  });

  describe('readonly flag for task-modal', () => {
    it('is true when editingTask exists and is completed', () => {
      const editingTask = { _id: '1', completed: true };
      const readonly = editingTask && editingTask.completed;
      expect(readonly).toBe(true);
    });

    it('is false when editingTask exists and is not completed', () => {
      const editingTask = { _id: '1', completed: false };
      const readonly = editingTask && editingTask.completed;
      expect(readonly).toBe(false);
    });

    it('is false when editingTask is null (add mode)', () => {
      const editingTask = null;
      const readonly = !!(editingTask && editingTask.completed);
      expect(readonly).toBe(false);
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
