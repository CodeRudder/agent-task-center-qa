import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4100';

test.describe('Agent管理功能测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'test@test.com');
    await page.fill('input[type="password"]', 'test123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(tasks|dashboard)/, { timeout: 10000 });
  });

  test('TC-AGENT-001: 查看Agent列表', async ({ page }) => {
    await page.goto(`${BASE_URL}/agents`);
    await expect(page.locator('text=/Agent|代理/i')).toBeVisible();
  });

  test('TC-AGENT-002: 创建新Agent', async ({ page }) => {
    await page.goto(`${BASE_URL}/agents`);
    await page.click('button:has-text("创建"), button:has-text("新建")');
    await page.fill('input[name="name"], input[placeholder*="名称"]', '测试Agent');
    await page.click('button:has-text("保存"), button:has-text("创建")');
    await expect(page.locator('text=/创建成功|保存成功/i')).toBeVisible();
  });

  test('TC-AGENT-003: 查看Agent详情', async ({ page }) => {
    await page.goto(`${BASE_URL}/agents`);
    await page.click('text=/Agent|代理/i');
    await expect(page.locator('text=/详情|信息/i')).toBeVisible();
  });

  test('TC-AGENT-004: 编辑Agent', async ({ page }) => {
    await page.goto(`${BASE_URL}/agents`);
    await page.click('button:has-text("编辑")');
    await page.fill('input[name="name"]', '更新后的Agent名称');
    await page.click('button:has-text("保存")');
    await expect(page.locator('text=/更新成功|保存成功/i')).toBeVisible();
  });

  test('TC-AGENT-005: 删除Agent', async ({ page }) => {
    await page.goto(`${BASE_URL}/agents`);
    await page.click('button:has-text("删除")');
    await page.click('button:has-text("确认")');
    await expect(page.locator('text=/删除成功/i')).toBeVisible();
  });
});
