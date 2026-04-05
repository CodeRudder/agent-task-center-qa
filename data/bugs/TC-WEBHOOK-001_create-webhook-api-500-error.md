# TC-WEBHOOK-001: 创建Webhook API返回500错误

## 优先级
🟡 P1（严重）

## 操作步骤
1. 使用测试账号登录系统（test@example.com / Test123456）
2. 获取登录返回的accessToken
3. 发送POST请求到创建Webhook API：`http://localhost:4100/api/v1/webhooks`
4. 在请求头中添加Authorization：`Bearer ${accessToken}`
5. 在请求体中提供Webhook信息

## 输入数据/参数

### 请求URL
```
POST http://localhost:4100/api/v1/webhooks
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
  "name": "测试Webhook",
  "url": "https://example.com/webhook",
  "events": ["task.created", "task.updated"],
  "projectId": "adacb6d2-44a5-424d-8983-2eb6bfe3b2c4",
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
Error: Failed to create webhook
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
    "name": "测试Webhook",
    "url": "https://example.com/webhook",
    "events": ["task.created", "task.updated"],
    "projectId": "adacb6d2-44a5-424d-8983-2eb6bfe3b2c4",
    "isActive": true,
    "secret": "webhook-secret-key",
    "createdAt": "2026-04-03T11:00:00.000Z"
  },
  "message": "Webhook创建成功"
}
```

## 影响范围
- Webhook功能不可用
- 用户无法创建集成通知
- 影响系统扩展性和集成能力

## 复现频率
100%（每次请求都返回500错误）

## 环境信息
- **版本**：V5.9（Commit: 55a8067）
- **测试环境**：TEST环境（http://localhost:4100）
- **测试时间**：2026-04-03 10:45:00

## 修复建议
1. 检查Webhook创建逻辑
2. 验证URL验证逻辑
3. 检查事件类型验证
4. 验证项目ID是否存在

## 测试用例文件
`tests/integration/api/webhook-module/create-webhook.test.js`

## 测试用例名称
"正常场景 - 创建Webhook成功"
