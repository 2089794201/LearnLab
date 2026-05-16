describe('taskFunctions', () => {
  let main;
  let cloud;

  beforeEach(() => {
    jest.resetModules();
    cloud = require('wx-server-sdk');

    const mockCommand = {
      and: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis()
    };

    const mockChain = {
      where: jest.fn().mockReturnThis(),
      field: jest.fn().mockReturnThis(),
      get: jest.fn(),
      orderBy: jest.fn().mockReturnThis()
    };

    const mockDb = {
      collection: jest.fn().mockReturnValue(mockChain),
      command: mockCommand
    };

    cloud.database.mockReturnValue(mockDb);
    cloud.getWXContext.mockReturnValue({ OPENID: 'test-openid' });

    main = require('../index').main;
  });

  it('batchQuery returns unique dates', async () => {
    const { collection } = cloud.database();
    const chain = collection();
    chain.get.mockResolvedValue({
      data: [
        { date: '2026-05-16' },
        { date: '2026-05-16' },
        { date: '2026-05-17' }
      ]
    });

    const result = await main({ action: 'batchQuery', year: 2026, month: 5 });
    expect(result.dates).toEqual(['2026-05-16', '2026-05-17']);
  });

  it('batchQuery returns empty for no tasks', async () => {
    const { collection } = cloud.database();
    const chain = collection();
    chain.get.mockResolvedValue({ data: [] });

    const result = await main({ action: 'batchQuery', year: 2026, month: 5 });
    expect(result.dates).toEqual([]);
  });

  it('returns error for unknown action', async () => {
    const result = await main({ action: 'unknown' });
    expect(result.error).toBe('Unknown action');
  });

  it('handles February date range', async () => {
    const { collection } = cloud.database();
    const chain = collection();
    chain.get.mockResolvedValue({ data: [] });

    const result = await main({ action: 'batchQuery', year: 2026, month: 2 });
    expect(result.dates).toEqual([]);
  });
});
