# TC-COMMENT-001: 更新评论API返回404错误

## 优先级
🟡 P1（严重）

## 操作步骤
1. 使用测试账号登录系统（test@example.com / Test123456）
2. 获取登录返回的accessToken
3. 创建一个测试任务，获取taskId
4. 在任务下创建一个评论，获取commentId
5. 发送PUT请求到更新评论API：`http://localhost:4100/api/v1/tasks/${taskId}/comments/${commentId}`
6. 在请求头中添加Authorization：`Bearer ${accessToken}`

## 输入数据/参数

### 请求URL
```
PUT http://localhost:4100/api/v1/tasks/{taskId}/comments/{commentId}
```

### 路径参数
```
taskId: "uuid-string"
commentId: "uuid-string"
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
  "content": "更新后的评论内容"
}
```

## 实际结果

### HTTP状态码
```
404 Not Found
```

### 响应体
```json
{
  "statusCode": 404,
  "message": "Cannot PUT /api/v1/tasks/:taskId/comments/:id",
  "error": "Not Found"
}
```

### 错误详情
```
Error: Route not found - PUT /api/v1/tasks/:taskId/comments/:id
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
    "id": "comment-uuid",
    "content": "更新后的评论内容",
    "taskId": "task-uuid",
    "authorId": "user-uuid",
    "isEdited": true,
    "createdAt": "2026-04-03T10:00:00.000Z",
    "updatedAt": "2026-04-03T11:00:00.000Z"
  },
  "message": "评论更新成功"
}
```

## 影响范围
- 评论编辑功能不可用
- 用户无法修改评论内容
- 影响协作和沟通体验

## 复现频率
100%（每次请求都返回404错误）

## 环境信息
- **版本**：V5.9（Commit: 55a8067）
- **测试环境**：TEST环境（http://localhost:4100）
- **测试时间**：2026-04-03 10:45:00

## 修复建议
1. 检查评论模块的路由配置
2. 确认 PUT /api/v1/tasks/:taskId/comments/:id 路由是否已注册
3. 验证评论更新逻辑是否正确实现
4. 检查评论权限验证逻辑

## 测试用例文件
`tests/integration/api/comment-module/update-comment.test.js`

## 测试用例名称
"正常场景 - 更新评论成功"
