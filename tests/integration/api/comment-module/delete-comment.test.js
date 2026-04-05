/**
 * 删除评论API集成测试
 * 
 * API文档：DELETE /api/v1/tasks/:taskId/comments/:id
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4100';

describe('删除评论API集成测试', () => {
  
  let authToken;
  let taskId;
  let commentId;
  
  beforeEach(async () => {
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
        title: `TestDeleteComment_${Date.now()}`
      });
    taskId = createResponse.body.data.id;
    
    const commentResponse = await request(API_BASE_URL)
      .post(`/api/v1/tasks/${taskId}/comments`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        content: `Test comment_${Date.now()}`
      });
    commentId = commentResponse.body.data.id;
  });
  
  describe('DELETE /api/v1/tasks/:taskId/comments/:id', () => {
    
    test('正常场景 - 删除评论成功', async () => {
      const response = await request(API_BASE_URL)
        .delete(`/api/v1/tasks/${taskId}/comments/${commentId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    test('异常场景 - 评论不存在', async () => {
      const response = await request(API_BASE_URL)
        .delete(`/api/v1/tasks/${taskId}/comments/00000000-0000-0000-0000-000000000000`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
    });

  });
});