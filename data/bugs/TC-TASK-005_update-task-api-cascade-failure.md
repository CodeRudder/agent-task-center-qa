# TC-TASK-005: 更新任务API失败 - 无法创建测试数据

## 优先级
🔴 P0（致命）

## 操作步骤
1. 使用测试账号登录系统（test@example.com / Test123456）
2. 获取登录返回的accessToken
3. 尝试创建一个测试任务（此步骤失败）
4. 如果任务创建成功，发送PUT请求到更新任务API：`http://localhost:4100/api/v1/tasks/${taskId}`
5. 在请求头中添加Authorization：`Bearer ${accessToken}`

## 输入数据/参数

### 请求URL（创建任务）
```
POST http://localhost:4100/api/v1/tasks
```

### 请求体（创建任务）
```json
{
  "title": "测试更新任务",
  "description": "这是一个测试任务",
  "priority": "high",
  "status": "in_progress"
}
```

### 请求URL（更新任务）
```
PUT http://localhost:4100/api/v1/tasks/{taskId}
```

### 路径参数
```
taskId: "uuid-string"（应该从创建任务响应中获取）
```

### 请求头
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

### 请求体（更新任务）
```json
{
  "title": "更新后的任务标题",
  "description": "更新后的任务描述",
  "priority": "urgent",
  "status": "review"
}
```

## 实际结果

### HTTP状态码（创建任务）
```
400 Bad Request
```

### 响应体（创建任务）
```json
{
  "statusCode": 400,
  "message": "Bad Request",
  "error": ["Title must be between 1 and 100 characters"]
}
```

### JavaScript错误
```javascript
TypeError: Cannot read properties of undefined (reading 'id')
  at update-task.test.js:43:39
```

### 错误详情
```
创建任务失败，导致后续更新任务测试无法执行
createResponse.body.data 为 undefined
```

## 期望结果

### HTTP状态码（创建任务）
```
201 Created
```

### 响应体（创建任务）
```json
{
  "success": true,
  "data": {
    "id": "new-uuid-string",
    "title": "测试更新任务",
    "description": "这是一个测试任务",
    "priority": "high",
    "status": "in_progress",
    "createdAt": "2026-04-03T11:00:00.000Z",
    "updatedAt": "2026-04-03T11:00:00.000Z"
  }
}
```

### HTTP状态码（更新任务）
```
200 OK
```

### 响应体（更新任务）
```json
{
  "success": true,
  "data": {
    "id": "task-uuid",
    "title": "更新后的任务标题",
    "description": "更新后的任务描述",
    "priority": "urgent",
    "status": "review",
    "updatedAt": "2026-04-03T11:05:00.000Z"
  },
  "message": "任务更新成功"
}
```

## 影响范围
- 任务更新功能无法测试
- 所有依赖任务创建的测试用例都失败
- 影响任务管理核心功能

## 复现频率
100%（每次测试都失败）

## 环境信息
- **版本**：V5.9（Commit: 55a8067）
- **测试环境**：TEST环境（http://localhost:4100）
- **测试时间**：2026-04-03 10:45:00

## 修复建议
1. 优先修复创建任务API（TC-TASK-003）
2. 检查任务DTO验证逻辑
3. 验证数据库Task表的结构
4. 修复后再测试更新任务功能

## 测试用例文件
`tests/integration/api/task-module/update-task.test.js`

## 测试用例名称
"正常场景 - 更新任务成功"

## 根本原因
创建任务API失败（返回400错误），导致测试无法获取taskId，进而导致更新任务测试失败。这是级联失败。
