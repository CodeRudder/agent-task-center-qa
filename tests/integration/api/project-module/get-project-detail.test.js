/**
 * 获取项目详情API集成测试
 * 
 * API文档：GET /api/v1/projects/:id
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4100';

describe('获取项目详情API集成测试', () => {
  
  let authToken;
  let projectId;
  
  beforeAll(async () => {
    const response = await request(API_BASE_URL)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin123!'
      });
    authToken = response.body.data.accessToken;
    
    const createResponse = await request(API_BASE_URL)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: '测试项目详情'
      });
    projectId = createResponse.body.data.id;
  });
  
  describe('GET /api/v1/projects/:id', () => {
    
    test('正常场景 - 获取项目详情成功', async () => {
      const response = await request(API_BASE_URL)
        .get(`/api/v1/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('id', projectId);
    });

    test('异常场景 - 项目不存在', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/projects/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
    });

  });
});
