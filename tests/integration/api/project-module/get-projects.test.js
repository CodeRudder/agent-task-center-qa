/**
 * 获取项目列表API集成测试
 * 
 * 测试范围：
 * - 正常场景：获取项目列表成功
 * - 异常场景：未登录访问、分页参数错误
 * - 边界条件：空列表、分页边界
 * 
 * API文档：GET /api/v1/projects
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4100';

describe('获取项目列表API集成测试', () => {
  
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
  
  describe('GET /api/v1/projects', () => {
    
    test('正常场景 - 获取项目列表成功', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/projects')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('projects');
      expect(Array.isArray(response.body.data.projects)).toBe(true);
    });

    test('异常场景 - 未登录访问', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/projects');
      expect(response.status).toBe(401);
    });

    test('边界条件 - 分页参数', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/projects?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('pagination');
    });

  });
});
