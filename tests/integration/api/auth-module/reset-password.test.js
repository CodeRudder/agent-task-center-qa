/**
 * 密码重置API集成测试
 * 
 * 测试范围：
 * - 正常场景：有效token重置密码成功
 * - 异常场景：token过期、token无效、新密码不符合要求
 * - 边界条件：缺少必填字段、密码格式错误
 * 
 * API文档：POST /api/v1/auth/reset-password
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('密码重置API集成测试', () => {
  
  describe('POST /api/v1/auth/reset-password', () => {
    
    let validToken;
    
    beforeAll(async () => {
      // 先请求密码找回，获取有效token
      const response = await request(API_BASE_URL)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'admin@example.com' });
      
      // 假设从邮件或数据库中获取token（实际需要模拟）
      validToken = 'valid-reset-token-123456';
    });

    test('正常场景 - 有效token重置密码成功', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/auth/reset-password')
        .send({
          token: validToken,
          newPassword: 'NewPassword123!'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.message).toContain('密码重置成功');
    });

    test('异常场景 - token过期', async () => {
      const expiredToken = 'expired-token-123456';
      
      const response = await request(API_BASE_URL)
        .post('/api/v1/auth/reset-password')
        .send({
          token: expiredToken,
          newPassword: 'NewPassword123!'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('Token已过期');
    });

    test('异常场景 - token无效', async () => {
      const invalidToken = 'invalid-token-123456';
      
      const response = await request(API_BASE_URL)
        .post('/api/v1/auth/reset-password')
        .send({
          token: invalidToken,
          newPassword: 'NewPassword123!'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('Token无效');
    });

    test('异常场景 - 新密码不符合要求（太短）', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/auth/reset-password')
        .send({
          token: validToken,
          newPassword: 'short'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('密码长度至少8位');
    });

    test('异常场景 - 新密码不符合要求（缺少大写字母）', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/auth/reset-password')
        .send({
          token: validToken,
          newPassword: 'newpassword123!'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('密码必须包含大写字母');
    });

    test('异常场景 - 新密码不符合要求（缺少小写字母）', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/auth/reset-password')
        .send({
          token: validToken,
          newPassword: 'NEWPASSWORD123!'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('密码必须包含小写字母');
    });

    test('异常场景 - 新密码不符合要求（缺少数字）', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/auth/reset-password')
        .send({
          token: validToken,
          newPassword: 'NewPassword!'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('密码必须包含数字');
    });

    test('边界条件 - 缺少token字段', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/auth/reset-password')
        .send({
          newPassword: 'NewPassword123!'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('Token是必填字段');
    });

    test('边界条件 - 缺少新密码字段', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/auth/reset-password')
        .send({
          token: validToken
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('新密码是必填字段');
    });

    test('边界条件 - token已使用（一次性token）', async () => {
      // 第一次使用token
      await request(API_BASE_URL)
        .post('/api/v1/auth/reset-password')
        .send({
          token: validToken,
          newPassword: 'NewPassword123!'
        });
      
      // 第二次使用同一个token
      const response = await request(API_BASE_URL)
        .post('/api/v1/auth/reset-password')
        .send({
          token: validToken,
          newPassword: 'AnotherPassword123!'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('Token已使用');
    });

  });
});
