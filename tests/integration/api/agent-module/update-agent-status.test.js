/**
 * 更新Agent状态API集成测试
 * 
 * API文档：PUT /api/v1/agents/:id/status
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('更新Agent状态API集成测试', () => {
  
  let authToken;
  let agentId;
  
  beforeAll(async () => {
    const response = await request(API_BASE_URL)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin123!'
      });
    authToken = response.body.data.accessToken;
    
    // 获取Agent列表，获取第一个Agent的ID
    const agentsResponse = await request(API_BASE_URL)
      .get('/api/v1/agents')
      .set('Authorization', `Bearer ${authToken}`);
    
    if (agentsResponse.body.data.agents.length > 0) {
      agentId = agentsResponse.body.data.agents[0].id;
    }
  });
  
  describe('PUT /api/v1/agents/:id/status', () => {
    
    test('正常场景 - 更新Agent状态成功', async () => {
      if (!agentId) {
        console.log('没有可用的Agent ID，跳过测试');
        return;
      }
      
      const response = await request(API_BASE_URL)
        .put(`/api/v1/agents/${agentId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'active'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('status', 'active');
    });

    test('正常场景 - 停用Agent', async () => {
      if (!agentId) {
        console.log('没有可用的Agent ID，跳过测试');
        return;
      }
      
      const response = await request(API_BASE_URL)
        .put(`/api/v1/agents/${agentId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'inactive'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('status', 'inactive');
    });

    test('异常场景 - Agent不存在', async () => {
      const response = await request(API_BASE_URL)
        .put('/api/v1/agents/nonexistent-id/status')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'active'
        });
      
      expect(response.status).toBe(404);
    });

    test('异常场景 - 无效的状态值', async () => {
      if (!agentId) {
        console.log('没有可用的Agent ID，跳过测试');
        return;
      }
      
      const response = await request(API_BASE_URL)
        .put(`/api/v1/agents/${agentId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'invalid-status'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

  });
});