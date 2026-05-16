const cloud = require('wx-server-sdk');

describe('habitFunctions - updateStreak', () => {
  let main;
  let mockDoc;
  let mockCheckinsChain;

  beforeEach(() => {
    jest.clearAllMocks();

    const mockCommand = {
      and: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis()
    };

    mockDoc = {
      get: jest.fn(),
      update: jest.fn().mockResolvedValue({ stats: { updated: 1 } })
    };

    mockCheckinsChain = {
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      get: jest.fn(),
      field: jest.fn().mockReturnThis()
    };

    const mockDb = {
      collection: jest.fn((name) => {
        const chain = { ...mockCheckinsChain };
        chain.doc = jest.fn().mockReturnValue(mockDoc);
        return chain;
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

  it('first checkin sets streak to 1', async () => {
    mockDoc.get.mockResolvedValue({
      data: { _id: 'h1', name: '阅读', streak: 0, best_streak: 0, last_checkin_date: '' }
    });
    mockCheckinsChain.get.mockResolvedValue({
      data: [{ _id: 'c1', habit_id: 'h1', date: '2026-05-16' }]
    });

    const result = await main({ action: 'updateStreak', habitId: 'h1', date: '2026-05-16' });
    expect(result.streak).toBe(1);
  });

  it('consecutive checkin increments streak', async () => {
    mockDoc.get.mockResolvedValue({
      data: { _id: 'h1', name: '阅读', streak: 5, best_streak: 5, last_checkin_date: '2026-05-15' }
    });
    mockCheckinsChain.get.mockResolvedValue({
      data: [{ _id: 'c1', habit_id: 'h1', date: '2026-05-16' }]
    });

    const result = await main({ action: 'updateStreak', habitId: 'h1', date: '2026-05-16' });
    expect(result.streak).toBe(6);
  });

  it('streak resets when gap in checkins', async () => {
    mockDoc.get.mockResolvedValue({
      data: { _id: 'h1', name: '阅读', streak: 5, best_streak: 10, last_checkin_date: '2026-05-13' }
    });
    mockCheckinsChain.get.mockResolvedValue({
      data: [{ _id: 'c1', habit_id: 'h1', date: '2026-05-16' }]
    });

    const result = await main({ action: 'updateStreak', habitId: 'h1', date: '2026-05-16' });
    expect(result.streak).toBe(1);
  });

  it('duplicate checkin on same day does nothing', async () => {
    mockDoc.get.mockResolvedValue({
      data: { _id: 'h1', name: '阅读', streak: 5, best_streak: 5, last_checkin_date: '2026-05-16' }
    });
    mockCheckinsChain.get.mockResolvedValue({
      data: [{ _id: 'c1', habit_id: 'h1', date: '2026-05-16' }]
    });

    const result = await main({ action: 'updateStreak', habitId: 'h1', date: '2026-05-16' });
    expect(result.streak).toBe(5);
  });

  it('uncheck recalculates streak from history', async () => {
    mockDoc.get.mockResolvedValue({
      data: { _id: 'h1', name: '阅读', streak: 5, best_streak: 10, last_checkin_date: '2026-05-16' }
    });
    mockCheckinsChain.get
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({
        data: [
          { _id: 'c1', habit_id: 'h1', date: '2026-05-16' },
          { _id: 'c2', habit_id: 'h1', date: '2026-05-15' },
          { _id: 'c3', habit_id: 'h1', date: '2026-05-14' }
        ]
      });

    const result = await main({ action: 'updateStreak', habitId: 'h1', date: '2026-05-16' });
    expect(result.streak).toBe(3);
    expect(result.best_streak).toBe(10);
  });

  it('uncheck with no remaining checkins sets streak to 0', async () => {
    mockDoc.get.mockResolvedValue({
      data: { _id: 'h1', name: '阅读', streak: 1, best_streak: 5, last_checkin_date: '2026-05-16' }
    });
    mockCheckinsChain.get
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: [] });

    const result = await main({ action: 'updateStreak', habitId: 'h1', date: '2026-05-16' });
    expect(result.streak).toBe(0);
  });

  it('streak exceeds best_streak updates best', async () => {
    mockDoc.get.mockResolvedValue({
      data: { _id: 'h1', name: '阅读', streak: 10, best_streak: 10, last_checkin_date: '2026-05-15' }
    });
    mockCheckinsChain.get.mockResolvedValue({
      data: [{ _id: 'c1', habit_id: 'h1', date: '2026-05-16' }]
    });

    const result = await main({ action: 'updateStreak', habitId: 'h1', date: '2026-05-16' });
    expect(result.streak).toBe(11);
    expect(result.best_streak).toBe(11);
  });

  it('returns error for unknown action', async () => {
    const result = await main({ action: 'unknown' });
    expect(result.error).toBe('Unknown action');
  });
});
