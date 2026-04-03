/**
 * 获取任务详情API集成测试
 * 
 * 测试范围：
 * - 正常场景：获取任务详情成功
 * - 异常场景：任务不存在、无权限访问
 * - 边界条件：无效的任务ID格式
 * 
 * API文档：GET /api/v1/tasks/:id
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('获取任务详情API集成测试', () => {
  
  let authToken;
  let taskId;
  
  beforeAll(async () => {
    // 登录获取token
    const response = await request(API_BASE_URL)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin123!'
      });
    
    authToken = response.body.data.accessToken;
    
    // 创建一个测试任务
    const createResponse = await request(API_BASE_URL)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: `TestTaskDetail_${Date.now()}`,
        description: 'Task for detail testing'
      });
    
    if (createResponse.status === 201) {
      taskId = createResponse.body.data.id;
    } else {
      console.log('Failed to create task for get-detail test:', createResponse.body);
    }
  });
  
  describe('GET /api/v1/tasks/:id', () => {
    
    test('正常场景 - 获取任务详情成功', async () => {
      const response = await request(API_BASE_URL)
        .get(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('id', taskId);
      expect(response.body.data).toHaveProperty('title', '测试任务详情');
      expect(response.body.data).toHaveProperty('createdAt');
    });

    test('异常场景 - 任务不存在', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/tasks/nonexistent-task-id-123456')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('任务不存在');
    });

    test('异常场景 - 未登录访问任务详情', async () => {
      const response = await request(API_BASE_URL)
        .get(`/api/v1/tasks/${taskId}`);
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });

    test('异常场景 - 无效的token', async () => {
      const response = await request(API_BASE_URL)
        .get(`/api/v1/tasks/${taskId}`)
        .set('Authorization', 'Bearer invalid-token-123456');
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });

    test('边界条件 - 无效的任务ID格式', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/tasks/invalid-id-format')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('无效的任务ID格式');
    });

    test('边界条件 - 任务ID为空', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/tasks/')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
    });

  });
});
