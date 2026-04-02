/**
 * 创建Webhook API集成测试
 * 
 * API文档：POST /api/v1/webhooks
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('创建Webhook API集成测试', () => {
  
  let authToken;
  
  beforeAll(async () => {
    const response = await request(API_BASE_URL)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin123!'
      });
    authToken = response.body.data.accessToken;
  });
  
  describe('POST /api/v1/webhooks', () => {
    
    test('正常场景 - 创建Webhook成功', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/webhooks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '测试Webhook',
          url: 'https://example.com/webhook',
          events: ['task.created', 'task.updated'],
          projectId: 'adacb6d2-44a5-424d-8983-2eb6bfe3b2c4'
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('name', '测试Webhook');
    });

    test('异常场景 - 缺少名称', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/webhooks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          url: 'https://example.com/webhook'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    test('异常场景 - 无效的URL', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/webhooks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '测试Webhook',
          url: 'invalid-url'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

  });
});