# TC-TASK-001: 创建任务API返回500错误

## 操作步骤
1. 调用POST /api/v1/tasks API
2. 提供任务创建数据
3. 发送HTTP POST请求

## 输入数据/参数
```json
{
  "title": "测试任务",
  "description": "这是测试任务描述",
  "priority": "high",
  "dueDate": "2026-04-09T00:00:00.000Z"
}
```

## 实际结果
- **HTTP状态码**: 500 Internal Server Error
- **错误消息**: 服务器内部错误

## 期望结果
- **HTTP状态码**: 201 Created
- **响应体**: 
```json
{
  "success": true,
  "data": {
    "id": "task-uuid",
    "title": "测试任务",
    "description": "这是测试任务描述",
    "priority": "high",
    "status": "todo",
    "createdAt": "2026-04-02T11:00:00.000Z"
  }
}
```

## 严重程度
🔴 P0（致命）- 无法创建新任务，核心功能不可用

## 可能原因
1. 数据库连接问题
2. 数据验证失败
3. 服务器代码错误

## 环境
- **测试时间**: 2026-04-02 11:00
- **API地址**: http://localhost:3000
- **认证**: Bearer Token
