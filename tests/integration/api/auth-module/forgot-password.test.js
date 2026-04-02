/**
 * 密码找回API集成测试
 * 
 * 测试范围：
 * - 正常场景：有效邮箱请求密码找回
 * - 异常场景：邮箱不存在、邮箱格式错误
 * - 边界条件：空字段、缺少必填字段
 * 
 * API文档：POST /api/v1/auth/forgot-password
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('密码找回API集成测试', () => {
  
  describe('POST /api/v1/auth/forgot-password', () => {
    
    test('正常场景 - 有效邮箱请求密码找回成功', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/auth/forgot-password')
        .send({
          email: 'admin@example.com'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.message).toContain('密码重置邮件已发送');
    });

    test('正常场景 - 不存在的邮箱也返回成功（安全原则）', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/auth/forgot-password')
        .send({
          email: 'nonexistent@example.com'
        });
      
      // 安全原则：不泄露用户是否存在
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.message).toContain('如果该邮箱存在');
    });

    test('异常场景 - 缺少邮箱字段', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/auth/forgot-password')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('邮箱是必填字段');
    });

    test('边界条件 - 邮箱格式错误', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/auth/forgot-password')
        .send({
          email: 'invalid-email-format'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('邮箱格式不正确');
    });

    test('边界条件 - 空邮箱字段', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/auth/forgot-password')
        .send({
          email: ''
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    test('安全验证 - 不泄露用户是否存在', async () => {
      const response1 = await request(API_BASE_URL)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'admin@example.com' });
      
      const response2 = await request(API_BASE_URL)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' });
      
      // 两个请求返回相同的成功消息
      expect(response1.status).toBe(response2.status);
      expect(response1.body.message).toBe(response2.body.message);
    });

  });
});
