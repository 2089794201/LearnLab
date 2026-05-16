module.exports = {
  init: jest.fn(),
  database: jest.fn(() => ({
    collection: jest.fn().mockReturnThis(),
    command: {
      eq: jest.fn(),
      neq: jest.fn(),
      gt: jest.fn(),
      gte: jest.fn(),
      lt: jest.fn(),
      lte: jest.fn(),
      and: jest.fn(),
      or: jest.fn()
    }
  })),
  DYNAMIC_CURRENT_ENV: 'test-env',
  getWXContext: jest.fn(() => ({ OPENID: 'test-openid' })),
  uploadFile: jest.fn().mockResolvedValue({ fileID: 'cloud://test.json' }),
  downloadFile: jest.fn().mockResolvedValue({ tempFilePath: '/tmp/file' })
};
