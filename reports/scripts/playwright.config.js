/**
 * Playwright测试配置文件
 * 文件位置：team-docs/qa-reports/scripts/playwright.config.js
 */

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // 测试目录
  testDir: './',
  
  // 测试匹配模式
  testMatch: '**/*.spec.js',
  
  // 全局超时时间（30分钟）
  timeout: 30 * 60 * 1000,
  
  // 单个测试超时时间（10秒）
  expect: {
    timeout: 10000
  },
  
  // 失败重试次数
  retries: process.env.CI ? 2 : 0,
  
  // 并行工作进程数
  workers: process.env.CI ? 1 : undefined,
  
  // 报告器配置
  reporter: [
    ['html', { outputFolder: 'test-results/html' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list']
  ],
  
  // 全局设置
  use: {
    // 基础URL
    baseURL: process.env.BASE_URL || 'http://localhost:3101',
    
    // 浏览器上下文配置
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // 导航超时
    navigationTimeout: 10000,
    
    // 操作超时
    actionTimeout: 10000,
  },
  
  // 测试项目配置
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  
  // Web Server配置（可选，如果需要自动启动服务器）
  // webServer: {
  //   command: 'npm run start',
  //   port: 3101,
  //   timeout: 120 * 1000,
  //   reuseExistingServer: !process.env.CI,
  // },
});
