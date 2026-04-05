# TC-TASK-R2-001: 创建任务API返回400错误

## 测试信息
- **TC编号**：TC-TASK-R2-001
- **API路径**：POST /api/v1/tasks
- **优先级**：🔴 P0（阻塞核心功能）
- **测试环境**：http://localhost:4100

## 操作步骤
1. 使用`admin@example.com / Admin123!`登录
2. POST `/api/v1/auth/login`获取token
3. POST `/api/v1/tasks`创建任务
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
  "title": "测试任务",
  "description": "这是一个测试任务",
  "priority": "medium",
  "status": "todo"
}
```

### cURL
```bash
curl -X POST "http://localhost:4100/api/v1/tasks" \
  -H "Authorization: Bearer ${token}" \
  -H "Content-Type: application/json" \
  -d '{"title":"测试任务","description":"这是一个测试任务","priority":"medium","status":"todo"}'
```

## 实际结果
- **状态码**：400
- **响应**：```json
{
  "success": false,
  "message": ["Title must be between 1 and 100 characters"]
}
```

## 期望结果
- **状态码**：201
- **响应**：```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "测试任务",
    "description": "这是一个测试任务",
    "priority": "medium",
    "status": "todo",
    "createdAt": "2026-04-03T14:25:00Z"
  }
}
```

## 影响范围
- 无法创建新任务
- 阻塞任务管理核心功能
- 级联影响：后续更新/删除/详情测试失败

## 修复建议
1. 检查任务DTO验证规则
2. 验证title字段验证逻辑
3. 检查中文字符支持
4. 调整验证规则或修改测试数据

## 相关文件
- 测试文件：`tests/integration/api/task-module/create-task.test.js`
- API路由：`POST /api/v1/tasks`
- 控制器：`TaskController.create()`
- DTO：`CreateTaskDto`