/**
 * 测试Webhook API集成测试
 * 
 * API文档：POST /api/v1/webhooks/:id/test
 */

const request = require('supertest');
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4100';

describe('测试Webhook API集成测试', () => {
  
  let authToken;
  let webhookId;
  
  beforeEach(async () => {
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
        name: `TestWebhook_${Date.now()}`,
        url: 'https://example.com/webhook',
        events: ['task.created'],
        projectId: 'adacb6d2-44a5-424d-8983-2eb6bfe3b2c4'
      });
    webhookId = createResponse.body.data.id;
  });
  
  describe('POST /api/v1/webhooks/:id/test', () => {
    
    test('正常场景 - 测试Webhook成功', async () => {
      const response = await request(API_BASE_URL)
        .post(`/api/v1/webhooks/${webhookId}/test`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          testData: { message: '测试数据' }
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    test('异常场景 - Webhook不存在', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/webhooks/00000000-0000-0000-0000-000000000000/test')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          testData: { message: '测试数据' }
        });
      
      expect(response.status).toBe(404);
    });

  });
});