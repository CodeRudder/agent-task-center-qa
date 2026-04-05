/**
 * 获取Webhook列表API集成测试
 * 
 * API文档：GET /api/v1/webhooks
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4100';

describe('获取Webhook列表API集成测试', () => {
  
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
  
  describe('GET /api/v1/webhooks', () => {
    
    test('正常场景 - 获取Webhook列表成功', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/webhooks')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('items');
      expect(Array.isArray(response.body.data.items)).toBe(true);
    });

    test('异常场景 - 未登录访问', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/webhooks');
      expect(response.status).toBe(401);
    });

  });
});