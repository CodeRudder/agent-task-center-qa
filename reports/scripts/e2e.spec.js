/**
 * 端到端测试脚本
 * 文件位置：team-docs/qa-reports/scripts/e2e.spec.js
 * 测试框架：Playwright
 * 测试内容：完整用户流程测试（登录 → 任务列表 → 创建任务 → 编辑任务 → 删除任务 → 登出）
 */

const { test, expect } = require('@playwright/test');

// 测试配置
const BASE_URL = process.env.BASE_URL || 'http://localhost:3101';
const TEST_USER = process.env.TEST_USER || 'test@test.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'test123';

test.describe('端到端用户流程测试', () => {
  
  test('E2E-001: 完整用户流程', async ({ page }) => {
    
    // ========== 1. 登录流程 ==========
    console.log('步骤1: 访问登录页面');
    await page.goto(BASE_URL);
    
    // 清除缓存
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();
    
    console.log('步骤2: 输入登录信息');
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="邮箱"], input[placeholder*="用户名"]', TEST_USER);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    
    console.log('步骤3: 点击登录按钮');
    await page.click('button[type="submit"], button:has-text("登录"), button:has-text("Login")');
    
    console.log('步骤4: 验证登录成功');
    await page.waitForURL('**/tasks**', { timeout: 5000 });
    expect(page.url()).toContain('/tasks');
    
    // 验证Token已保存
    const accessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
    const refreshToken = await page.evaluate(() => localStorage.getItem('refreshToken'));
    expect(accessToken).toBeTruthy();
    expect(refreshToken).toBeTruthy();
    
    console.log('✅ 登录成功');
    
    // ========== 2. 任务列表页面验证 ==========
    console.log('步骤5: 验证任务列表页面');
    
    // 验证页面标题
    await expect(page.locator('h1, h2, .title')).toContainText(/任务管理|Task Management/i);
    
    // 验证任务列表可见
    await expect(page.locator('table, .task-list, .list-group')).toBeVisible();
    
    console.log('✅ 任务列表页面正常');
    
    // ========== 3. 创建任务 ==========
    console.log('步骤6: 创建新任务');
    
    // 点击新建按钮
    await page.click('button:has-text("新建"), button:has-text("创建"), button:has-text("New")');
    
    // 等待表单出现
    await expect(page.locator('form, .modal, .dialog')).toBeVisible();
    
    // 填写任务信息
    const taskTitle = `E2E测试任务_${Date.now()}`;
    await page.fill('input[name="title"], input[placeholder*="标题"], input[placeholder*="任务"]', taskTitle);
    
    const descInput = page.locator('textarea[name="description"], textarea[placeholder*="描述"]');
    if (await descInput.isVisible()) {
      await descInput.fill('这是一个端到端测试创建的任务');
    }
    
    // 提交表单
    await page.click('button[type="submit"], button:has-text("保存"), button:has-text("创建")');
    
    // 验证创建成功
    await expect(page.locator('.success, .alert-success, [role="alert"]')).toBeVisible({ timeout: 3000 });
    
    // 验证任务出现在列表中
    await page.waitForSelector(`text=${taskTitle}`, { timeout: 5000 });
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible();
    
    console.log('✅ 任务创建成功');
    
    // ========== 4. 编辑任务 ==========
    console.log('步骤7: 编辑任务');
    
    // 点击刚创建的任务
    await page.click(`text=${taskTitle}`);
    
    // 点击编辑按钮
    await page.click('button:has-text("编辑"), button:has-text("Edit"), .edit-button');
    
    // 等待编辑表单
    await expect(page.locator('form, .modal, .dialog')).toBeVisible();
    
    // 修改任务标题
    const newTitle = `${taskTitle}_已编辑`;
    await page.fill('input[name="title"], input[placeholder*="标题"], input[placeholder*="任务"]', newTitle);
    
    // 提交修改
    await page.click('button[type="submit"], button:has-text("保存"), button:has-text("更新")');
    
    // 验证修改成功
    await expect(page.locator('.success, .alert-success, [role="alert"]')).toBeVisible({ timeout: 3000 });
    await expect(page.locator(`text=${newTitle}`)).toBeVisible();
    
    console.log('✅ 任务编辑成功');
    
    // ========== 5. 删除任务 ==========
    console.log('步骤8: 删除任务');
    
    // 点击任务
    await page.click(`text=${newTitle}`);
    
    // 点击删除按钮
    await page.click('button:has-text("删除"), button:has-text("Delete"), .delete-button');
    
    // 确认删除
    const confirmButton = page.locator('button:has-text("确认"), button:has-text("确定"), button:has-text("Yes")');
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }
    
    // 验证删除成功
    await expect(page.locator('.success, .alert-success, [role="alert"]')).toBeVisible({ timeout: 3000 });
    await expect(page.locator(`text=${newTitle}`)).not.toBeVisible();
    
    console.log('✅ 任务删除成功');
    
    // ========== 6. 登出 ==========
    console.log('步骤9: 登出系统');
    
    // 查找登出按钮
    const logoutButton = page.locator('button:has-text("登出"), button:has-text("退出"), button:has-text("Logout"), a:has-text("登出")');
    
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      
      // 验证跳转到登录页面
      await page.waitForURL('**/login**', { timeout: 5000 });
      expect(page.url()).toContain('/login');
      
      // 验证Token已清除
      const tokenAfterLogout = await page.evaluate(() => localStorage.getItem('accessToken'));
      expect(tokenAfterLogout).toBeFalsy();
      
      console.log('✅ 登出成功');
    } else {
      console.log('⚠️ 未找到登出按钮，跳过登出测试');
    }
    
    console.log('🎉 端到端测试完成！');
  });

  test('E2E-002: 用户会话保持测试', async ({ page, context }) => {
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
    
    // 获取refreshToken
    const refreshToken = await page.evaluate(() => localStorage.getItem('refreshToken'));
    expect(refreshToken).toBeTruthy();
    
    // 模拟accessToken过期（删除accessToken）
    await page.evaluate(() => {
      localStorage.removeItem('accessToken');
    });
    
    // 刷新页面
    await page.reload();
    
    // 验证：页面仍然保持登录状态（通过refreshToken自动刷新）
    await page.waitForTimeout(2000);
    
    // 检查是否仍在任务列表页面
    expect(page.url()).toContain('/tasks');
    
    // 验证：accessToken已被重新获取
    const newAccessToken = await page.evaluate(() => localStorage.getItem('accessToken'));
    expect(newAccessToken).toBeTruthy();
    
    console.log('✅ 会话保持功能正常');
  });

  test('E2E-003: 并发操作测试', async ({ browser }) => {
    // 创建多个页面上下文
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    // 两个用户同时登录
    await Promise.all([
      (async () => {
        await page1.goto(BASE_URL);
        await page1.fill('input[type="email"], input[name="email"], input[placeholder*="邮箱"], input[placeholder*="用户名"]', TEST_USER);
        await page1.fill('input[type="password"]', TEST_PASSWORD);
        await page1.click('button[type="submit"], button:has-text("登录"), button:has-text("Login")');
        await page1.waitForURL('**/tasks**', { timeout: 5000 });
      })(),
      (async () => {
        await page2.goto(BASE_URL);
        await page2.fill('input[type="email"], input[name="email"], input[placeholder*="邮箱"], input[placeholder*="用户名"]', TEST_USER);
        await page2.fill('input[type="password"]', TEST_PASSWORD);
        await page2.click('button[type="submit"], button:has-text("登录"), button:has-text("Login")');
        await page2.waitForURL('**/tasks**', { timeout: 5000 });
      })()
    ]);
    
    // 验证两个会话都正常
    const token1 = await page1.evaluate(() => localStorage.getItem('accessToken'));
    const token2 = await page2.evaluate(() => localStorage.getItem('accessToken'));
    
    expect(token1).toBeTruthy();
    expect(token2).toBeTruthy();
    
    console.log('✅ 并发操作测试通过');
    
    // 清理
    await context1.close();
    await context2.close();
  });

  test('E2E-004: 浏览器后退/前进测试', async ({ page }) => {
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
    
    // 访问其他页面（例如：仪表盘）
    const dashboardLink = page.locator('a:has-text("仪表盘"), a:has-text("Dashboard")');
    if (await dashboardLink.isVisible()) {
      await dashboardLink.click();
      await page.waitForTimeout(1000);
      
      // 后退
      await page.goBack();
      await page.waitForTimeout(1000);
      
      // 验证：仍在登录状态，任务列表正常显示
      expect(page.url()).toContain('/tasks');
      await expect(page.locator('table, .task-list')).toBeVisible();
      
      // 前进
      await page.goForward();
      await page.waitForTimeout(1000);
      
      // 验证：页面正常
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/dashboard|仪表盘/i);
      
      console.log('✅ 浏览器后退/前进测试通过');
    }
  });
});
