/**
 * 获取Webhook详情API集成测试
 * 
 * API文档：GET /api/v1/webhooks/:id
 */

const request = require('supertest');
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4100';

describe('获取Webhook详情API集成测试', () => {
  
  let authToken;
  let projectId;
  let webhookId;
  
  beforeAll(async () => {
    // 登录获取token
    const response = await request(API_BASE_URL)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin123!'
      });
    authToken = response.body.data.accessToken;
    
    // 获取真实的项目ID
    const projectsResponse = await request(API_BASE_URL)
      .get('/api/v1/projects')
      .set('Authorization', `Bearer ${authToken}`);
    
    if (projectsResponse.body.data.projects && projectsResponse.body.data.projects.length > 0) {
      projectId = projectsResponse.body.data.projects[0].id;
    }
    
    // 创建Webhook
    const createResponse = await request(API_BASE_URL)
      .post('/api/v1/webhooks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: `TestWebhookDetail_${Date.now()}`,
        url: 'https://example.com/webhook',
        events: ['task.created'],
        projectId: projectId
      });
    
    if (createResponse.body.data) {
      webhookId = createResponse.body.data.id;
    }
  });
  
  describe('GET /api/v1/webhooks/:id', () => {
    
    test('正常场景 - 获取Webhook详情成功', async () => {
      const response = await request(API_BASE_URL)
        .get(`/api/v1/webhooks/${webhookId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('id', webhookId);
    });

    test('异常场景 - Webhook不存在', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/webhooks/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
    });

  });
});