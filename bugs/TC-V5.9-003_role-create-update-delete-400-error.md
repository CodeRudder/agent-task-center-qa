# TC-V5.9-003: Role模块创建/更新API返回400错误

## 操作步骤
1. 使用curl或Postman调用Role创建/更新API
2. 提供有效的JWT token进行认证
3. 发送HTTP POST/PUT请求到Role端点

## 输入数据/参数

### API 1: 创建角色
- **路径**: `POST /api/v1/roles`
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
    "name": "测试角色",
    "description": "这是一个测试角色",
    "permissions": ["task.read", "task.write", "task.delete"]
  }
  ```

### API 2: 更新角色
- **路径**: `PUT /api/v1/roles/:id`
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
    "name": "更新后的角色",
    "description": "更新后的描述",
    "permissions": ["task.read", "task.write", "task.delete", "task.manage"]
  }
  ```

### API 3: 删除角色
- **路径**: `DELETE /api/v1/roles/:id`
- **请求头**:
  ```json
  {
    "Authorization": "Bearer <JWT_TOKEN>",
    "Content-Type": "application/json"
  }
  ```

## 实际结果

### API 1: 创建角色
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

### API 2: 更新角色
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

### API 3: 删除角色
- **HTTP状态码**: `400 Bad Request` 或 `404 Not Found`
- **响应体**:
  ```json
  {
    "success": false,
    "statusCode": 400,
    "message": "Bad Request",
    "error": "Role not found or validation failed"
  }
  ```

## 期望结果

### API 1: 创建角色
- **HTTP状态码**: `201 Created`
- **响应体**:
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "Role created successfully",
    "data": {
      "id": "role-001",
      "name": "测试角色",
      "description": "这是一个测试角色",
      "permissions": ["task.read", "task.write", "task.delete"],
      "createdAt": "2026-04-02T17:47:00.000Z"
    }
  }
  ```

### API 2: 更新角色
- **HTTP状态码**: `200 OK`
- **响应体**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Role updated successfully",
    "data": {
      "id": "role-001",
      "name": "更新后的角色",
      "description": "更新后的描述",
      "permissions": ["task.read", "task.write", "task.delete", "task.manage"],
      "updatedAt": "2026-04-02T17:47:00.000Z"
    }
  }
  ```

### API 3: 删除角色
- **HTTP状态码**: `200 OK`
- **响应体**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Role deleted successfully"
  }
  ```

## 严重程度
🔴 **P1（严重）** - 影响权限管理核心功能

## 影响范围

### 受影响的测试用例（11个）
1. `permission-module/create-role.test.js` - 4个用例
   - 创建角色 - 正常场景
   - 创建角色 - 缺少名称
   - 创建角色 - 权限为空
   - 创建角色 - 未登录访问

2. `permission-module/update-role.test.js` - 4个用例
   - 更新角色 - 正常场景
   - 更新角色 - 缺少ID
   - 更新角色 - 无效权限
   - 更新角色 - 未登录访问

3. `permission-module/delete-role.test.js` - 3个用例
   - 删除角色 - 正常场景
   - 删除角色 - 角色不存在
   - 删除角色 - 未登录访问

### 受影响的业务功能
- ❌ 无法创建新的角色
- ❌ 无法更新现有角色
- ❌ 无法删除角色
- ❌ 无法管理权限

## 根本原因
**请求验证失败** - API返回400，可能是：
1. JWT字段映射问题（userId vs id）
2. 请求参数验证逻辑问题
3. 权限验证逻辑问题
4. 数据库验证失败

## 建议解决方案

### 方案1：修复JWT字段映射（推荐）
1. 修复JWT token解析逻辑
2. 确保userId字段正确映射到id字段
3. 检查权限验证逻辑
4. 确保数据库操作正确

### 方案2：检查请求验证
1. 检查Role创建/更新的验证规则
2. 检查必填字段验证
3. 提供更好的错误消息

## 验证步骤

### 验证修复
1. 调用POST /api/v1/roles
2. 调用PUT /api/v1/roles/:id
3. 调用DELETE /api/v1/roles/:id
4. 验证返回201/200
5. 验证角色创建/更新/删除成功
6. 验证数据库记录正确

### 验收标准
- 创建角色返回201 Created
- 更新角色返回200 OK
- 删除角色返回200 OK
- 11个测试用例全部通过

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

_开发自测显示8/8通过，但QA验证显示3/14通过（只有get-roles通过）。测试环境或测试方法可能不一致，需要紧急排查差异原因。_