/**
 * 删除任务API集成测试
 * 
 * 测试范围：
 * - 正常场景：删除任务成功
 * - 异常场景：任务不存在、无权限删除
 * - 边界条件：重复删除
 * 
 * API文档：DELETE /api/v1/tasks/:id
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('删除任务API集成测试', () => {
  
  let authToken;
  let taskId;
  
  beforeEach(async () => {
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
        title: '测试删除任务'
      });
    
    taskId = createResponse.body.data.id;
  });
  
  describe('DELETE /api/v1/tasks/:id', () => {
    
    test('正常场景 - 删除任务成功', async () => {
      const response = await request(API_BASE_URL)
        .delete(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.message).toContain('任务删除成功');
      
      // 验证任务已被删除
      const getResponse = await request(API_BASE_URL)
        .get(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(getResponse.status).toBe(404);
    });

    test('异常场景 - 任务不存在', async () => {
      const response = await request(API_BASE_URL)
        .delete('/api/v1/tasks/nonexistent-task-id-123456')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('任务不存在');
    });

    test('异常场景 - 未登录删除任务', async () => {
      const response = await request(API_BASE_URL)
        .delete(`/api/v1/tasks/${taskId}`);
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });

    test('异常场景 - 无效的token', async () => {
      const response = await request(API_BASE_URL)
        .delete(`/api/v1/tasks/${taskId}`)
        .set('Authorization', 'Bearer invalid-token-123456');
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });

    test('边界条件 - 无效的任务ID格式', async () => {
      const response = await request(API_BASE_URL)
        .delete('/api/v1/tasks/invalid-id-format')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('无效的任务ID格式');
    });

    test('边界条件 - 重复删除同一任务', async () => {
      // 第一次删除
      const firstResponse = await request(API_BASE_URL)
        .delete(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(firstResponse.status).toBe(200);
      
      // 第二次删除
      const secondResponse = await request(API_BASE_URL)
        .delete(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(secondResponse.status).toBe(404);
      expect(secondResponse.body).toHaveProperty('success', false);
      expect(secondResponse.body.message).toContain('任务不存在');
    });

  });
});
