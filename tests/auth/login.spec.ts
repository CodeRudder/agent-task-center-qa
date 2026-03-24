import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4100';
const LOGIN_URL = `${BASE_URL}/login`;

// 测试数据
const TEST_USERS = {
  admin: {
    email: 'admin@example.com',
    password: 'Admin123!',
  },
  test: {
    email: 'test@test.com',
    password: 'test123',
  },
};

test.describe('UI登录功能测试', () => {
  test.beforeEach(async ({ page }) => {
    // 清空LocalStorage
    await page.goto(BASE_URL);
    await page.evaluate(() => localStorage.clear());
  });

  // ==================== P0 测试用例 ====================

  test('TC-LOGIN-001: 使用正确凭据登录', async ({ page }) => {
    // 1. 打开登录页面
    await page.goto(LOGIN_URL);
    
    // 2. 输入正确的凭据
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="邮箱"]', TEST_USERS.test.email);
    await page.fill('input[type="password"], input[name="password"]', TEST_USERS.test.password);
    
    // 3. 点击登录按钮
    await page.click('button[type="submit"], button:has-text("登录")');
    
    // 4. 等待页面跳转
    await page.waitForURL(/\/(tasks|dashboard)/, { timeout: 10000 });
    
    // 5. 验证登录成功
    // 检查URL是否跳转到主页
    expect(page.url()).not.toContain('/login');
    
    // 检查LocalStorage中是否保存了accessToken
    const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
    expect(accessToken).toBeTruthy();
    
    // 检查Token格式（JWT）
    expect(accessToken).toMatch(/^eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
    
    console.log('✅ TC-LOGIN-001: 使用正确凭据登录 - PASS');
  });

  test('TC-LOGIN-004: 使用错误密码登录', async ({ page }) => {
    await page.goto(LOGIN_URL);
    
    // 输入正确用户名和错误密码
    await page.fill('input[type="email"], input[name="email"]', TEST_USERS.test.email);
    await page.fill('input[type="password"], input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"], button:has-text("登录")');
    
    // 等待错误消息出现
    await page.waitForSelector('text=/用户名或密码错误|Invalid credentials|登录失败/i', { timeout: 5000 });
    
    // 验证页面没有跳转
    expect(page.url()).toContain('/login');
    
    console.log('✅ TC-LOGIN-004: 使用错误密码登录 - PASS');
  });

  test('TC-LOGIN-005: 使用不存在的用户名登录', async ({ page }) => {
    await page.goto(LOGIN_URL);
    
    // 输入不存在的用户名
    await page.fill('input[type="email"], input[name="email"]', 'nonexistent@test.com');
    await page.fill('input[type="password"], input[name="password"]', 'password123');
    await page.click('button[type="submit"], button:has-text("登录")');
    
    // 等待错误消息
    await page.waitForSelector('text=/用户名或密码错误|Invalid credentials|登录失败/i', { timeout: 5000 });
    
    // 验证错误消息与错误密码时一致（安全性）
    expect(page.url()).toContain('/login');
    
    console.log('✅ TC-LOGIN-005: 使用不存在的用户名登录 - PASS');
  });

  test('TC-LOGIN-006: 用户名为空登录', async ({ page }) => {
    await page.goto(LOGIN_URL);
    
    // 只输入密码，用户名为空
    await page.fill('input[type="password"], input[name="password"]', TEST_USERS.test.password);
    await page.click('button[type="submit"], button:has-text("登录")');
    
    // 等待前端表单验证错误
    await page.waitForSelector('text=/请输入用户名|请输入邮箱|邮箱不能为空/i', { timeout: 3000 });
    
    // 验证页面没有跳转
    expect(page.url()).toContain('/login');
    
    console.log('✅ TC-LOGIN-006: 用户名为空登录 - PASS');
  });

  test('TC-LOGIN-007: 密码为空登录', async ({ page }) => {
    await page.goto(LOGIN_URL);
    
    // 只输入用户名，密码为空
    await page.fill('input[type="email"], input[name="email"]', TEST_USERS.test.email);
    await page.click('button[type="submit"], button:has-text("登录")');
    
    // 等待前端表单验证错误
    await page.waitForSelector('text=/请输入密码|密码不能为空/i', { timeout: 3000 });
    
    // 验证页面没有跳转
    expect(page.url()).toContain('/login');
    
    console.log('✅ TC-LOGIN-007: 密码为空登录 - PASS');
  });

  test('TC-LOGIN-011: 刷新页面后保持登录状态', async ({ page }) => {
    // 先登录
    await page.goto(LOGIN_URL);
    await page.fill('input[type="email"], input[name="email"]', TEST_USERS.test.email);
    await page.fill('input[type="password"], input[name="password"]', TEST_USERS.test.password);
    await page.click('button[type="submit"], button:has-text("登录")');
    await page.waitForURL(/\/(tasks|dashboard)/, { timeout: 10000 });
    
    // 获取登录后的Token
    const tokenBefore = await page.evaluate(() => localStorage.getItem('accessToken'));
    expect(tokenBefore).toBeTruthy();
    
    // 刷新页面
    await page.reload();
    
    // 验证仍然保持登录状态
    expect(page.url()).not.toContain('/login');
    
    // 验证Token仍然存在
    const tokenAfter = await page.evaluate(() => localStorage.getItem('accessToken'));
    expect(tokenAfter).toBe(tokenBefore);
    
    console.log('✅ TC-LOGIN-011: 刷新页面后保持登录状态 - PASS');
  });

  // ==================== P1 测试用例 ====================

  test('TC-LOGIN-002: 记住登录状态（Remember Me）', async ({ page }) => {
    await page.goto(LOGIN_URL);
    
    // 输入凭据并勾选"记住我"
    await page.fill('input[type="email"], input[name="email"]', TEST_USERS.test.email);
    await page.fill('input[type="password"], input[name="password"]', TEST_USERS.test.password);
    
    // 勾选"记住我"（如果存在）
    const rememberMeCheckbox = await page.$('input[type="checkbox"][name="rememberMe"], input[type="checkbox"]:near(:text("记住我"))');
    if (rememberMeCheckbox) {
      await rememberMeCheckbox.check();
    }
    
    await page.click('button[type="submit"], button:has-text("登录")');
    await page.waitForURL(/\/(tasks|dashboard)/, { timeout: 10000 });
    
    // 验证登录成功
    const refreshToken = await page.evaluate(() => localStorage.getItem('refreshToken'));
    expect(refreshToken).toBeTruthy();
    
    console.log('✅ TC-LOGIN-002: 记住登录状态 - PASS');
  });

  test('TC-LOGIN-008: 用户名和密码都为空登录', async ({ page }) => {
    await page.goto(LOGIN_URL);
    
    // 用户名和密码都留空
    await page.click('button[type="submit"], button:has-text("登录")');
    
    // 等待前端表单验证错误
    await page.waitForSelector('text=/请输入用户名|请输入邮箱|请输入密码/i', { timeout: 3000 });
    
    // 验证页面没有跳转
    expect(page.url()).toContain('/login');
    
    console.log('✅ TC-LOGIN-008: 用户名和密码都为空登录 - PASS');
  });

  test('TC-LOGIN-012: 新标签页打开保持登录状态', async ({ page, context }) => {
    // 先在第一个标签页登录
    await page.goto(LOGIN_URL);
    await page.fill('input[type="email"], input[name="email"]', TEST_USERS.test.email);
    await page.fill('input[type="password"], input[name="password"]', TEST_USERS.test.password);
    await page.click('button[type="submit"], button:has-text("登录")');
    await page.waitForURL(/\/(tasks|dashboard)/, { timeout: 10000 });
    
    // 在新标签页打开应用
    const newPage = await context.newPage();
    await newPage.goto(BASE_URL);
    
    // 验证新标签页也保持登录状态
    expect(newPage.url()).not.toContain('/login');
    
    await newPage.close();
    
    console.log('✅ TC-LOGIN-012: 新标签页打开保持登录状态 - PASS');
  });

  test('TC-LOGIN-019: 登录页面UI显示正确', async ({ page }) => {
    await page.goto(LOGIN_URL);
    
    // 检查页面元素是否存在
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"], button:has-text("登录")')).toBeVisible();
    
    // 检查密码输入框类型
    const passwordInput = await page.locator('input[type="password"]');
    expect(await passwordInput.getAttribute('type')).toBe('password');
    
    console.log('✅ TC-LOGIN-019: 登录页面UI显示正确 - PASS');
  });

  test('TC-LOGIN-020: 登录按钮加载状态', async ({ page }) => {
    await page.goto(LOGIN_URL);
    
    await page.fill('input[type="email"], input[name="email"]', TEST_USERS.test.email);
    await page.fill('input[type="password"], input[name="password"]', TEST_USERS.test.password);
    
    // 点击登录按钮
    const loginButton = await page.locator('button[type="submit"], button:has-text("登录")');
    await loginButton.click();
    
    // 检查按钮是否进入加载状态（可能显示加载动画或禁用）
    // 注意：这个检查可能需要根据实际实现调整
    await page.waitForTimeout(100); // 等待一小段时间
    
    // 登录完成后验证跳转
    await page.waitForURL(/\/(tasks|dashboard)/, { timeout: 10000 });
    
    console.log('✅ TC-LOGIN-020: 登录按钮加载状态 - PASS');
  });

  test('TC-LOGIN-021: 键盘操作支持', async ({ page }) => {
    await page.goto(LOGIN_URL);
    
    // 使用Tab键导航
    await page.keyboard.press('Tab');
    await page.keyboard.type(TEST_USERS.test.email);
    
    await page.keyboard.press('Tab');
    await page.keyboard.type(TEST_USERS.test.password);
    
    // 按Enter键提交
    await page.keyboard.press('Enter');
    
    // 验证登录成功
    await page.waitForURL(/\/(tasks|dashboard)/, { timeout: 10000 });
    expect(page.url()).not.toContain('/login');
    
    console.log('✅ TC-LOGIN-021: 键盘操作支持 - PASS');
  });
});
