// Jest测试配置 - QA子模块
module.exports = {
  // 测试环境
  testEnvironment: 'node',

  // 测试文件匹配模式
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],

  // 覆盖率配置
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  // 测试超时时间（毫秒）
  testTimeout: 30000,

  // 模块路径映射
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
