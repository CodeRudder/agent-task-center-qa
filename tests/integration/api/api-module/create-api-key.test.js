/**
 * 创建API密钥API集成测试
 * 
 * API文档：POST /api/v1/api-keys
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('创建API密钥API集成测试', () => {
  
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
  
  describe('POST /api/v1/api-keys', () => {
    
    test('正常场景 - 创建API密钥成功', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/api-keys')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '测试API密钥',
          scopes: ['read', 'write']
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('apiKey');
      expect(response.body.data).toHaveProperty('name', '测试API密钥');
      expect(response.body.data).toHaveProperty('secretKey');
    });

    test('异常场景 - 缺少名称', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/api-keys')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          scopes: ['read']
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    test('异常场景 - 无限的权限范围', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/api-keys')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '测试API密钥',
          scopes: ['invalid-scope']
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

  });
});