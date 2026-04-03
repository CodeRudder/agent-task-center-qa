/**
 * 更新项目API集成测试
 * 
 * API文档：PUT /api/v1/projects/:id
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('更新项目API集成测试', () => {
  
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
        name: '测试更新项目'
      });
    projectId = createResponse.body.data.id;
  });
  
  describe('PUT /api/v1/projects/:id', () => {
    
    test('正常场景 - 更新项目成功', async () => {
      const response = await request(API_BASE_URL)
        .put(`/api/v1/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '更新后的项目名称',
          description: '更新后的描述'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('name', '更新后的项目名称');
    });

    test('异常场景 - 项目不存在', async () => {
      const response = await request(API_BASE_URL)
        .put('/api/v1/projects/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '更新名称'
        });
      
      expect(response.status).toBe(404);
    });

  });
});
