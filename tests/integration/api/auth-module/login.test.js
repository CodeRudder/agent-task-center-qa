/**
 * 用户登录API集成测试
 * 
 * 测试范围：
 * - 正常场景：正确邮箱和密码登录
 * - 异常场景：错误密码、用户不存在、缺少必填字段
 * - 边界条件：空字段、格式错误
 * - 安全验证：密码错误不返回具体错误
 * 
 * API文档：POST /api/v1/auth/login
 */

const request = require('supertest');

// API baseURL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('用户登录API集成测试', () => {

  describe('POST /api/v1/auth/login', () => {
    
    test('正常场景 - 正确邮箱和密码登录成功', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'Admin123!'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user).toHaveProperty('email', 'admin@example.com');
      expect(response.body.data.user).not.toHaveProperty('password'); // 不返回密码
    });

    test('异常场景 - 错误密码登录失败', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'WrongPassword123!'
        });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('邮箱或密码错误');
    });

    test('异常场景 - 用户不存在登录失败', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Admin123!'
        });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('邮箱或密码错误');
    });

    test('边界条件 - 缺少邮箱字段', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/auth/login')
        .send({
          password: 'Admin123!'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('邮箱是必填字段');
    });

    test('边界条件 - 缺少密码字段', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@example.com'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('密码是必填字段');
    });

    test('边界条件 - 邮箱格式错误', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/auth/login')
        .send({
          email: 'invalid-email-format',
          password: 'Admin123!'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('邮箱格式不正确');
    });

    test('边界条件 - 空邮箱字段', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/auth/login')
        .send({
          email: '',
          password: 'Admin123!'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    test('边界条件 - 空密码字段', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@example.com',
          password: ''
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    test('安全验证 - 密码错误不返回具体错误信息', async () => {
      const response = await request(API_BASE_URL)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'WrongPassword123!'
        });
      
      // 安全原则：不明确指出是邮箱不存在还是密码错误
      expect(response.status).toBe(401);
      expect(response.body.message).not.toContain('用户不存在');
      expect(response.body.message).not.toContain('密码错误');
      expect(response.body.message).toContain('邮箱或密码错误');
    });

  });
});
