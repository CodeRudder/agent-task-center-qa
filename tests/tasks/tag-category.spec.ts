import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4100';

test.describe('标签与分类功能测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'test@test.com');
    await page.fill('input[type="password"]', 'test123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(tasks|dashboard)/, { timeout: 10000 });
  });

  test('TC-TAG-001: 创建标签', async ({ page }) => {
    await page.goto(`${BASE_URL}/tags`);
    await page.click('button:has-text("创建标签")');
    await page.fill('input[name="name"]', '测试标签');
    await page.click('button:has-text("保存")');
    await expect(page.locator('text=/创建成功/i')).toBeVisible();
  });

  test('TC-TAG-002: 查看标签列表', async ({ page }) => {
    await page.goto(`${BASE_URL}/tags`);
    await expect(page.locator('text=/标签|Tag/i')).toBeVisible();
  });

  test('TC-TAG-003: 编辑标签', async ({ page }) => {
    await page.goto(`${BASE_URL}/tags`);
    await page.click('button:has-text("编辑")');
    await page.fill('input[name="name"]', '更新后的标签');
    await page.click('button:has-text("保存")');
    await expect(page.locator('text=/更新成功/i')).toBeVisible();
  });

  test('TC-TAG-004: 删除标签', async ({ page }) => {
    await page.goto(`${BASE_URL}/tags`);
    await page.click('button:has-text("删除")');
    await page.click('button:has-text("确认")');
    await expect(page.locator('text=/删除成功/i')).toBeVisible();
  });

  test('TC-TAG-005: 创建分类', async ({ page }) => {
    await page.goto(`${BASE_URL}/categories`);
    await page.click('button:has-text("创建分类")');
    await page.fill('input[name="name"]', '测试分类');
    await page.click('button:has-text("保存")');
    await expect(page.locator('text=/创建成功/i')).toBeVisible();
  });
});
