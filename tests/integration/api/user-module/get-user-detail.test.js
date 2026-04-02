/**
 * 获取用户详情API集成测试
 * 
 * API文档：GET /api/v1/users/:id
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('获取用户详情API集成测试', () => {
  
  let authToken;
  let userId;
  
  beforeAll(async () => {
    const response = await request(API_BASE_URL)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin123!'
      });
    authToken = response.body.data.accessToken;
    userId = response.body.data.user.id;
  });
  
  describe('GET /api/v1/users/:id', () => {
    
    test('正常场景 - 获取用户详情成功', async () => {
      const response = await request(API_BASE_URL)
        .get(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('id', userId);
      expect(response.body.data).not.toHaveProperty('password');
    });

    test('异常场景 - 用户不存在', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/users/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
    });

  });
});