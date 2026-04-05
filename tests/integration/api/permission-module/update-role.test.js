/**
 * 更新角色API集成测试
 * 
 * API文档：PUT /api/v1/roles/:id
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4100';

describe('更新角色API集成测试', () => {
  
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
        name: `测试更新角色_${Date.now()}`,
        permissions: {
          tasks: ['view']
        }
      });
    
    if (createResponse.status === 201) {
      roleId = createResponse.body.data.id;
    } else {
      console.log('Failed to create role for update test:', createResponse.body);
    }
  });
  
  describe('PUT /api/v1/roles/:id', () => {
    
    test('正常场景 - 更新角色成功', async () => {
      const response = await request(API_BASE_URL)
        .put(`/api/v1/roles/${roleId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '更新后的角色',
          description: '更新后的描述',
          permissions: {
            tasks: ['view', 'create', 'delete'],
            projects: ['view']
          }
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('name', '更新后的角色');
    });

    test('异常场景 - 角色不存在', async () => {
      const response = await request(API_BASE_URL)
        .put('/api/v1/roles/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '更新名称'
        });
      
      expect(response.status).toBe(404);
    });

  });
});