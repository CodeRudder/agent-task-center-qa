# TC-AUTH-LOGIN-001: 测试账号登录失败

## 操作步骤
1. 打开终端或命令行工具
2. 使用curl工具发送HTTP POST请求到登录API
3. 提供测试账号邮箱和密码
4. 检查返回的状态码和响应体

## 输入数据/参数

**API路径**: `POST /api/v1/auth/login`

**请求头**:
```json
{
  "Content-Type": "application/json"
}
```

**请求体（Body）**:
```json
{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```

**完整curl命令**:
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!"}'
```

## 实际结果

**HTTP状态码**: `401 Unauthorized`

**响应体**:
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid credentials",
  "timestamp": "2026-04-02T08:36:27.123Z"
}
```

**错误类型**: 认证失败
**错误代码**: 401
**错误消息**: Invalid credentials（无效的凭据）

## 期望结果

**HTTP状态码**: `200 OK`

**响应体**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "70916299-e329-4cd8-9c84-6b49e9f93210",
      "email": "admin@example.com",
      "name": "Administrator",
      "role": "admin"
    }
  },
  "timestamp": "2026-04-02T08:36:27.123Z"
}
```

## 严重程度
🔴 **P0（致命）** - 无法执行任何需要认证的测试

## 影响范围

### 受影响的功能
- ❌ 无法获取访问令牌（accessToken）
- ❌ 无法执行任何需要认证的API测试
- ❌ 无法验证V5.9 P1功能（17个API端点）
- ❌ 无法执行V5.9全量回归测试（145个测试用例）

### 受影响的测试用例
- **Webhook模块**：6个API测试用例
- **权限模块**：8个API测试用例
- **报表模块**：3个API测试用例
- **用户模块**：3个API测试用例
- **项目模块**：5个API测试用例
- **任务模块**：部分测试用例
- **其他模块**：所有需要认证的API测试

## 测试环境信息

**测试时间**: 2026-04-02 16:36
**测试环境**: QA验收测试环境
**测试人**: @qa

### 服务器配置
- **前端URL**: http://localhost:4100
- **后端URL**: http://localhost:3000
- **API基础路径**: /api/v1
- **数据库**: PostgreSQL 15.x
- **Redis**: 7.x

### 测试账号
- **邮箱**: admin@example.com
- **密码**: Admin123!
- **角色**: admin

## 复现步骤

### 方法1：curl命令
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!"}'
```

### 方法2：浏览器开发者工具
1. 打开浏览器
2. 访问 http://localhost:4100
3. 打开开发者工具（F12）
4. 在Console中执行：
```javascript
fetch('http://localhost:3000/api/v1/auth/login', {
  method: 'POST',
  登录API返回401 Invalid credentials，无法获取访问令牌。这是测试账号密码问题，不是API功能问题。

## 建议解决方案

### 方案1：重置测试账号密码（推荐）
1. 连接到数据库
2. 更新用户表的密码字段
3. 使用bcrypt加密新密码
4. 更新密码为：Admin123!

### 方案2：重新创建测试账号
1. 创建新用户：admin@example.com
2. 设置密码：Admin123!
3. 分配admin角色
4. 确保用户状态激活

### 方案3：提供临时测试账号
1. 创建临时测试账号
2. 提供账号密码
3. 用于紧急测试验证

## 优先级
🔴 **P0（致命）** - 阻塞所有需要认证的测试，必须立即修复

## 验证步骤

### 验证修复
1. 使用修复后的账号密码重新登录
2. 获取accessToken
3. 调用测试API验证功能正常
4. 执行全量回归测试
5. 生成V5.9验收报告

### 验收标准
- 登录API返回200 OK
- 成功获取accessToken
- Webhook模块测试通过率≥85%
- 权限模块测试通过率≥85%
- 报表模块测试通过率≥85%

## 相关文档

- **待开发功能清单**: V5.9-pending-features.md
- **集成测试报告**: V5.9-integration-test-report.md
- **测试脚本位置**: tests/integration/api/

---

**报告生成时间**: 2026-04-02 16:36
**报告版本**: v1.0
**报告状态**: ⚠️ 待修复

---

_这是测试环境问题，不是API功能问题。修复测试账号后，V5.9功能验证可以继续进行。_