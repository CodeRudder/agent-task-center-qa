# TC-V5.9-001: Task模块API返回500服务器错误

## 优先级
🔴 **P0 - 致命**

## 影响范围
约40个测试用例失败，覆盖Task模块所有API端点

## 操作步骤

### 测试1：创建任务
```bash
# API调用
POST http://localhost:3001/api/v1/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "测试任务",
  "description": "这是一个测试任务",
  "priority": "medium",
  "status": "todo",
  "projectId": "adacb6d2-44a5-424d-8983-2eb6bfe3b2c4"
}
```

### 测试2：查询任务列表
```bash
# API调用
GET http://localhost:3001/api/v1/tasks
Authorization: Bearer <token>
```

### 测试3：查询任务详情
```bash
# API调用
GET http://localhost:3001/api/v1/tasks/<task-id>
Authorization: Bearer <token>
```

### 测试4：更新任务
```bash
# API调用
PUT http://localhost:3001/api/v1/tasks/<task-id>
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "更新后的任务标题"
}
```

### 测试5：删除任务
```bash
# API调用
DELETE http://localhost:3001/api/v1/tasks/<task-id>
Authorization: Bearer <token>
```

## 输入数据/参数

**Headers**:
- `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (有效token)

**Body (创建任务)**:
```json
{
  "title": "测试任务",
  "description": "这是一个测试任务",
  "priority": "medium",
  "status": "todo",
  "projectId": "adacb6d2-44a5-424d-8983-2eb6bfe3b2c4"
}
```

**Query参数 (查询任务列表)**:
- 无

**Path参数**:
- `task-id`: 任务ID（UUID格式）

## 实际结果

**HTTP状态码**: `500 Internal Server Error`

**响应体**:
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Unknown error"
}
```

**Jest测试输出**:
```
Expected: 201 or 200
Received: 500

  at Object.<anonymous> (tests/integration/api/task-module/create-task.test.js:45:18)
```

## 期望结果

**HTTP状态码**: `201 Created` (创建) 或 `200 OK` (查询、更新、删除)

**响应体**:
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Success",
  "data": {
    "id": "uuid",
    "title": "测试任务",
    "description": "这是一个测试任务",
    "priority": "medium",
    "status": "todo",
    "projectId": "adacb6d2-44a5-424d-8983-2eb6bfe3b2c4",
    "createdAt": "2026-04-02T11:00:00.000Z",
    "updatedAt": "2026-04-02T11:00:00.000Z"
  }
}
```

## 环境信息

- **测试时间**: 2026-04-02 19:00
- **测试环境**: prepare/v5.9分支
- **代码版本**: commit fa70a95
- **后端服务**: http://localhost:3001
- **测试账号**: admin@example.com / Admin123!

## 附加信息

**可能原因**:
1. 数据库连接问题
2. Task表或相关表不存在
3. 数据库迁移未执行
4. ORM配置问题
5. 缺少必要的依赖服务

**日志查看**:
```bash
# 查看后端服务日志
docker logs <backend-container-id>
```

**相关测试文件**:
- `tests/integration/api/task-module/create-task.test.js`
- `tests/integration/api/task-module/get-tasks.test.js`
- `tests/integration/api/task-module/get-task-detail.test.js`
- `tests/integration/api/task-module/update-task.test.js`
- `tests/integration/api/task-module/delete-task.test.js`
- `tests/integration/api/task-module/assign-task.test.js`
- `tests/integration/api/task-module/unassign-task.test.js`