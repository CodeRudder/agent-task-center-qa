/**
 * 获取Agent详情API集成测试
 * 
 * API文档：GET /api/v1/agents/:id
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('获取Agent详情API集成测试', () => {
  
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
  
  describe('GET /api/v1/agents/:id', () => {
    
    test('正常场景 - 获取Agent详情成功', async () => {
      if (!agentId) {
        console.log('没有可用的Agent ID，跳过测试');
        return;
      }
      
      const response = await request(API_BASE_URL)
        .get(`/api/v1/agents/${agentId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('id', agentId);
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data).toHaveProperty('status');
    });

    test('异常场景 - Agent不存在', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/agents/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
    });

    test('异常场景 - 无效的Agent ID格式', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/agents/invalid-id-format')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(400);
    });

  });
});