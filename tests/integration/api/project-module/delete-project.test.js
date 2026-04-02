/**
 * 删除项目API集成测试
 * 
 * API文档：DELETE /api/v1/projects/:id
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('删除项目API集成测试', () => {
  
  let authToken;
  let projectId;
  
  beforeEach(async () => {
    const response = await request(API_BASE_URL)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin123!'
      });
    authToken = response.body.data.accessToken;
    
    const createResponse = await request(API_BASE_URL)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: '测试删除项目'
      });
    projectId = createResponse.body.data.id;
  });
  
  describe('DELETE /api/v1/projects/:id', () => {
    
    test('正常场景 - 删除项目成功', async () => {
      const response = await request(API_BASE_URL)
        .delete(`/api/v1/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    test('异常场景 - 项目不存在', async () => {
      const response = await request(API_BASE_URL)
        .delete('/api/v1/projects/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
    });

  });
});
