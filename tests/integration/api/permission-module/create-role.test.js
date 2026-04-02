/**
 * 创建角色API集成测试
 * 
 * API文档：POST /api/v1/roles
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('创建角色API集成测试', () => {
  
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
  
  describe('POST /api/v1/roles', () => {
    
    test('正常场景 - 创建角色成功', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/roles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '测试角色',
          description: '这是一个测试角色',
          permissions: {
            tasks: ['view', 'create'],
            projects: ['view']
          }
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('name', '测试角色');
    });

    test('异常场景 - 缺少名称', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/roles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: '这是一个测试角色'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    test('异常场景 - 重复的角色名', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/roles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'admin'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

  });
});