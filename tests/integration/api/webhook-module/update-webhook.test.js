/**
 * 更新Webhook API集成测试
 * 
 * API文档：PUT /api/v1/webhooks/:id
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4100';

describe('更新Webhook API集成测试', () => {
  
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
        name: `TestUpdateWebhook_${Date.now()}`,
        url: 'https://example.com/webhook',
        events: ['task.created'],
        projectId: 'adacb6d2-44a5-424d-8983-2eb6bfe3b2c4'
      });
    webhookId = createResponse.body.data.id;
  });
  
  describe('PUT /api/v1/webhooks/:id', () => {
    
    test('正常场景 - 更新Webhook成功', async () => {
      const response = await request(API_BASE_URL)
        .put(`/api/v1/webhooks/${webhookId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '更新后的Webhook',
          url: 'https://example.com/updated-webhook'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('name', '更新后的Webhook');
    });

    test('异常场景 - Webhook不存在', async () => {
      const response = await request(API_BASE_URL)
        .put('/api/v1/webhooks/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '更新名称'
        });
      
      expect(response.status).toBe(404);
    });

  });
});