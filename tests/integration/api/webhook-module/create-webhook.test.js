/**
 * 创建Webhook API集成测试
 * 
 * API文档：POST /api/v1/webhooks
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4100';

describe('创建Webhook API集成测试', () => {
  
  let authToken;
  let projectId;
  
  beforeAll(async () => {
    // 登录获取token
    const loginResponse = await request(API_BASE_URL)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin123!'
      });
    authToken = loginResponse.body.data.accessToken;
    
    // 获取真实的项目ID
    const projectsResponse = await request(API_BASE_URL)
      .get('/api/v1/projects')
      .set('Authorization', `Bearer ${authToken}`);
    
    if (projectsResponse.body.data.projects && projectsResponse.body.data.projects.length > 0) {
      projectId = projectsResponse.body.data.projects[0].id;
    }
  });
  
  describe('POST /api/v1/webhooks', () => {
    
    test('正常场景 - 创建Webhook成功', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/webhooks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: `TestWebhook_${Date.now()}`,
          url: 'https://example.com/webhook',
          events: ['task.created', 'task.updated'],
          projectId: projectId
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('name');
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
          name: `TestWebhook_${Date.now()}`,
          url: 'invalid-url'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

  });
});