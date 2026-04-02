# TC-V5.9-005: 错误消息语言和状态码不一致问题

## 操作步骤
1. 使用curl或Postman调用相关API
2. 提供有效的JWT token进行认证
3. 发送HTTP请求到API端点
4. 检查返回的状态码和错误消息

## 输入数据/参数

### 问题1: 登录API状态码不匹配
- **路径**: `POST /api/v1/auth/login`
- **请求头**:
  ```json
  {
    "Content-Type": "application/json"
  }
  ```
- **请求体**:
  ```json
  {
    "email": "admin@example.com",
    "password": "Admin123!"
  }
  ```

### 问题2: 任务模块错误消息语言不一致
- **路径**: `POST /api/v1/tasks`
- **请求头**:
  ```json
  {
    "Authorization": "Bearer <JWT_TOKEN>",
    "Content-Type": "application/json"
  }
  ```
- **请求体**:
  ```json
  {
    "title": "测试任务",
    "description": "这是一个测试任务",
    "priority": "invalid",
    "status": "pending"
  }
  ```

### 问题3: 认证模块错误消息语言不一致
- **路径**: `POST /api/v1/auth/reset-password`
- **请求头**:
  ```json
  {
    "Content-Type": "application/json"
  }
  ```
- **请求体**:
  ```json
  {
    "token": "short_token",
    "newPassword": "NewPassword123!"
  }
  ```

## 实际结果

### 问题1: 登录API状态码不匹配
- **HTTP状态码**: `201 Created`
- **响应体**:
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "Success",
    "data": {
      "accessToken": "eyJhbGci...",
      "refreshToken": "eyJhbGci..."
    }
  }
  ```
- **问题**: 期望状态码200，实际返回201

### 问题2: 任务模块错误消息语言不一致
- **HTTP状态码**: `400 Bad Request`
- **响应体**:
  ```json
  {
    "success": false,
    "statusCode": 400,
    "message": "priority must be one of the following values: low, medium, high, urgent"
  }
  ```
- **问题**: 期望中文错误消息"无效的优先级"，实际返回英文

### 问题3: 认证模块错误消息语言不一致
- **HTTP状态码**: `400 Bad Request`
- **响应体**:
  ```json
  {
    "success": false,
    "statusCode": 400,
    "message": "token must be longer than or equal to 64 characters"
  }
  ```
- **问题**: 期望中文错误消息"token长度必须大于等于64个字符"，实际返回英文

## 期望结果

### 问题1: 登录API状态码不匹配
- **HTTP状态码**: `200 OK`
- **响应体**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "登录成功",
    "data": {
      "accessToken": "eyJhbGci...",
      "refreshToken": "eyJhbGci..."
    }
  }
  ```

### 问题2: 任务模块错误消息语言不一致
- **HTTP状态码**: `400 Bad Request`
- **响应体**:
  ```json
  {
    "success": false,
    "statusCode": 400,
    "message": "无效的优先级"
  }
  ```

### 问题3: 认证模块错误消息语言不一致
- **HTTP状态码**: `400 Bad Request`
- **响应体**:
  ```json
  {
    "success": false,
    "statusCode": 400,
    "message": "token长度必须大于等于64个字符"
  }
  ```

## 严重程度
🟢 **P2（一般）** - 不影响核心功能，但影响用户体验

## 影响范围

### 受影响的测试用例（约79个）

#### 认证模块（11个用例）
1. `auth-module/login.test.js` - 3个用例
   - 登录 - 正常场景（状态码问题）
   - 登录 - 错误密码（语言问题）
   - 登录 - 未注册用户（语言问题）

2. `auth-module/forgot-password.test.js` - 4个用例
   - 密码找回 - 正常场景（语言问题）
   - 密码找回 - 邮箱格式错误（语言问题）
   - 密码找回 - 邮箱不存在（语言问题）
   - 密码找回 - 未登录访问

3. `auth-module/reset-password.test.js` - 4个用例
   - 密码重置 - 正常场景（语言问题）
   - 密码重置 - token无效（语言问题）
   - 密码重置 - 密码格式错误（语言问题）
   - 密码重置 - 未登录访问

#### 任务模块（26个用例）
1. `task-module/create-task.test.js` - 6个用例
   - 创建任务 - 正常场景（语言问题）
   - 创建任务 - 边界条件（语言问题）
   - 创建任务 - 异常场景（语言问题）

2. `task-module/update-task.test.js` - 8个用例
   - 更新任务 - 正常场景（语言问题）
   - 更新任务 - 边界条件（语言问题）
   - 更新任务 - 异常场景（语言问题）

3. `task-module/get-tasks.test.js` - 3个用例
4. `task-module/get-task-detail.test.js` - 3个用例
5. `task-module/delete-task.test.js` - 3个用例

#### 其他模块（42个用例）
- Agent模块（9个用例）
- 项目模块（15个用例）
- 评论模块（12个用例）
- 用户模块（6个用例）

### 受影响的业务功能
- ⚠️ 错误消息使用英文，用户体验不佳
- ⚠️ 状态码与期望不符，测试失败
- ⚠️ 国际化支持不完善

## 根本原因
**国际化（i18n）支持不完善** - API返回英文错误消息，但测试期望中文

## 建议解决方案

### 方案1：实现国际化支持（推荐）
1. 添加i18n中间件
2. 根据Accept-Language header返回对应语言的错误消息
3. 默认使用中文错误消息
4. 统一API状态码规范

### 方案2：修改测试用例期望
1. 接受英文错误消息
2. 更新测试用例期望值
3. 更新API文档

## 验证步骤

### 验证修复
1. 调用各个API端点
2. 验证返回中文错误消息
3. 验证状态码符合规范
4. 验证测试用例通过

### 验收标准
- 错误消息使用中文
- 状态码符合RESTful规范
- 79个测试用例通过

## 测试环境信息

**测试时间**: 2026-04-02 17:37
**测试环境**: QA验收测试环境
**测试人**: @qa

### 服务器配置
- **后端URL**: http://localhost:3000
- **API基础路径**: /api/v1
- **数据库**: PostgreSQL 15.x

### 测试账号
- **邮箱**: admin@example.com
- **密码**: Admin123!
- **角色**: admin

---

**报告生成时间**: 2026-04-02 17:47
**报告版本**: v1.0
**报告状态**: ⚠️ 待修复

---

_错误消息语言和状态码不一致问题，影响约79个测试用例。需要实现国际化支持和统一API状态码规范。_