/**
 * 冒烟测试脚本 - UI登录到任务列表
 * 文件位置：team-docs/qa-reports/scripts/smoke/login-to-task-list.spec.js
 * 测试框架：Playwright
 * 测试内容：核心业务流程的快速验证
 * 执行时间：< 5分钟
 */

const { test, expect } = require('@playwright/test');

// 测试配置
const BASE_URL = process.env.BASE_URL || 'http://localhost:3101';
const TEST_USER = process.env.TEST_USER || 'test@test.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'test123';

test.describe('冒烟测试 - UI登录到任务列表', () => {
  
  test('SMOKE-001: 用户登录流程', async ({ page }) => {
    console.log('🚀 开始冒烟测试：用户登录流程');
    
    // 访问登录页面
    await page.goto(BASE_URL);
    
    // 清除缓存
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();
    
    // 验证：登录页面正常显示
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"], button:has-text("登录")')).toBeVisible();
    
    // 输入登录信息
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="邮箱"], input[placeholder*="用户名"]', TEST_USER);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    
    // 点击登录
    await page.click('button[type="submit"], button:has-text("登录"), button:has-text("Login")');
    
    // 验证：登录成功并跳转
    await page.waitForURL('**/tasks**', { timeout: 5000 });
    expect(page.url()).toContain('/tasks');
    
    console.log('✅ 登录流程通过');
  });

  test('SMOKE-002: 任务列表页面显示', async ({ page }) => {
    console.log('🚀 开始冒烟测试：任务列表页面显示');
    
    // 登录
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();
    
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="邮箱"], input[placeholder*="用户名"]', TEST_USER);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"], button:has-text("登录"), button:has-text("Login")');
    await page.waitForURL('**/tasks**', { timeout: 5000 });
    
    // 验证：任务列表页面正常显示
    await expect(page.locator('h1, h2, .title')).toContainText(/任务管理|Task Management/i);
    await expect(page.locator('table, .task-list, .list-group')).toBeVisible();
    
    // 验证：导航栏可见
    await expect(page.locator('nav, .navbar, .sidebar')).toBeVisible();
    
    // 验证：核心功能按钮可见
    await expect(page.locator('button:has-text("新建"), button:has-text("创建"), button:has-text("New")')).toBeVisible();
    
    console.log('✅ 任务列表页面显示通过');
  });

  test('SMOKE-003: Token保存验证', async ({ page }) => {
    console.log('🚀 开始冒烟测试：Token保存验证');
    
    // 登录
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();
    
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="邮箱"], input[placeholder*="用户名"]', TEST_USER);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"], button:has-text("登录"), button:has-text("Login")');
    await page.waitForURL('**/tasks**', { timeout: 5000 });
    
    // 验证：accessToken已保存
    const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
    expect(accessToken).toBeTruthy();
    
    // 验证：refreshToken已保存
    const refreshToken = await page.evaluate(() => localStorage.getItem('refreshToken'));
    expect(refreshToken).toBeTruthy();
    
    // 验证：refreshToken格式正确（JWT格式，包含type: refresh）
    const payload = JSON.parse(atob(refreshToken.split('.')[1]));
    expect(payload.type).toBe('refresh');
    expect(payload.email).toBe(TEST_USER);
    
    console.log('✅ Token保存验证通过');
  });

  test('SMOKE-004: 核心功能可用性', async ({ page }) => {
    console.log('🚀 开始冒烟测试：核心功能可用性');
    
    // 登录
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();
    
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="邮箱"], input[placeholder*="用户名"]', TEST_USER);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"], button:has-text("登录"), button:has-text("Login")');
    await page.waitForURL('**/tasks**', { timeout: 5000 });
    
    // 验证：新建任务功能可用
    await page.click('button:has-text("新建"), button:has-text("创建"), button:has-text("New")');
    await expect(page.locator('form, .modal, .dialog')).toBeVisible();
    
    // 关闭对话框（按ESC或点击取消）
    await page.keyboard.press('Escape');
    
    // 验证：搜索功能可用
    const searchInput = page.locator('input[type="search"], input[placeholder*="搜索"], input[placeholder*="Search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('测试');
      await page.waitForTimeout(500);
    }
    
    // 验证：筛选功能可用
    const filterSelect = page.locator('select[name="status"], .status-filter, select').first();
    if (await filterSelect.isVisible()) {
      await filterSelect.selectOption({ index: 1 });
      await page.waitForTimeout(500);
    }
    
    console.log('✅ 核心功能可用性通过');
  });

  test('SMOKE-005: 页面性能验证', async ({ page }) => {
    console.log('🚀 开始冒烟测试：页面性能验证');
    
    const startTime = Date.now();
    
    // 登录
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();
    
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="邮箱"], input[placeholder*="用户名"]', TEST_USER);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"], button:has-text("登录"), button:has-text("Login")');
    await page.waitForURL('**/tasks**', { timeout: 5000 });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // 验证：整个流程在5秒内完成
    expect(duration).toBeLessThan(5000);
    
    console.log(`✅ 页面性能验证通过（耗时：${duration}ms）`);
  });

  test('SMOKE-006: 错误检查', async ({ page }) => {
    console.log('🚀 开始冒烟测试：错误检查');
    
    // 监听控制台错误
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // 登录
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();
    
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="邮箱"], input[placeholder*="用户名"]', TEST_USER);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"], button:has-text("登录"), button:has-text("Login")');
    await page.waitForURL('**/tasks**', { timeout: 5000 });
    
    // 验证：无JavaScript错误
    expect(errors).toHaveLength(0);
    
    console.log('✅ 错误检查通过');
  });

  test('SMOKE-007: 完整流程集成测试', async ({ page }) => {
    console.log('🚀 开始冒烟测试：完整流程集成测试');
    
    // 1. 访问登录页面
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();
    console.log('✓ 步骤1: 访问登录页面');
    
    // 2. 登录
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="邮箱"], input[placeholder*="用户名"]', TEST_USER);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"], button:has-text("登录"), button:has-text("Login")');
    await page.waitForURL('**/tasks**', { timeout: 5000 });
    console.log('✓ 步骤2: 登录成功');
    
    // 3. 验证任务列表页面
    await expect(page.locator('table, .task-list')).toBeVisible();
    console.log('✓ 步骤3: 任务列表页面正常');
    
    // 4. 创建任务
    await page.click('button:has-text("新建"), button:has-text("创建"), button:has-text("New")');
    await expect(page.locator('form, .modal')).toBeVisible();
    
    const taskTitle = `冒烟测试任务_${Date.now()}`;
    await page.fill('input[name="title"], input[placeholder*="标题"]', taskTitle);
    await page.click('button[type="submit"], button:has-text("保存")');
    
    await expect(page.locator('.success, .alert-success')).toBeVisible({ timeout: 3000 });
    await page.waitForSelector(`text=${taskTitle}`, { timeout: 5000 });
    console.log('✓ 步骤4: 创建任务成功');
    
    // 5. 验证任务显示
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible();
    console.log('✓ 步骤5: 任务显示正常');
    
    console.log('🎉 完整流程集成测试通过');
  });
});
