/**
 * 获取权限列表API集成测试
 * 
 * API文档：GET /api/v1/permissions
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('获取权限列表API集成测试', () => {
  
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
  
  describe('GET /api/v1/permissions', () => {
    
    test('正常场景 - 获取权限列表成功', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/permissions')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('permissions');
      expect(Array.isArray(response.body.data.permissions)).toBe(true);
      
      // 验证权限格式
      if (response.body.data.permissions.length > 0) {
        expect(response.body.data.permissions[0]).toHaveProperty('name');
        expect(response.body.data.permissions[0]).toHaveProperty('description');
      }
    });

    test('异常场景 - 未登录访问', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/permissions');
      expect(response.status).toBe(401);
    });

    test('正常场景 - 按模块筛选权限', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/permissions?module=task')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('permissions');
    });

  });
});