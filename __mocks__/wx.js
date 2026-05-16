const mockCollection = () => {
  const mockDoc = {
    get: jest.fn().mockResolvedValue({ data: {} }),
    update: jest.fn().mockResolvedValue({ stats: { updated: 1 } }),
    remove: jest.fn().mockResolvedValue({ stats: { removed: 1 } })
  };

  const mockWhere = {
    get: jest.fn().mockResolvedValue({ data: [] }),
    update: jest.fn().mockResolvedValue({ stats: { updated: 0 } }),
    remove: jest.fn().mockResolvedValue({ stats: { removed: 0 } }),
    orderBy: jest.fn().mockReturnThis(),
    field: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis()
  };

  return {
    doc: jest.fn().mockReturnValue(mockDoc),
    add: jest.fn().mockResolvedValue({ _id: 'mock-id' }),
    where: jest.fn().mockReturnValue(mockWhere),
    get: jest.fn().mockResolvedValue({ data: [] }),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis()
  };
};

const createChainableCommand = (depth = 0) => {
  if (depth > 2) return {};
  const cmd = {};
  cmd.and = jest.fn(() => createChainableCommand(depth + 1));
  cmd.or = jest.fn(() => createChainableCommand(depth + 1));
  return cmd;
};

const mockDatabase = () => ({
  collection: jest.fn().mockReturnValue(mockCollection()),
  command: {
    eq: jest.fn(() => createChainableCommand(1)),
    neq: jest.fn(() => createChainableCommand(1)),
    gt: jest.fn(() => createChainableCommand(1)),
    gte: jest.fn(() => createChainableCommand(1)),
    lt: jest.fn(() => createChainableCommand(1)),
    lte: jest.fn(() => createChainableCommand(1)),
    and: jest.fn(() => createChainableCommand(1)),
    or: jest.fn(() => createChainableCommand(1))
  },
  RegExp: jest.fn().mockReturnValue('regexp')
});

const mockCloud = {
  init: jest.fn(),
  database: jest.fn().mockReturnValue(mockDatabase()),
  callFunction: jest.fn().mockResolvedValue({ result: {} }),
  uploadFile: jest.fn().mockResolvedValue({ fileID: 'cloud://test.pdf' }),
  downloadFile: jest.fn().mockResolvedValue({ tempFilePath: '/tmp/file' }),
  getWXContext: jest.fn().mockReturnValue({ OPENID: 'test-openid' })
};

global.wx = {
  cloud: mockCloud,
  login: jest.fn().mockResolvedValue({ code: 'mock-code' }),
  showToast: jest.fn(),
  showModal: jest.fn().mockImplementation(({ success }) => {
    if (success) success({ confirm: true });
  }),
  showLoading: jest.fn(),
  hideLoading: jest.fn(),
  showNavigationBarLoading: jest.fn(),
  hideNavigationBarLoading: jest.fn(),
  navigateTo: jest.fn(),
  redirectTo: jest.fn(),
  switchTab: jest.fn(),
  openSetting: jest.fn(),
  getStorageSync: jest.fn(),
  setStorageSync: jest.fn(),
  getStorage: jest.fn(),
  setStorage: jest.fn(),
  removeStorageSync: jest.fn(),
  clearStorageSync: jest.fn(),
  onNetworkStatusChange: jest.fn(),
  getSystemInfoSync: jest.fn().mockReturnValue({
    platform: 'devtools',
    model: 'iPhone 14'
  }),
  setNavigationBarTitle: jest.fn(),
  setNavigationBarColor: jest.fn()
};
