# TC-WEBHOOK-R2-001: 创建Webhook API返回500错误

## 测试信息
- **TC编号**：TC-WEBHOOK-R2-001
- **API路径**：POST /api/v1/webhooks
- **优先级**：🔴 P0（阻塞核心功能）
- **测试环境**：http://localhost:4100

## 操作步骤
1. 使用`admin@example.com / Admin123!`登录
2. POST `/api/v1/auth/login`获取token
3. POST `/api/v1/webhooks`创建webhook
4. Header: `Authorization: Bearer ${token}`

## 输入数据/参数

### Headers
```
Authorization: Bearer ${token}
Content-Type: application/json
```

### Body
```json
{
  "name": "测试Webhook",
  "url": "https://example.com/webhook",
  "events": ["task.created"],
  "projectId": "adacb6d2-44a5-424d-8983-2eb6bfe3b2c4"
}
```

### cURL
```bash
curl -X POST "http://localhost:4100/api/v1/webhooks" \
  -H "Authorization: Bearer ${token}" \
  -H "Content-Type: application/json" \
  -d '{"name":"测试Webhook","url":"https://example.com/webhook","events":["task.created"],"projectId":"adacb6d2-44a5-424d-8983-2eb6bfe3b2c4"}'
```

## 实际结果
- **状态码**：500
- **响应**：```json
{"success": false, "message": "Internal server error"}
```

## 期望结果
- **状态码**：201
- **响应**：```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "测试Webhook",
    "url": "https://example.com/webhook",
    "events": ["task.created"],
    "projectId": "adacb6d2-44a5-424d-8983-2eb6bfe3b2c4",
    "isActive": true,
    "createdAt": "2026-04-03T14:25:00Z"
  }
}
```

## 影响范围
- 无法创建Webhook
- 阻塞Webhook集成功能
- 级联影响：后续测试/更新/删除测试失败

## 修复建议
1. 检查webhook创建业务逻辑
2. 检查数据库插入操作
3. 验证projectId是否存在
4. 添加异常处理和日志

## 相关文件
- 测试文件：`tests/integration/api/webhook-module/create-webhook.test.js`
- API路由：`POST /api/v1/webhooks`
- 控制器：`WebhookController.create()`
- 数据库表：`webhooks`, `webhook_configurations`
