/**
 * 对比分析报表API集成测试
 * 
 * API文档：GET /api/v1/reports/comparison
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('对比分析报表API集成测试', () => {
  
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
  
  describe('GET /api/v1/reports/comparison', () => {
    
    test('正常场景 - 获取对比分析报表成功', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/reports/comparison')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          period1: '2026-01-01,2026-03-31',
          period2: '2026-04-01,2026-06-30'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('comparisonData');
    });

    test('异常场景 - 缺少对比周期', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/reports/comparison')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    test('异常场景 - 无效的日期格式', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/reports/comparison')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          period1: 'invalid-date',
          period2: '2026-04-01,2026-06-30'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

  });
});