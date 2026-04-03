/**
 * 创建评论API集成测试
 * 
 * API文档：POST /api/v1/tasks/:taskId/comments
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('创建评论API集成测试', () => {
  
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
        title: `TestCommentTask_${Date.now()}`
      });
    taskId = createResponse.body.data.id;
  });
  
  describe('POST /api/v1/tasks/:taskId/comments', () => {
    
    test('正常场景 - 创建评论成功', async () => {
      const response = await request(API_BASE_URL)
        .post(`/api/v1/tasks/${taskId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: `This is a test comment_${Date.now()}`
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('content', '这是一条测试评论');
    });

    test('异常场景 - 缺少内容', async () => {
      const response = await request(API_BASE_URL)
        .post(`/api/v1/tasks/${taskId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

  });
});