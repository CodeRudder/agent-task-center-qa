import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4100';

test.describe('报表统计功能测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'test@test.com');
    await page.fill('input[type="password"]', 'test123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(tasks|dashboard)/, { timeout: 10000 });
  });

  test('TC-REPORT-001: 查看报表统计页面', async ({ page }) => {
    await page.goto(`${BASE_URL}/reports`);
    await expect(page.locator('text=/报表|统计|Report/i')).toBeVisible();
  });

  test('TC-REPORT-002: 查看任务统计', async ({ page }) => {
    await page.goto(`${BASE_URL}/reports`);
    await expect(page.locator('text=/任务|Task/i')).toBeVisible();
  });

  test('TC-REPORT-003: 查看工作量统计', async ({ page }) => {
    await page.goto(`${BASE_URL}/reports`);
    await page.click('button:has-text("工作量"), tab:has-text("工作量")');
    await expect(page.locator('text=/工作量|Workload/i')).toBeVisible();
  });

  test('TC-REPORT-004: 导出CSV', async ({ page }) => {
    await page.goto(`${BASE_URL}/reports`);
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('button:has-text("导出"), button:has-text("CSV")')
    ]);
    expect(download.suggestedFilename()).toContain('.csv');
  });
});
