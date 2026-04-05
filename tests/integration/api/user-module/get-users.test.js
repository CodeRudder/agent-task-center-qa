/**
 * 获取用户列表API集成测试
 * 
 * API文档：GET /api/v1/users
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4100';

describe('获取用户列表API集成测试', () => {
  
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
  
  describe('GET /api/v1/users', () => {
    
    test('正常场景 - 获取用户列表成功', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('users');
      expect(Array.isArray(response.body.data.users)).toBe(true);
    });

    test('异常场景 - 未登录访问', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/users');
      expect(response.status).toBe(401);
    });

  });
});