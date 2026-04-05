# TC-TASK-004: 删除任务API返回500错误

## 优先级
🔴 P0（致命）

## 操作步骤
1. 使用测试账号登录系统（test@example.com / Test123456）
2. 获取登录返回的accessToken
3. 创建一个测试任务，获取taskId
4. 发送DELETE请求到删除任务API：`http://localhost:4100/api/v1/tasks/${taskId}`
5. 在请求头中添加Authorization：`Bearer ${accessToken}`

## 输入数据/参数

### 请求URL
```
DELETE http://localhost:4100/api/v1/tasks/{taskId}
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
Error: Failed to delete task
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
  "message": "任务删除成功"
}
```

## 影响范围
- 任务删除功能不可用
- 用户无法删除不需要的任务
- 影响任务管理和数据清理

## 复现频率
100%（每次请求都返回500错误）

## 环境信息
- **版本**：V5.9（Commit: 55a8067）
- **测试环境**：TEST环境（http://localhost:4100）
- **测试时间**：2026-04-03 10:45:00

## 修复建议
1. 检查任务删除的后端逻辑
2. 验证数据库删除操作
3. 检查权限验证逻辑
4. 验证关联数据的处理（如评论、附件等）

## 测试用例文件
`tests/integration/api/task-module/delete-task.test.js`

## 测试用例名称
"正常场景 - 删除任务成功"
