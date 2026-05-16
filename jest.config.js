module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/miniprogram/$1',
    '^wx-server-sdk$': '<rootDir>/__mocks__/wx-server-sdk.js'
  },
  testMatch: [
    '**/__tests__/**/*.test.js'
  ],
  moduleFileExtensions: ['js', 'json'],
  setupFiles: ['<rootDir>/__mocks__/wx.js']
};
