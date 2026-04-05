/**
 * 删除角色API集成测试
 * 
 * API文档：DELETE /api/v1/roles/:id
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4100';

describe('删除角色API集成测试', () => {
  
  let authToken;
  let roleId;
  
  beforeEach(async () => {
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
        name: `测试删除角色_${Date.now()}`,
        description: '用于删除测试的角色',
        permissions: {
          tasks: ['view']
        }
      });
    
    if (createResponse.status === 201) {
      roleId = createResponse.body.data.id;
    } else {
      console.log('Failed to create role for delete test:', createResponse.body);
    }
  });
  
  describe('DELETE /api/v1/roles/:id', () => {
    
    test('正常场景 - 删除角色成功', async () => {
      const response = await request(API_BASE_URL)
        .delete(`/api/v1/roles/${roleId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.message).toContain('角色删除成功');
    });

    test('异常场景 - 角色不存在', async () => {
      const response = await request(API_BASE_URL)
        .delete('/api/v1/roles/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
    });

    test('边界条件 - 删除系统默认角色', async () => {
      const response = await request(API_BASE_URL)
        .delete('/api/v1/roles/admin-role-id')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('不能删除系统默认角色');
    });

  });
});