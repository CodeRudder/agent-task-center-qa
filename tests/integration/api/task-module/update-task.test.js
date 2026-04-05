/**
 * 更新任务API集成测试
 * 
 * 测试范围：
 * - 正常场景：更新任务成功
 * - 异常场景：任务不存在、缺少必填字段
 * - 边界条件：部分更新、清空字段
 * 
 * API文档：PUT /api/v1/tasks/:id
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4100';

describe('更新任务API集成测试', () => {
  
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
        title: `TestUpdateTask_${Date.now()}`,
        status: 'todo',
        priority: 'medium',
        description: 'Task for update testing'
      });
    
    if (createResponse.status === 201) {
      taskId = createResponse.body.data.id;
    } else {
      console.log('Failed to create task for update test:', createResponse.body);
    }
  });
  
  describe('PUT /api/v1/tasks/:id', () => {
    
    test('正常场景 - 更新任务成功', async () => {
      const response = await request(API_BASE_URL)
        .put(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: `UpdatedTaskTitle_${Date.now()}`,
          status: 'in-progress',
          priority: 'high'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('id', taskId);
      expect(response.body.data).toHaveProperty('title', '更新后的任务标题');
      expect(response.body.data).toHaveProperty('status', 'in_progress');
      expect(response.body.data).toHaveProperty('priority', 'high');
      expect(response.body.data).toHaveProperty('updatedAt');
    });

    test('正常场景 - 部分更新任务', async () => {
      const response = await request(API_BASE_URL)
        .put(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'completed'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('status', 'done');
      expect(response.body.data).toHaveProperty('title', '更新后的任务标题');
    });

    test('异常场景 - 任务不存在', async () => {
      const response = await request(API_BASE_URL)
        .put('/api/v1/tasks/nonexistent-task-id-123456')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '更新标题'
        });
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('任务不存在');
    });

    test('异常场景 - 未登录更新任务', async () => {
      const response = await request(API_BASE_URL)
        .put(`/api/v1/tasks/${taskId}`)
        .send({
          title: '更新标题'
        });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });

    test('异常场景 - 无效的token', async () => {
      const response = await request(API_BASE_URL)
        .put(`/api/v1/tasks/${taskId}`)
        .set('Authorization', 'Bearer invalid-token-123456')
        .send({
          title: '更新标题'
        });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });

    test('边界条件 - 标题为空', async () => {
      const response = await request(API_BASE_URL)
        .put(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: ''
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('标题不能为空');
    });

    test('边界条件 - 无效的优先级', async () => {
      const response = await request(API_BASE_URL)
        .put(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          priority: 'invalid-priority'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('无效的优先级');
    });

    test('边界条件 - 清空描述字段', async () => {
      const response = await request(API_BASE_URL)
        .put(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: ''
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('description', '');
    });

  });
});
