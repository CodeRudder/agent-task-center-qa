# TC-V5.9-004: API Keys模块创建API返回400错误

## 操作步骤
1. 使用curl或Postman调用API Keys创建API
2. 提供有效的JWT token进行认证
3. 发送HTTP POST请求到API Keys端点

## 输入数据/参数

### API: 创建API密钥
- **路径**: `POST /api/v1/api-keys`
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
    "name": "测试API密钥",
    "description": "这是一个测试API密钥",
    "scopes": ["task.read", "task.write"]
  }
  ```

## 实际结果

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

- **HTTP状态码**: `201 Created`
- **响应体**:
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "API Key created successfully",
    "data": {
      "id": "key-001",
      "name": "测试API密钥",
      "description": "这是一个测试API密钥",
      "key": "sk_live_xxxxxxxxxxxxxxxx",
      "scopes": ["task.read", "task.write"],
      "isActive": true,
      "createdAt": "2026-04-02T17:47:00.000Z"
    }
  }
  ```

## 严重程度
🔴 **P1（严重）** - 影响API密钥管理功能

## 影响范围

### 受影响的测试用例（10个）
1. `api-module/create-api-key.test.js` - 4个用例
   - 创建API密钥 - 正常场景
   - 创建API密钥 - 缺少名称
   - 创建API密钥 - 无效权限范围
   - 创建API密钥 - 未登录访问

2. `api-module/get-api-keys.test.js` - 3个用例
   - 获取API密钥列表 - 正常场景
   - 获取API密钥列表 - 分页查询
   - 获取API密钥列表 - 未登录访问

3. `api-module/delete-api-key.test.js` - 3个用例
   - 删除API密钥 - 正常场景
   - 删除API密钥 - 密钥不存在
   - 删除API密钥 - 未登录访问

### 受影响的业务功能
- ❌ 无法创建新的API密钥
- ❌ 无法获取API密钥列表
- ❌ 无法删除API密钥
- ❌ 无法使用开放API功能

## 根本原因
**请求验证失败** - API返回400，可能是：
1. JWT字段映射问题（userId vs id）
2. 请求参数验证逻辑问题
3. API密钥生成逻辑问题
4. 数据库验证失败

## 建议解决方案

### 方案1：修复JWT字段映射（推荐）
1. 修复JWT token解析逻辑
2. 确保userId字段正确映射到id字段
3. 检查权限验证逻辑
4. 确保数据库操作正确

### 方案2：检查API密钥生成
1. 检查API密钥生成算法
2. 确保密钥格式正确
3. 检查密钥唯一性验证

## 验证步骤

### 验证修复
1. 调用POST /api/v1/api-keys
2. 调用GET /api/v1/api-keys
3. 调用DELETE /api/v1/api-keys/:id
4. 验证返回201/200
5. 验证API密钥创建/删除成功
6. 验证数据库记录正确

### 验收标准
- 创建API密钥返回201 Created
- 获取API密钥列表返回200 OK
- 删除API密钥返回200 OK
- 10个测试用例全部通过

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

_开发自测显示3/3通过，但QA验证显示0/10通过。测试环境或测试方法可能不一致，需要紧急排查差异原因。_