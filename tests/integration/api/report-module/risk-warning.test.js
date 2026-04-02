/**
 * 风险预警报表API集成测试
 * 
 * API文档：GET /api/v1/reports/risk
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('风险预警报表API集成测试', () => {
  
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
  
  describe('GET /api/v1/reports/risk', () => {
    
    test('正常场景 - 获取风险预警报表成功', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/reports/risk')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          threshold: 'high'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('riskData');
      expect(response.body.data).toHaveProperty('warnings');
    });

    test('正常场景 - 获取中等风险预警', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/reports/risk')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          threshold: 'medium'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    test('异常场景 - 无效的风险阈值', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/reports/risk')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          threshold: 'invalid-threshold'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    test('异常场景 - 未登录访问', async () => {
      const response = await request(API_BASE_URL)
        .get('/api/v1/reports/risk')
        .query({
          threshold: 'high'
        });
      
      expect(response.status).toBe(401);
    });

  });
});