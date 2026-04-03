/**
 * 获取角色详情API集成测试
 * 
 * API文档：GET /api/v1/roles/:id
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('获取角色详情API集成测试', () => {
  
  let authToken;
  let roleId;
  
  beforeAll(async () => {
    const response = await request(API_BASE_URL)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin123!'
      });
    authToken = response.body.data.accessToken;
    
    const createResponse = await request(API_BASE_URL)
      .post('/api/v1/roles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: '测试角色详情',
        permissions: ['task.read']
      });
    roleId = createResponse.body.data.id;
  });
  
  describe('GET /api/v1/roles/:id', () => {
    
    test('正常场景 - 获取角色详情成功', async () => {
      const response = await request(API_BASE_URL)
        .get(`/api/v1/roles/${roleId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('id', roleId);
      expect(response.body.data).toHaveProperty('permissions');
      expect(Array.isArray(response.body.data.permissions)).toBe(true);
    });

    test('异常场景 - 角色不存在', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/roles/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
    });

  });
});