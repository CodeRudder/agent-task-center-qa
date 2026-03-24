import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4100';

test.describe('任务依赖关系功能测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'test@test.com');
    await page.fill('input[type="password"]', 'test123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(tasks|dashboard)/, { timeout: 10000 });
  });

  test('TC-DEP-001: 查看任务依赖关系列表', async ({ page }) => {
    await page.goto(`${BASE_URL}/tasks`);
    await page.click('text=/依赖|Dependency/i');
    await expect(page.locator('text=/依赖关系/i')).toBeVisible();
  });

  test('TC-DEP-002: 添加任务依赖关系', async ({ page }) => {
    await page.goto(`${BASE_URL}/tasks`);
    await page.click('button:has-text("添加依赖")');
    await page.selectOption('select[name="dependency"]', 'blocking');
    await page.click('button:has-text("保存")');
    await expect(page.locator('text=/添加成功/i')).toBeVisible();
  });

  test('TC-DEP-003: 删除任务依赖关系', async ({ page }) => {
    await page.goto(`${BASE_URL}/tasks`);
    await page.click('button:has-text("删除依赖")');
    await page.click('button:has-text("确认")');
    await expect(page.locator('text=/删除成功/i')).toBeVisible();
  });

  test('TC-DEP-004: 循环依赖检测', async ({ page }) => {
    await page.goto(`${BASE_URL}/tasks`);
    await page.click('button:has-text("添加依赖")');
    await page.click('button:has-text("保存")');
    await expect(page.locator('text=/循环依赖|检测到循环/i')).toBeVisible();
  });
});
