# TC-TASK-002: 获取任务详情API返回500错误

## 优先级
🔴 P0（致命）

## 操作步骤
1. 使用测试账号登录系统（test@example.com / Test123456）
2. 获取登录返回的accessToken
3. 创建一个测试任务，获取taskId
4. 发送GET请求到任务详情API：`http://localhost:4100/api/v1/tasks/${taskId}`
5. 在请求头中添加Authorization：`Bearer ${accessToken}`

## 输入数据/参数

### 请求URL
```
GET http://localhost:4100/api/v1/tasks/{taskId}
```

### 路径参数
```
taskId: "uuid-string"（从创建任务响应中获取）
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
Error: Cannot read task details
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
    "id": "uuid-string",
    "title": "测试任务详情",
    "description": "这是一个测试任务",
    "status": "todo",
    "priority": "medium",
    "projectId": "project-uuid",
    "assigneeId": "user-uuid",
    "createdAt": "2026-04-03T10:00:00.000Z",
    "updatedAt": "2026-04-03T10:00:00.000Z"
  }
}
```

## 影响范围
- 任务详情查看功能完全不可用
- 用户无法查看单个任务的详细信息
- 影响任务编辑、删除等依赖详情的功能

## 复现频率
100%（每次请求都返回500错误）

## 环境信息
- **版本**：V5.9（Commit: 55a8067）
- **测试环境**：TEST环境（http://localhost:4100）
- **测试时间**：2026-04-03 10:45:00

## 修复建议
1. 检查任务详情查询的后端逻辑
2. 验证数据库中Task表的数据结构
3. 检查taskId参数验证逻辑
4. 确认JWT token验证和权限检查

## 测试用例文件
`tests/integration/api/task-module/get-task-detail.test.js`

## 测试用例名称
"正常场景 - 获取任务详情成功"
