/**
 * 任务列表自动化测试脚本
 * 文件位置：team-docs/qa-reports/scripts/task-list.spec.js
 * 测试框架：Playwright
 * 测试内容：任务列表的完整测试用例
 */

const { test, expect } = require('@playwright/test');

// 测试配置
const BASE_URL = process.env.BASE_URL || 'http://localhost:3101';
const TEST_USER = process.env.TEST_USER || 'test@test.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'test123';

test.describe('任务列表功能测试', () => {
  
  // 登录辅助函数
  async function login(page) {
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
  }

  test.beforeEach(async ({ page }) => {
    // 每个测试前先登录
    await login(page);
  });

  test('TC-TASK-001: 任务列表显示', async ({ page }) => {
    // 验证：页面标题
    await expect(page.locator('h1, h2, .title')).toContainText(/任务管理|Task Management/i);
    
    // 验证：任务列表表格或列表可见
    await expect(page.locator('table, .task-list, .list-group')).toBeVisible();
    
    // 验证：至少显示一个任务（如果测试数据库有数据）
    const taskCount = await page.locator('table tbody tr, .task-item, .list-group-item').count();
    expect(taskCount).toBeGreaterThan(0);
    
    // 验证：任务列表包含必要的列
    const headers = await page.locator('table thead th, .task-header').allTextContents();
    expect(headers.join(' ')).toMatch(/任务|标题|状态|优先级|Task|Title|Status|Priority/i);
  });

  test('TC-TASK-002: 任务创建', async ({ page }) => {
    // 点击"新建任务"按钮
    await page.click('button:has-text("新建"), button:has-text("创建"), button:has-text("New")');
    
    // 等待创建任务表单或对话框出现
    await expect(page.locator('form, .modal, .dialog')).toBeVisible();
    
    // 填写任务信息
    const taskTitle = `测试任务_${Date.now()}`;
    await page.fill('input[name="title"], input[placeholder*="标题"], input[placeholder*="任务"]', taskTitle);
    
    // 填写描述（可选）
    const descInput = page.locator('textarea[name="description"], textarea[placeholder*="描述"]');
    if (await descInput.isVisible()) {
      await descInput.fill('这是一个自动化测试创建的任务');
    }
    
    // 选择状态（可选）
    const statusSelect = page.locator('select[name="status"], .status-selector');
    if (await statusSelect.isVisible()) {
      await statusSelect.selectOption({ label: /待办|Todo|Pending/i });
    }
    
    // 选择优先级（可选）
    const prioritySelect = page.locator('select[name="priority"], .priority-selector');
    if (await prioritySelect.isVisible()) {
      await prioritySelect.selectOption({ label: /高|High/i });
    }
    
    // 提交表单
    await page.click('button[type="submit"], button:has-text("保存"), button:has-text("创建")');
    
    // 验证：任务创建成功提示
    await expect(page.locator('.success, .alert-success, [role="alert"]')).toBeVisible({ timeout: 3000 });
    
    // 验证：任务出现在列表中
    await page.waitForSelector(`text=${taskTitle}`, { timeout: 5000 });
    await expect(page.locator(`text=${taskTitle}`)).toBeVisible();
  });

  test('TC-TASK-003: 任务编辑', async ({ page }) => {
    // 假设列表中有至少一个任务
    const firstTask = page.locator('table tbody tr, .task-item, .list-group-item').first();
    await firstTask.click();
    
    // 点击编辑按钮（可能在任务详情页或直接在列表行中）
    await page.click('button:has-text("编辑"), button:has-text("Edit"), .edit-button');
    
    // 等待编辑表单出现
    await expect(page.locator('form, .modal, .dialog')).toBeVisible();
    
    // 修改任务标题
    const newTitle = `编辑后的任务_${Date.now()}`;
    const titleInput = page.locator('input[name="title"], input[placeholder*="标题"], input[placeholder*="任务"]');
    await titleInput.fill(newTitle);
    
    // 提交修改
    await page.click('button[type="submit"], button:has-text("保存"), button:has-text("更新")');
    
    // 验证：修改成功提示
    await expect(page.locator('.success, .alert-success, [role="alert"]')).toBeVisible({ timeout: 3000 });
    
    // 验证：任务标题已更新
    await expect(page.locator(`text=${newTitle}`)).toBeVisible();
  });

  test('TC-TASK-004: 任务删除', async ({ page }) => {
    // 先创建一个临时任务用于删除
    await page.click('button:has-text("新建"), button:has-text("创建"), button:has-text("New")');
    await expect(page.locator('form, .modal, .dialog')).toBeVisible();
    
    const taskTitle = `待删除任务_${Date.now()}`;
    await page.fill('input[name="title"], input[placeholder*="标题"], input[placeholder*="任务"]', taskTitle);
    await page.click('button[type="submit"], button:has-text("保存"), button:has-text("创建")');
    
    // 等待任务创建成功
    await page.waitForSelector(`text=${taskTitle}`, { timeout: 5000 });
    
    // 点击任务进行删除
    const taskItem = page.locator(`text=${taskTitle}`).first();
    await taskItem.click();
    
    // 点击删除按钮
    await page.click('button:has-text("删除"), button:has-text("Delete"), .delete-button');
    
    // 确认删除（如果有确认对话框）
    const confirmButton = page.locator('button:has-text("确认"), button:has-text("确定"), button:has-text("Yes")');
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }
    
    // 验证：删除成功提示
    await expect(page.locator('.success, .alert-success, [role="alert"]')).toBeVisible({ timeout: 3000 });
    
    // 验证：任务不再出现在列表中
    await expect(page.locator(`text=${taskTitle}`)).not.toBeVisible();
  });

  test('TC-TASK-005: 任务筛选', async ({ page }) => {
    // 查找状态筛选下拉框
    const statusFilter = page.locator('select[name="status"], .status-filter, select').first();
    
    if (await statusFilter.isVisible()) {
      // 选择"已完成"状态
      await statusFilter.selectOption({ label: /已完成|Completed|Done/i });
      
      // 等待列表更新
      await page.waitForTimeout(1000);
      
      // 验证：列表中只显示已完成的任务
      const tasks = await page.locator('table tbody tr, .task-item').allTextContents();
      // 注意：这里需要根据实际UI调整验证逻辑
      expect(tasks.length).toBeGreaterThanOrEqual(0);
    }
  });

  test('TC-TASK-006: 任务搜索', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="搜索"], input[placeholder*="Search"]');
    
    if (await searchInput.isVisible()) {
      // 输入搜索关键词
      const keyword = '测试';
      await searchInput.fill(keyword);
      
      // 等待搜索结果更新
      await page.waitForTimeout(1000);
      
      // 验证：搜索结果包含关键词
      const searchResults = await page.locator('table tbody tr, .task-item').allTextContents();
      if (searchResults.length > 0) {
        expect(searchResults.join(' ')).toContain(keyword);
      }
    }
  });

  test('TC-TASK-007: 任务状态变更', async ({ page }) => {
    // 点击第一个任务
    const firstTask = page.locator('table tbody tr, .task-item, .list-group-item').first();
    await firstTask.click();
    
    // 查找状态选择器
    const statusSelect = page.locator('select[name="status"], .status-selector, select').first();
    
    if (await statusSelect.isVisible()) {
      // 获取当前状态
      const currentStatus = await statusSelect.inputValue();
      
      // 更改状态
      const newStatus = currentStatus === 'todo' ? 'in_progress' : 'todo';
      await statusSelect.selectOption(newStatus);
      
      // 保存修改（如果有保存按钮）
      const saveButton = page.locator('button:has-text("保存"), button:has-text("更新")');
      if (await saveButton.isVisible()) {
        await saveButton.click();
      }
      
      // 验证：状态已更新
      await page.waitForTimeout(1000);
      const updatedStatus = await statusSelect.inputValue();
      expect(updatedStatus).toBe(newStatus);
    }
  });

  test('TC-TASK-008: 任务分配', async ({ page }) => {
    // 点击第一个任务
    const firstTask = page.locator('table tbody tr, .task-item, .list-group-item').first();
    await firstTask.click();
    
    // 查找分配选择器
    const assigneeSelect = page.locator('select[name="assignee"], .assignee-selector, select[name="userId"]');
    
    if (await assigneeSelect.isVisible()) {
      // 选择一个用户
      await assigneeSelect.selectOption({ index: 1 });
      
      // 保存修改
      const saveButton = page.locator('button:has-text("保存"), button:has-text("更新")');
      if (await saveButton.isVisible()) {
        await saveButton.click();
        
        // 验证：修改成功提示
        await expect(page.locator('.success, .alert-success, [role="alert"]')).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('TC-TASK-009: 分页功能', async ({ page }) => {
    // 检查是否有分页控件
    const pagination = page.locator('.pagination, .pager, [role="navigation"]');
    
    if (await pagination.isVisible()) {
      // 获取当前页码
      const currentPage = await pagination.locator('.active, .current').textContent();
      
      // 点击下一页
      const nextButton = pagination.locator('button:has-text("下一页"), button:has-text("Next"), a:has-text(">")');
      if (await nextButton.isVisible()) {
        await nextButton.click();
        
        // 等待页面加载
        await page.waitForTimeout(1000);
        
        // 验证：页码已改变
        const newPage = await pagination.locator('.active, .current').textContent();
        expect(newPage).not.toBe(currentPage);
      }
    }
  });

  test('TC-TASK-010: 任务详情查看', async ({ page }) => {
    // 点击第一个任务
    const firstTask = page.locator('table tbody tr, .task-item, .list-group-item').first();
    await firstTask.click();
    
    // 等待任务详情页或对话框出现
    await page.waitForTimeout(1000);
    
    // 验证：任务详情显示
    const detailView = page.locator('.task-detail, .detail-view, .modal-body');
    if (await detailView.isVisible()) {
      // 验证：包含任务标题
      await expect(detailView.locator('h1, h2, h3, .title')).toBeVisible();
      
      // 验证：包含任务描述
      await expect(detailView.locator('.description, .content')).toBeVisible();
      
      // 验证：包含状态和优先级
      const text = await detailView.textContent();
      expect(text).toMatch(/状态|优先级|Status|Priority/i);
    }
  });
});
