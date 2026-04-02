# TC-TASK-001: 获取任务详情API返回500错误

## 操作步骤

### 1. 登录获取Token
```bash
curl -X POST http://localhost:4100/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"Test123456"}'
```

### 2. 获取任务详情
```bash
curl -X GET http://localhost:4100/api/v1/tasks/5034bc9a-925c-45a0-affa-6daa54c0d44f \
  -H "Authorization: Bearer {token}"
```

## 输入数据/参数

### 请求头
- `Authorization`: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
- `Content-Type`: application/json

### 路径参数
- `taskId`: `5034bc9a-925c-45a0-affa-6daa54c0d44f`

### 测试账号
- **email**: testuser@example.com
- **password**: Test123456

## 实际结果

### 状态码
500 Internal Server Error

### 响应体
```json
{
  "success": false,
  "statusCode": 500,
  "message": "column Task__Task_statusHistories.changed_at does not exist",
  "timestamp": "2026-03-30T04:01:26.577Z"
}
```

### 错误信息
`column Task__Task_statusHistories.changed_at does not exist`

## 期望结果

### 状态码
200 OK

### 响应体
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": "5034bc9a-925c-45a0-affa-6daa54c0d44f",
    "title": "V5.7评论API测试",
    "description": "重新测试编辑和删除评论API",
    "status": "todo",
    "priority": "high",
    "progress": 80,
    "assignee": {
      "id": "6a8adf96-6984-4b31-a557-b24fc6bde471",
      "email": "testuser@example.com",
      "username": "testuser1",
      "displayName": "Test User"
    },
    "statusHistories": [],
    "dependencies": [],
    "isBlockedByDependency": false
  }
}
```

## 修复状态
✅ 已修复并验证通过（2026-03-30 13:01）

---

**文件路径**: `data/bugs/TC-TASK-001_get-task-detail-500-error.md`
