/**
 * 趋势分析报表API集成测试
 * 
 * API文档：GET /api/v1/reports/trend
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('趋势分析报表API集成测试', () => {
  
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
  
  describe('GET /api/v1/reports/trend', () => {
    
    test('正常场景 - 获取趋势分析报表成功', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/reports/trend')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          startDate: '2026-01-01',
          endDate: '2026-12-31'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('trendData');
    });

    test('异常场景 - 缺少日期范围', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/reports/trend')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    test('异常场景 - 未登录访问', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/reports/trend')
        .query({
          startDate: '2026-01-01',
          endDate: '2026-12-31'
        });
      
      expect(response.status).toBe(401);
    });

  });
});