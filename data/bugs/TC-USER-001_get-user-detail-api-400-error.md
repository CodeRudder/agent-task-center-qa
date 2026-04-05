# TC-USER-001: 获取用户详情API返回400错误

## 优先级
🟡 P1（严重）

## 操作步骤
1. 使用测试账号登录系统（test@example.com / Test123456）
2. 获取登录返回的accessToken
3. 获取当前用户的userId
4. 发送GET请求到获取用户详情API：`http://localhost:4100/api/v1/users/${userId}`
5. 在请求头中添加Authorization：`Bearer ${accessToken}`

## 输入数据/参数

### 请求URL
```
GET http://localhost:4100/api/v1/users/{userId}
```

### 路径参数
```
userId: "uuid-string"（从登录响应中获取）
```

### 请求头
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

## 实际结果

### HTTP状态码
```
400 Bad Request
```

### 响应体
```json
{
  "statusCode": 400,
  "message": "Bad Request",
  "error": "Invalid user ID format"
}
```

### 错误详情
```
ValidationError: UUID validation failed
```

## 期望结果

### HTTP状态码
```
200 OK
```

### 响应体
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "test@example.com",
    "username": "testuser",
    "firstName": "Test",
    "lastName": "User",
    "isActive": true,
    "createdAt": "2026-04-03T10:00:00.000Z",
    "updatedAt": "2026-04-03T11:00:00.000Z"
  }
}
```

## 影响范围
- 用户详情查看功能不可用
- 用户无法查看个人信息
- 影响用户管理和个人资料编辑

## 复现频率
100%（每次请求都返回400错误）

## 环境信息
- **版本**：V5.9（Commit: 55a8067）
- **测试环境**：TEST环境（http://localhost:4100）
- **测试时间**：2026-04-03 10:45:00

## 修复建议
1. 检查userId参数验证逻辑
2. 验证UUID格式验证规则
3. 检查用户查询逻辑
4. 验证数据库User表的结构

## 测试用例文件
`tests/integration/api/user-module/get-user-detail.test.js`

## 测试用例名称
"异常场景 - 用户不存在"
