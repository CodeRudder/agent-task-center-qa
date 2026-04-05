# BUG报告: TC-V5.9-003

## 基本信息
- **BUG ID**: TC-V5.9-003
- **发现时间**: 2026-04-05 22:40
- **测试轮次**: 第12轮
- **严重程度**: P1 (严重)
- **优先级**: P1
- **状态**: 待修复

## 问题描述
用户登录功能异常，正常登录场景返回401状态码，导致用户无法登录系统。

## 测试环境
- **测试文件**: `tests/integration/api/auth-module/login.test.js`
- **测试端点**: POST /api/v1/auth/login
- **测试时间**: 2026-04-05 22:40
- **API_BASE_URL**: http://localhost:3001

## 复现步骤

### 测试用例1: 正常场景 - 正确邮箱和密码登录成功

**输入数据**:
```json
{
  "email": "test.login.success@example.com",
  "password": "Test@1234"
}
```

**请求**:
```bash
POST /api/v1/auth/login
Headers: {}
Body: {"email":"test.login.success@example.com","password":"Test@1234"}
```

**实际结果**:
```json
{
  "status": 401,
  "body": {
    "success": false,
    "message": "账户已被锁定，请10分钟后再试"
  }
}
```

**期望结果**:
```json
{
  "status": 200,
  "body": {
    "success": true,
    "data": {
      "accessToken": "...",
      "user": {...}
    }
  }
}
```

### 测试用例2: 异常场景 - 错误密码登录失败

**输入数据**:
```json
{
  "email": "test.login.wrong.password@example.com",
  "password": "Wrong@1234"
}
```

**请求**:
```bash
POST /api/v1/auth/login
Headers: {}
Body: {"email":"test.login.wrong.password@example.com","password":"Wrong@1234"}
```

**实际结果**:
```json
{
  "status": 401,
  "body": {
    "success": false,
    "message": "账户已被锁定，请10分钟后再试"
  }
}
```

**期望结果**:
```json
{
  "status": 401,
  "body": {
    "success": false,
    "message": "用户名或密码错误"
  }
}
```

### 测试用例3: 异常场景 - 用户不存在登录失败

**输入数据**:
```json
{
  "email": "nonexistent@example.com",
  "password": "Test@1234"
}
```

**请求**:
```bash
POST /api/v1/auth/login
Headers: {}
Body: {"email":"nonexistent@example.com","password":"Test@1234"}
```

**实际结果**:
```json
{
  "status": 401,
  "body": {
    "success": false,
    "message": "账户已被锁定，请12分钟后再试"
  }
}
```

**期望结果**:
```json
{
  "status": 401,
  "body": {
    "success": false,
    "message": "用户名或密码错误"
  }
}
```

### 测试用例4: 安全验证 - 密码错误不返回具体错误信息

**输入数据**:
```json
{
  "email": "test.login.security@example.com",
  "password": "Wrong@1234"
}
```

**请求**:
```bash
POST /api/v1/auth/login
Headers: {}
Body: {"email":"test.login.security@example.com","password":"Wrong@1234"}
```

**实际结果**:
```json
{
  "status": 401,
  "body": {
    "success": false,
    "message": "账户已被锁定，请10分钟后再试"
  }
}
```

**期望结果**:
```json
{
  "status": 401,
  "body": {
    "success": false,
    "message": "用户名或密码错误"
  }
}
```

## 根本原因分析

**问题1: 账户被意外锁定**
测试使用的账户被锁定，导致正常登录场景失败。锁定时长为10-12分钟。

**问题2: 错误消息不一致**
测试期望的错误消息是"用户名或密码错误"，但实际返回"账户已被锁定，请X分钟后再试"。

**问题3: 测试数据污染**
测试数据库中的用户账户状态可能被之前的测试用例影响，导致账户被锁定。

## 影响范围

**受影响的测试用例**:
- 正常场景 - 正确邮箱和密码登录成功
- 异常场景 - 错误密码登录失败
- 异常场景 - 用户不存在登录失败
- 安全验证 - 密码错误不返回具体错误信息

**影响的功能**:
- 用户无法登录系统
- 新用户注册后无法立即登录
- 测试用例不稳定，受账户锁定状态影响

## 修复建议

**短期解决方案（测试数据准备）**:
1. 在测试套件开始前，确保测试账户未被锁定
2. 每个测试用例使用独立的测试账户，避免相互影响
3. 在beforeEach中重置测试账户的锁定状态

**长期解决方案（业务逻辑优化）**:
1. 检查账户锁定策略，确保测试环境有更宽松的配置
2. 优化错误消息，根据账户状态返回不同的错误信息
3. 添加测试环境专用的配置，禁用或延长账户锁定时间

**建议的测试代码修改**:
```javascript
// 在beforeEach中添加
beforeEach(async () => {
  // 确保测试账户未被锁定
  await UserRepository.update(
    { email: 'test.login.success@example.com' },
    { loginAttempts: 0, lockedUntil: null }
  );
});
```

## 验收标准

- ✅ 正常场景能够成功登录，返回200状态码
- ✅ 错误密码登录返回401状态码，消息为"用户名或密码错误"
- ✅ 用户不存在登录返回401状态码，消息为"用户名或密码错误"
- ✅ 安全验证用例能够正确验证错误消息

## 附件

**测试日志**:
```
● 用户登录API集成测试 › POST /api/v1/auth/login › 正常场景 - 正确邮箱和密码登录成功

    expect(received).toBe(expected) // Object.is equality

    Expected: 200
    Received: 401

      28 |         });
      29 |       
    > 30 |       expect(response.status).toBe(200);
         |                               ^
      31 |       expect(response.body).toHaveProperty('success', true);
      32 |       expect(response.body.data).toHaveProperty('accessToken');
      33 |       expect(response.body.data).toHaveProperty('user');

      at Object.toBe (tests/integration/api/auth-module/login.test.js:30:31)

  ● 用户登录API集成测试 › POST /api/v1/auth/login › 异常场景 - 错误密码登录失败

    expect(received).toContain(expected) // indexOf

    Expected substring: "用户名或密码错误"
    Received string:    "账户已被锁定，请10分钟后再试"

      46 |       expect(response.status).toBe(401);
      47 |       expect(response.body).toHaveProperty('success', false);
    > 48 |      expect(response.body.message).toContain('用户名或密码错误');
         |                                     ^
      49 |    });

      at Object.toContain (tests/integration/api/auth-module/login.test.js:48:37)
```

**报告生成时间**: 2026-04-05 22:40
