const {
  getCollection,
  getTasksByDate,
  getTaskDatesByMonth,
  getHabits,
  getCheckinsByDate,
  getCheckinsByHabitAndDate,
  getCheckinsByHabit,
  add,
  update,
  remove,
  removeWhere
} = require('../../utils/db');

describe('db utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCollection', () => {
    it('returns a collection instance', () => {
      const col = getCollection('tasks');
      expect(col).toBeDefined();
      expect(wx.cloud.database().collection).toHaveBeenCalledWith('tasks');
    });
  });

  describe('getTasksByDate', () => {
    it('queries tasks by date', async () => {
      const mockData = [{ _id: '1', name: 'Task 1', date: '2026-05-16' }];
      const mockDb = wx.cloud.database();
      const mockCol = mockDb.collection();
      const mockWhere = mockCol.where();
      mockWhere.get.mockResolvedValue({ data: mockData });

      const result = await getTasksByDate('2026-05-16');
      expect(result).toEqual(mockData);
    });
  });

  describe('getTaskDatesByMonth', () => {
    it('returns unique dates with tasks in a month', async () => {
      const mockData = [
        { date: '2026-05-16' },
        { date: '2026-05-16' },
        { date: '2026-05-17' }
      ];
      const mockDb = wx.cloud.database();
      const mockCol = mockDb.collection();
      const mockWhere = mockCol.where();
      mockWhere.get.mockResolvedValue({ data: mockData });

      const result = await getTaskDatesByMonth(2026, 5);
      expect(result).toEqual(['2026-05-16', '2026-05-17']);
    });

    it('returns empty array for month with no tasks', async () => {
      const mockDb = wx.cloud.database();
      const mockCol = mockDb.collection();
      const mockWhere = mockCol.where();
      mockWhere.get.mockResolvedValue({ data: [] });

      const result = await getTaskDatesByMonth(2026, 5);
      expect(result).toEqual([]);
    });
  });

  describe('getHabits', () => {
    it('returns all habits', async () => {
      const mockData = [{ _id: '1', name: 'Habit 1' }];
      const mockDb = wx.cloud.database();
      const mockCol = mockDb.collection();
      mockCol.get.mockResolvedValue({ data: mockData });

      const result = await getHabits();
      expect(result).toEqual(mockData);
    });
  });

  describe('getCheckinsByDate', () => {
    it('returns checkins for a date', async () => {
      const mockData = [{ _id: '1', habit_id: 'h1', date: '2026-05-16' }];
      const mockDb = wx.cloud.database();
      const mockCol = mockDb.collection();
      const mockWhere = mockCol.where();
      mockWhere.get.mockResolvedValue({ data: mockData });

      const result = await getCheckinsByDate('2026-05-16');
      expect(result).toEqual(mockData);
    });
  });

  describe('getCheckinsByHabitAndDate', () => {
    it('returns checkins for a habit on a date', async () => {
      const mockData = [{ _id: '1', habit_id: 'h1', date: '2026-05-16' }];
      const mockDb = wx.cloud.database();
      const mockCol = mockDb.collection();
      const mockWhere = mockCol.where();
      mockWhere.get.mockResolvedValue({ data: mockData });

      const result = await getCheckinsByHabitAndDate('h1', '2026-05-16');
      expect(result).toEqual(mockData);
    });
  });

  describe('getCheckinsByHabit', () => {
    it('returns all checkins for a habit', async () => {
      const mockData = [{ _id: '1', habit_id: 'h1', date: '2026-05-16' }];
      const mockDb = wx.cloud.database();
      const mockCol = mockDb.collection();
      const mockWhere = mockCol.where();
      mockWhere.get.mockResolvedValue({ data: mockData });

      const result = await getCheckinsByHabit('h1');
      expect(result).toEqual(mockData);
    });
  });

  describe('add', () => {
    it('adds a document to a collection', async () => {
      const mockDb = wx.cloud.database();
      const mockCol = mockDb.collection();
      mockCol.add.mockResolvedValue({ _id: 'new-id' });

      const result = await add('tasks', { name: 'Test' });
      expect(result._id).toBe('new-id');
    });
  });

  describe('update', () => {
    it('updates a document in a collection', async () => {
      await update('tasks', 'id-1', { name: 'Updated' });
      const mockDb = wx.cloud.database();
      const mockCol = mockDb.collection();
      const mockDoc = mockCol.doc();
      expect(mockDoc.update).toHaveBeenCalledWith({ data: { name: 'Updated' } });
    });
  });

  describe('remove', () => {
    it('removes a document from a collection', async () => {
      await remove('tasks', 'id-1');
      const mockDb = wx.cloud.database();
      const mockCol = mockDb.collection();
      const mockDoc = mockCol.doc();
      expect(mockDoc.remove).toHaveBeenCalled();
    });
  });

  describe('removeWhere', () => {
    it('removes documents matching a condition', async () => {
      await removeWhere('checkins', { habit_id: 'h1' });
      const mockDb = wx.cloud.database();
      const mockCol = mockDb.collection();
      const mockWhere = mockCol.where();
      expect(mockWhere.remove).toHaveBeenCalled();
    });
  });
});
