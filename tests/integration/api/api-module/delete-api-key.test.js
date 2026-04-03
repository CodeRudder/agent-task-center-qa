/**
 * 删除API密钥API集成测试
 * 
 * API文档：DELETE /api/v1/api-keys/:id
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('删除API密钥API集成测试', () => {
  
  let authToken;
  let apiKeyId;
  
  beforeEach(async () => {
    const response = await request(API_BASE_URL)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin123!'
      });
    authToken = response.body.data.accessToken;
    
    const createResponse = await request(API_BASE_URL)
      .post('/api/v1/api-keys')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Delete API Key',
        scopes: ['read']
      });
    apiKeyId = createResponse.body.data.id;
  });
  
  describe('DELETE /api/v1/api-keys/:id', () => {
    
    test('正常场景 - 删除API密钥成功', async () => {
      const response = await request(API_BASE_URL)
        .delete(`/api/v1/api-keys/${apiKeyId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.message).toContain('API密钥删除成功');
    });

    test('异常场景 - API密钥不存在', async () => {
      const response = await request(API_BASE_URL)
        .delete('/api/v1/api-keys/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
    });

  });
});