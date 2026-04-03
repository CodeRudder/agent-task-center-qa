/**
 * 删除Webhook API集成测试
 * 
 * API文档：DELETE /api/v1/webhooks/:id
 */

const request = require('supertest');
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('删除Webhook API集成测试', () => {
  
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
        name: `TestDeleteWebhook_${Date.now()}`,
        url: 'https://example.com/webhook'
      });
    webhookId = createResponse.body.data.id;
  });
  
  describe('DELETE /api/v1/webhooks/:id', () => {
    
    test('正常场景 - 删除Webhook成功', async () => {
      const response = await request(API_BASE_URL)
        .delete(`/api/v1/webhooks/${webhookId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    test('异常场景 - Webhook不存在', async () => {
      const response = await request(API_BASE_URL)
        .delete('/api/v1/webhooks/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
    });

  });
});