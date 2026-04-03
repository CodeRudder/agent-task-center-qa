/**
 * 更新评论API集成测试
 * 
 * API文档：PUT /api/v1/tasks/:taskId/comments/:id
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('更新评论API集成测试', () => {
  
  let authToken;
  let taskId;
  let commentId;
  
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
        title: `TestUpdateComment_${Date.now()}`
      });
    taskId = createResponse.body.data.id;
    
    const commentResponse = await request(API_BASE_URL)
      .post(`/api/v1/tasks/${taskId}/comments`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        content: '原始评论'
      });
    commentId = commentResponse.body.data.id;
  });
  
  describe('PUT /api/v1/tasks/:taskId/comments/:id', () => {
    
    test('正常场景 - 更新评论成功', async () => {
      const response = await request(API_BASE_URL)
        .put(`/api/v1/tasks/${taskId}/comments/${commentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: '更新后的评论'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('content', '更新后的评论');
    });

    test('异常场景 - 评论不存在', async () => {
      const response = await request(API_BASE_URL)
        .put(`/api/v1/tasks/${taskId}/comments/00000000-0000-0000-0000-000000000000`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: '更新内容'
        });
      
      expect(response.status).toBe(404);
    });

  });
});