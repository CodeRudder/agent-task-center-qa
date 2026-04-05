# TC-API-001: 创建API密钥API返回400错误

## 优先级
🟡 P1（严重）

## 操作步骤
1. 使用测试账号登录系统（test@example.com / Test123456）
2. 获取登录返回的accessToken
3. 发送POST请求到创建API密钥API：`http://localhost:4100/api/v1/api-keys`
4. 在请求头中添加Authorization：`Bearer ${accessToken}`
5. 在请求体中提供API密钥信息

## 输入数据/参数

### 请求URL
```
POST http://localhost:4100/api/v1/api-keys
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
  "name": "测试API密钥",
  "scopes": ["read", "write"],
  "expiresAt": "2026-05-03T00:00:00.000Z"
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
  "error": ["Invalid scopes provided"]
}
```

### 错误详情
```
ValidationError: Scopes validation failed
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
    "name": "测试API密钥",
    "apiKey": "sk_test_xxxxxxxxxxxxx",
    "scopes": ["read", "write"],
    "expiresAt": "2026-05-03T00:00:00.000Z",
    "createdAt": "2026-04-03T11:00:00.000Z"
  },
  "message": "API密钥创建成功"
}
```

## 影响范围
- API密钥管理功能不可用
- 开发者无法创建API密钥
- 影响API访问和集成

## 复现频率
100%（每次请求都返回400错误）

## 环境信息
- **版本**：V5.9（Commit: 55a8067）
- **测试环境**：TEST环境（http://localhost:4100）
- **测试时间**：2026-04-03 10:45:00

## 修复建议
1. 检查API密钥创建逻辑
2. 验证scopes参数验证规则
3. 检查密钥生成逻辑
4. 验证数据库ApiKey表的结构

## 测试用例文件
`tests/integration/api/api-module/create-api-key.test.js`

## 测试用例名称
"正常场景 - 创建API密钥成功"
