/**
 * 创建任务API集成测试
 * 
 * 测试范围：
 * - 正常场景：创建任务成功
 * - 异常场景：缺少必填字段、字段格式错误
 * - 边界条件：标题过长、描述为空
 * 
 * API文档：POST /api/v1/tasks
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('创建任务API集成测试', () => {
  
  let authToken;
  
  beforeAll(async () => {
    // 登录获取token
    const response = await request(API_BASE_URL)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin123!'
      });
    
    authToken = response.body.data.accessToken;
  });
  
  describe('POST /api/v1/tasks', () => {
    
    test('正常场景 - 创建任务成功', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: `TestTask_${Date.now()}`,
          description: `This is a test task_${Date.now()}`,
          status: 'pending',
          priority: 'medium',
          dueDate: '2026-12-31'
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('title', '测试任务');
      expect(response.body.data).toHaveProperty('status', 'pending');
    });

    test('正常场景 - 创建任务（最小必填字段）', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: `MinimalTestTask_${Date.now()}`
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('title', '最小测试任务');
    });

    test('异常场景 - 缺少标题字段', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: `This is a test task_${Date.now()}`
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('任务标题');
    });

    test('异常场景 - 未登录创建任务', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/tasks')
        .send({
          title: `TestTask_${Date.now()}`
        });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });

    test('异常场景 - 无效的token', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/tasks')
        .set('Authorization', 'Bearer invalid-token-123456')
        .send({
          title: `TestTask_${Date.now()}`
        });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });

    test('边界条件 - 标题为空', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: ''
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('任务标题');
    });

    test('边界条件 - 标题过长（超过限制）', async () => {
      const longTitle = 'A'.repeat(201);
      const response = await request(API_BASE_URL)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: longTitle
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('任务标题');
    });

    test('边界条件 - 描述为空（允许）', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: `TestTask_${Date.now()}`,
          description: ''
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
    });

    test('边界条件 - 无效的优先级', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: `TestTask_${Date.now()}`,
          priority: 'invalid-priority'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toMatch(/优先级|priority/);
    });

    test('边界条件 - 无效的状态', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: `TestTask_${Date.now()}`,
          status: 'invalid-status'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toMatch(/状态|status/);
    });

  });
});
