# TC-V5.9-002: Webhook模块创建/更新API返回400错误

## 操作步骤
1. 使用curl或Postman调用Webhook创建/更新API
2. 提供有效的JWT token进行认证
3. 发送HTTP POST/PUT请求到Webhook端点

## 输入数据/参数

### API 1: 创建Webhook
- **路径**: `POST /api/v1/webhooks`
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
    "name": "测试Webhook",
    "url": "https://example.com/webhook",
    "events": ["task.created", "task.updated"],
    "secret": "auto-generated"
  }
  ```

### API 2: 更新Webhook
- **路径**: `PUT /api/v1/webhooks/:id`
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
    "name": "更新后的Webhook",
    "url": "https://example.com/webhook-updated",
    "events": ["task.created", "task.updated", "task.deleted"]
  }
  ```

## 实际结果

### API 1: 创建Webhook
- **HTTP状态码**: `400 Bad Request`
- **响应体**:
  ```json
  {
    "success": false,
    "statusCode": 400,
    "message": "Bad Request",
    "error": "Validation failed"
  }
  ```

### API 2: 更新Webhook
- **HTTP状态码**: `400 Bad Request`
- **响应体**:
  ```json
  {
    "success": false,
    "statusCode": 400,
    "message": "Bad Request",
    "error": "Validation failed"
  }
  ```

## 期望结果

### API 1: 创建Webhook
- **HTTP状态码**: `201 Created`
- **响应体**:
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "Webhook created successfully",
    "data": {
      "id": "webhook-001",
      "name": "测试Webhook",
      "url": "https://example.com/webhook",
      "events": ["task.created", "task.updated"],
      "secret": "auto-generated-secret-key",
      "isActive": true,
      "createdAt": "2026-04-02T17:47:00.000Z"
    }
  }
  ```

### API 2: 更新Webhook
- **HTTP状态码**: `200 OK`
- **响应体**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Webhook updated successfully",
    "data": {
      "id": "webhook-001",
      "name": "更新后的Webhook",
      "url": "https://example.com/webhook-updated",
      "events": ["task.created", "task.updated", "task.deleted"],
      "isActive": true,
      "updatedAt": "2026-04-02T17:47:00.000Z"
    }
  }
  ```

## 严重程度
🔴 **P1（严重）** - 影响Webhook核心功能

## 影响范围

### 受影响的测试用例（8个）
1. `webhook-module/create-webhook.test.js` - 4个用例
   - 创建Webhook - 正常场景
   - 创建Webhook - 缺少名称
   - 创建Webhook - 无效URL
   - 创建Webhook - 未登录访问

2. `webhook-module/update-webhook.test.js` - 4个用例
   - 更新Webhook - 正常场景
   - 更新Webhook - 缺少ID
   - 更新Webhook - 无效URL
   - 更新Webhook - 未登录访问

### 受影响的业务功能
- ❌ 无法创建新的Webhook配置
- ❌ 无法更新现有Webhook配置
- ❌ 无法使用Webhook推送功能

## 根本原因
**请求验证失败** - API返回400，可能是：
1. 请求参数验证逻辑问题
2. secret字段自动生成逻辑问题
3. JWT字段映射问题（userId vs id）
4. 数据库验证失败

## 建议解决方案

### 方案1：修复请求验证逻辑（推荐）
1. 检查Webhook创建/更新的验证规则
2. 修复secret字段自动生成逻辑
3. 修复JWT字段映射问题
4. 确保数据库操作正确

### 方案2：放宽验证规则
1. 检查哪些字段是必填的
2. 放宽验证规则
3. 提供更好的错误消息

## 验证步骤

### 验证修复
1. 调用POST /api/v1/webhooks
2. 调用PUT /api/v1/webhooks/:id
3. 验证返回201/200
4. 验证Webhook创建/更新成功
5. 验证数据库记录正确

### 验收标准
- 创建Webhook返回201 Created
- 更新Webhook返回200 OK
- 8个测试用例全部通过

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

_开发自测显示7/7通过，但QA验证显示0/8通过。测试环境或测试方法可能不一致，需要紧急排查差异原因。_