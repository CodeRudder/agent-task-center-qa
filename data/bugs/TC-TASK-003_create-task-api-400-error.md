# TC-TASK-003: 创建任务API返回400错误

## 优先级
🔴 P0（致命）

## 操作步骤
1. 使用测试账号登录系统（test@example.com / Test123456）
2. 获取登录返回的accessToken
3. 发送POST请求到创建任务API：`http://localhost:4100/api/v1/tasks`
4. 在请求头中添加Authorization：`Bearer ${accessToken}`
5. 在请求体中提供任务信息

## 输入数据/参数

### 请求URL
```
POST http://localhost:4100/api/v1/tasks
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
  "title": "测试任务",
  "description": "这是一个测试任务",
  "priority": "medium",
  "status": "todo",
  "projectId": "adacb6d2-44a5-424d-8983-2eb6bfe3b2c4"
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
  "error": [
    "Title must be between 1 and 100 characters",
    "title must be a string"
  ]
}
```

### 错误详情
```
ValidationError: Title validation failed
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
    "title": "测试任务",
    "description": "这是一个测试任务",
    "status": "todo",
    "priority": "medium",
    "projectId": "adacb6d2-44a5-424d-8983-2eb6bfe3b2c4",
    "createdAt": "2026-04-03T11:00:00.000Z",
    "updatedAt": "2026-04-03T11:00:00.000Z"
  },
  "message": "任务创建成功"
}
```

## 影响范围
- 无法创建新任务
- 任务管理核心功能完全不可用
- 影响所有依赖任务创建的功能

## 复现频率
100%（每次请求都返回400错误）

## 环境信息
- **版本**：V5.9（Commit: 55a8067）
- **测试环境**：TEST环境（http://localhost:4100）
- **测试时间**：2026-04-03 10:45:00

## 修复建议
1. 检查创建任务的DTO验证逻辑
2. 确认title字段的验证规则是否正确
3. 检查请求体解析逻辑
4. 验证数据库Task表的结构和约束

## 测试用例文件
`tests/integration/api/task-module/create-task.test.js`

## 测试用例名称
"正常场景 - 创建任务成功"
