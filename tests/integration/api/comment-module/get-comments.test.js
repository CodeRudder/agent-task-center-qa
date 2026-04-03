/**
 * 获取评论列表API集成测试
 * 
 * API文档：GET /api/v1/tasks/:taskId/comments
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('获取评论列表API集成测试', () => {
  
  let authToken;
  let taskId;
  
  beforeAll(async () => {
    const response = await request(API_BASE_URL)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin123!'
      });
    authToken = response.body.data.accessToken;
    
    const createResponse = await request(API_BASE_URL)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: '测试评论任务'
      });
    taskId = createResponse.body.data.id;
  });
  
  describe('GET /api/v1/tasks/:taskId/comments', () => {
    
    test('正常场景 - 获取评论列表成功', async () => {
      const response = await request(API_BASE_URL)
        .get(`/api/v1/tasks/${taskId}/comments`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('comments');
      expect(Array.isArray(response.body.data.comments)).toBe(true);
    });

    test('异常场景 - 任务不存在', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/tasks/00000000-0000-0000-0000-000000000000/comments')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
    });

  });
});