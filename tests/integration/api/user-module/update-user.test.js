/**
 * 更新用户API集成测试
 * 
 * API文档：PUT /api/v1/users/:id
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('更新用户API集成测试', () => {
  
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
  
  describe('PUT /api/v1/users/:id', () => {
    
    test('正常场景 - 更新用户信息成功', async () => {
      const response = await request(API_BASE_URL)
        .put(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '更新后的用户名'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('name', '更新后的用户名');
    });

    test('异常场景 - 用户不存在', async () => {
      const response = await request(API_BASE_URL)
        .put('/api/v1/users/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '更新名称'
        });
      
      expect(response.status).toBe(404);
    });

  });
});