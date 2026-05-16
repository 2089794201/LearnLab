const cloud = require('wx-server-sdk');

describe('exportFunctions - exportAll', () => {
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
    cloud.uploadFile.mockResolvedValue({ fileID: 'cloud://export-file.json' });

    jest.isolateModules(() => {
      delete require.cache[require.resolve('../index')];
    });
    main = require('../index').main;
  });

  it('exports all user data', async () => {
    mockChains['tasks'] = {
      where: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({
        data: [{ _id: 't1', name: 'Task 1', date: '2026-05-16' }]
      }),
      orderBy: jest.fn().mockReturnThis()
    };
    mockChains['habits'] = {
      where: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({
        data: [{ _id: 'h1', name: '阅读', streak: 5 }]
      }),
      orderBy: jest.fn().mockReturnThis()
    };
    mockChains['checkins'] = {
      where: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({
        data: [{ _id: 'c1', habit_id: 'h1', date: '2026-05-16' }]
      }),
      orderBy: jest.fn().mockReturnThis()
    };

    const result = await main({ action: 'exportAll' });
    expect(result.fileID).toBe('cloud://export-file.json');
    expect(result.fileName).toContain('learnlab-export-');
    expect(cloud.uploadFile).toHaveBeenCalled();
  });

  it('uploadFile receives JSON content', async () => {
    mockChains['tasks'] = {
      where: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({
        data: [{ _id: 't1', name: 'Task 1', date: '2026-05-16' }]
      }),
      orderBy: jest.fn().mockReturnThis()
    };
    mockChains['habits'] = {
      where: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({
        data: [{ _id: 'h1', name: '阅读', streak: 5 }]
      }),
      orderBy: jest.fn().mockReturnThis()
    };
    mockChains['checkins'] = {
      where: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({
        data: [{ _id: 'c1', habit_id: 'h1', date: '2026-05-16' }]
      }),
      orderBy: jest.fn().mockReturnThis()
    };

    await main({ action: 'exportAll' });
    const uploadCall = cloud.uploadFile.mock.calls[0][0];
    expect(uploadCall.cloudPath).toContain('exports/test-openid/learnlab-export-');
    expect(uploadCall.fileContent).toBeDefined();
  });

  it('returns error for unknown action', async () => {
    const result = await main({ action: 'unknown' });
    expect(result.error).toBe('Unknown action');
  });
});
