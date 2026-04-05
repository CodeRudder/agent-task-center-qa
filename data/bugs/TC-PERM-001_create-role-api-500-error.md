# TC-PERM-001: 创建角色API返回500错误

## 优先级
🟡 P1（严重）

## 操作步骤
1. 使用测试账号登录系统（test@example.com / Test123456）
2. 获取登录返回的accessToken
3. 发送POST请求到创建角色API：`http://localhost:4100/api/v1/roles`
4. 在请求头中添加Authorization：`Bearer ${accessToken}`
5. 在请求体中提供角色信息

## 输入数据/参数

### 请求URL
```
POST http://localhost:4100/api/v1/roles
```

### 请求头
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

### 请求体
```json
{
  "name": "测试角色",
  "description": "这是一个测试角色",
  "permissions": [
    "task.read",
    "task.create",
    "task.update"
  ],
  "isActive": true
}
```

## 实际结果

### HTTP状态码
```
500 Internal Server Error
```

### 响应体
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Unexpected error occurred"
}
```

### 错误详情
```
Error: Failed to create role
```

## 期望结果

### HTTP状态码
```
201 Created
```

### 响应体
```json
{
  "success": true,
  "data": {
    "id": "new-uuid-string",
    "name": "测试角色",
    "description": "这是一个测试角色",
    "permissions": [
      "task.read",
      "task.create",
      "task.update"
    ],
    "isActive": true,
    "createdAt": "2026-04-03T11:00:00.000Z"
  },
  "message": "角色创建成功"
}
```

## 影响范围
- 角色管理功能不可用
- 管理员无法创建自定义角色
- 影响权限管理和访问控制

## 复现频率
100%（每次请求都返回500错误）

## 环境信息
- **版本**：V5.9（Commit: 55a8067）
- **测试环境**：TEST环境（http://localhost:4100）
- **测试时间**：2026-04-03 10:45:00

## 修复建议
1. 检查角色创建逻辑
2. 验证权限列表验证逻辑
3. 检查角色名称唯一性验证
4. 验证数据库Role表的结构

## 测试用例文件
`tests/integration/api/permission-module/create-role.test.js`

## 测试用例名称
"正常场景 - 创建角色成功"
