/**
 * 获取Webhook详情API集成测试
 * 
 * API文档：GET /api/v1/webhooks/:id
 */

const request = require('supertest');
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('获取Webhook详情API集成测试', () => {
  
  let authToken;
  let webhookId;
  
  beforeAll(async () => {
    const response = await request(API_BASE_URL)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin123!'
      });
    authToken = response.body.data.accessToken;
    
    const createResponse = await request(API_BASE_URL)
      .post('/api/v1/webhooks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: '测试Webhook详情',
        url: 'https://example.com/webhook'
      });
    webhookId = createResponse.body.data.id;
  });
  
  describe('GET /api/v1/webhooks/:id', () => {
    
    test('正常场景 - 获取Webhook详情成功', async () => {
      const response = await request(API_BASE_URL)
        .get(`/api/v1/webhooks/${webhookId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('id', webhookId);
    });

    test('异常场景 - Webhook不存在', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/webhooks/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
    });

  });
});