const cloud = require('wx-server-sdk');

describe('statsFunctions - weeklyStats', () => {
  let main;
  let mockChains;

  beforeEach(() => {
    jest.clearAllMocks();

    const mockCommand = {
      and: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis()
    };

    mockChains = {};

    const mockDb = {
      collection: jest.fn((name) => {
        if (!mockChains[name]) {
          mockChains[name] = {
            where: jest.fn().mockReturnThis(),
            get: jest.fn().mockResolvedValue({ data: [] }),
            orderBy: jest.fn().mockReturnThis()
          };
        }
        return mockChains[name];
      }),
      command: mockCommand
    };

    cloud.database.mockReturnValue(mockDb);
    cloud.getWXContext.mockReturnValue({ OPENID: 'test-openid' });

    jest.isolateModules(() => {
      delete require.cache[require.resolve('../index')];
    });
    main = require('../index').main;
  });

  it('returns stats for a week with tasks', async () => {
    mockChains['tasks'] = {
      where: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({
        data: [
          { _id: '1', completed: true, date: '2026-05-11' },
          { _id: '2', completed: false, date: '2026-05-12' },
          { _id: '3', completed: true, date: '2026-05-13' },
          { _id: '4', completed: true, date: '2026-05-14' }
        ]
      }),
      orderBy: jest.fn().mockReturnThis()
    };
    mockChains['habits'] = {
      where: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({
        data: [{ _id: 'h1', name: '阅读' }]
      }),
      orderBy: jest.fn().mockReturnThis()
    };
    mockChains['checkins'] = {
      where: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({
        data: [
          { habit_id: 'h1', date: '2026-05-11' },
          { habit_id: 'h1', date: '2026-05-12' },
          { habit_id: 'h1', date: '2026-05-13' },
          { habit_id: 'h1', date: '2026-05-14' },
          { habit_id: 'h1', date: '2026-05-15' },
          { habit_id: 'h1', date: '2026-05-16' },
          { habit_id: 'h1', date: '2026-05-17' }
        ]
      }),
      orderBy: jest.fn().mockReturnThis()
    };

    const result = await main({
      action: 'weeklyStats',
      startDate: '2026-05-11',
      endDate: '2026-05-17'
    });

    expect(result.totalTasks).toBe(4);
    expect(result.completedTasks).toBe(3);
    expect(result.completionRate).toBe(75);
    expect(result.habitQualified).toBe(1);
  });

  it('returns zeros for empty week', async () => {
    const result = await main({
      action: 'weeklyStats',
      startDate: '2026-05-11',
      endDate: '2026-05-17'
    });

    expect(result.totalTasks).toBe(0);
    expect(result.completedTasks).toBe(0);
    expect(result.completionRate).toBe(0);
    expect(result.habitQualified).toBe(0);
  });

  it('returns error for unknown action', async () => {
    const result = await main({ action: 'unknown' });
    expect(result.error).toBe('Unknown action');
  });

  it('handles habit without full week checkins', async () => {
    mockChains['tasks'] = {
      where: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({ data: [] }),
      orderBy: jest.fn().mockReturnThis()
    };
    mockChains['habits'] = {
      where: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({
        data: [{ _id: 'h1', name: '阅读' }]
      }),
      orderBy: jest.fn().mockReturnThis()
    };
    mockChains['checkins'] = {
      where: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({
        data: [
          { habit_id: 'h1', date: '2026-05-11' },
          { habit_id: 'h1', date: '2026-05-12' }
        ]
      }),
      orderBy: jest.fn().mockReturnThis()
    };

    const result = await main({
      action: 'weeklyStats',
      startDate: '2026-05-11',
      endDate: '2026-05-17'
    });

    expect(result.habitQualified).toBe(0);
  });
});
