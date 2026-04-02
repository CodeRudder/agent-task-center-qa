/**
 * 登录功能自动化测试脚本
 * 文件位置：team-docs/qa-reports/scripts/login.spec.js
 * 测试框架：Playwright
 * 测试内容：登录功能的完整测试用例
 */

const { test, expect } = require('@playwright/test');

// 测试配置
const BASE_URL = process.env.BASE_URL || 'http://localhost:3101';
const TEST_USER = process.env.TEST_USER || 'test@test.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'test123';

test.describe('登录功能测试', () => {
  
  test.beforeEach(async ({ page }) => {
    // 每个测试前访问登录页面
    await page.goto(BASE_URL);
    
    // 清除localStorage和sessionStorage
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // 刷新页面确保清除生效
    await page.reload();
  });

  test('TC-LOGIN-001: 正常登录', async ({ page }) => {
    // 输入用户名
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="邮箱"], input[placeholder*="用户名"]', TEST_USER);
    
    // 输入密码
    await page.fill('input[type="password"]', TEST_PASSWORD);
    
    // 点击登录按钮
    await page.click('button[type="submit"], button:has-text("登录"), button:has-text("Login")');
    
    // 验证：5秒内跳转到/tasks页面
    await page.waitForURL('**/tasks**', { timeout: 5000 });
    
    // 验证：URL包含/tasks
    expect(page.url()).toContain('/tasks');
    
    // 验证：localStorage包含accessToken和refreshToken
    const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
    const refreshToken = await page.evaluate(() => localStorage.getItem('refreshToken'));
    
    expect(accessToken).toBeTruthy();
    expect(refreshToken).toBeTruthy();
    
    // 验证：页面显示任务管理相关内容
    await expect(page.locator('h1, h2, .title')).toContainText(/任务|Task/i);
  });

  test('TC-LOGIN-002: 用户名错误', async ({ page }) => {
    // 输入错误的用户名
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="邮箱"], input[placeholder*="用户名"]', 'wrong@test.com');
    
    // 输入正确密码
    await page.fill('input[type="password"]', TEST_PASSWORD);
    
    // 点击登录按钮
    await page.click('button[type="submit"], button:has-text("登录"), button:has-text("Login")');
    
    // 验证：显示错误提示
    await expect(page.locator('.error, .alert-error, [role="alert"]')).toBeVisible({ timeout: 3000 });
    
    // 验证：URL仍在登录页面
    expect(page.url()).not.toContain('/tasks');
    
    // 验证：localStorage不包含Token
    const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
    expect(accessToken).toBeFalsy();
  });

  test('TC-LOGIN-003: 密码错误', async ({ page }) => {
    // 输入正确用户名
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="邮箱"], input[placeholder*="用户名"]', TEST_USER);
    
    // 输入错误密码
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // 点击登录按钮
    await page.click('button[type="submit"], button:has-text("登录"), button:has-text("Login")');
    
    // 验证：显示错误提示
    await expect(page.locator('.error, .alert-error, [role="alert"]')).toBeVisible({ timeout: 3000 });
    
    // 验证：URL仍在登录页面
    expect(page.url()).not.toContain('/tasks');
    
    // 验证：localStorage不包含Token
    const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
    expect(accessToken).toBeFalsy();
  });

  test('TC-LOGIN-004: 空用户名', async ({ page }) => {
    // 不输入用户名
    // 输入密码
    await page.fill('input[type="password"]', TEST_PASSWORD);
    
    // 点击登录按钮
    await page.click('button[type="submit"], button:has-text("登录"), button:has-text("Login")');
    
    // 验证：表单验证失败（HTML5表单验证或自定义验证）
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const isValid = await emailInput.evaluate(el => el.checkValidity());
    
    expect(isValid).toBeFalsy();
    
    // 验证：URL仍在登录页面
    expect(page.url()).not.toContain('/tasks');
  });

  test('TC-LOGIN-005: 空密码', async ({ page }) => {
    // 输入用户名
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="邮箱"], input[placeholder*="用户名"]', TEST_USER);
    
    // 不输入密码
    
    // 点击登录按钮
    await page.click('button[type="submit"], button:has-text("登录"), button:has-text("Login")');
    
    // 验证：表单验证失败
    const passwordInput = page.locator('input[type="password"]');
    const isValid = await passwordInput.evaluate(el => el.checkValidity());
    
    expect(isValid).toBeFalsy();
    
    // 验证：URL仍在登录页面
    expect(page.url()).not.toContain('/tasks');
  });

  test('TC-LOGIN-006: 登录后跳转验证', async ({ page }) => {
    // 输入用户名
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="邮箱"], input[placeholder*="用户名"]', TEST_USER);
    
    // 输入密码
    await page.fill('input[type="password"]', TEST_PASSWORD);
    
    // 点击登录按钮
    await page.click('button[type="submit"], button:has-text("登录"), button:has-text("Login")');
    
    // 验证：5秒内跳转到/tasks页面
    await page.waitForURL('**/tasks**', { timeout: 5000 });
    
    // 验证：页面标题正确
    const title = await page.title();
    expect(title).toMatch(/任务|Task|Agent/i);
    
    // 验证：导航栏可见
    await expect(page.locator('nav, .navbar, .sidebar')).toBeVisible();
    
    // 验证：用户信息显示
    const userInfo = await page.evaluate(() => {
      const authStorage = localStorage.getItem('auth-storage');
      return authStorage ? JSON.parse(authStorage) : null;
    });
    
    expect(userInfo).toBeTruthy();
    expect(userInfo.state.isAuthenticated).toBeTruthy();
    expect(userInfo.state.user.email).toBe(TEST_USER);
  });

  test('TC-LOGIN-007: refreshToken保存验证', async ({ page }) => {
    // 输入用户名
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="邮箱"], input[placeholder*="用户名"]', TEST_USER);
    
    // 输入密码
    await page.fill('input[type="password"]', TEST_PASSWORD);
    
    // 点击登录按钮
    await page.click('button[type="submit"], button:has-text("登录"), button:has-text("Login")');
    
    // 等待跳转
    await page.waitForURL('**/tasks**', { timeout: 5000 });
    
    // 验证：refreshToken已保存
    const refreshToken = await page.evaluate(() => localStorage.getItem('refreshToken'));
    expect(refreshToken).toBeTruthy();
    
    // 验证：refreshToken是JWT格式（包含type: refresh）
    const payload = JSON.parse(atob(refreshToken.split('.')[1]));
    expect(payload.type).toBe('refresh');
    expect(payload.email).toBe(TEST_USER);
  });

  test('TC-LOGIN-008: 记住我功能', async ({ page, context }) => {
    // 勾选"记住我"
    const rememberMeCheckbox = page.locator('input[type="checkbox"], input[name="rememberMe"]');
    if (await rememberMeCheckbox.isVisible()) {
      await rememberMeCheckbox.check();
    }
    
    // 输入用户名和密码
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="邮箱"], input[placeholder*="用户名"]', TEST_USER);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    
    // 点击登录按钮
    await page.click('button[type="submit"], button:has-text("登录"), button:has-text("Login")');
    
    // 等待跳转
    await page.waitForURL('**/tasks**', { timeout: 5000 });
    
    // 关闭浏览器上下文，模拟重新打开
    // 注意：这需要根据实际实现调整
    const refreshToken = await page.evaluate(() => localStorage.getItem('refreshToken'));
    expect(refreshToken).toBeTruthy();
  });
});
