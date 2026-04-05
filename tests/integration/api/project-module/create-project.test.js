/**
 * 创建项目API集成测试
 * 
 * API文档：POST /api/v1/projects
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4100';

describe('创建项目API集成测试', () => {
  
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
  
  describe('POST /api/v1/projects', () => {
    
    test('正常场景 - 创建项目成功', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '测试项目',
          description: '项目描述'
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('name', '测试项目');
    });

    test('异常场景 - 缺少名称', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: '项目描述'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

  });
});
