/**
 * 获取任务列表API集成测试
 * 
 * 测试范围：
 * - 正常场景：获取任务列表成功
 * - 异常场景：未登录访问、分页参数错误
 * - 边界条件：空列表、分页边界
 * 
 * API文档：GET /api/v1/tasks
 */

const request = require('supertest');
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('获取任务列表API集成测试', () => {
  
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
  
  describe('GET /api/v1/tasks', () => {
    
    test('正常场景 - 获取任务列表成功', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/tasks')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('tasks');
      expect(Array.isArray(response.body.data.tasks)).toBe(true);
    });

    test('正常场景 - 分页查询任务列表', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/tasks?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('tasks');
      expect(response.body.data).toHaveProperty('pagination');
      expect(response.body.data.pagination).toHaveProperty('page', 1);
      expect(response.body.data.pagination).toHaveProperty('limit', 10);
    });

    test('正常场景 - 按状态筛选任务', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/tasks?status=pending')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('tasks');
      expect(response.body.data.tasks.every(task => 
        task.status === 'pending'
      )).toBe(true);
    });

    test('异常场景 - 未登录访问任务列表', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/tasks');
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('未授权');
    });

    test('异常场景 - 无效的token', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/tasks')
        .set('Authorization', 'Bearer invalid-token-123456');
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });

    test('边界条件 - 分页参数为负数', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/tasks?page=-1&limit=10')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('分页参数无效');
    });

    test('边界条件 - 分页参数过大', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/tasks?page=1&limit=1000')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('分页参数超出限制');
    });

    test('边界条件 - 无效的状态筛选', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/tasks?status=invalid-status')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('无效的状态参数');
    });

  });
});
