# TC-COMMENT-R2-001: 删除评论API返回404错误

## 测试信息
- **TC编号**：TC-COMMENT-R2-001
- **API路径**：DELETE /api/v1/tasks/:taskId/comments/:id
- **优先级**：🟡 P1（影响重要功能）
- **测试环境**：http://localhost:4100

## 操作步骤
1. 使用`admin@example.com / Admin123!`登录
2. POST `/api/v1/auth/login`获取token
3. 创建测试任务获取taskId
4. 在任务下创建评论获取commentId
5. DELETE `/api/v1/tasks/${taskId}/comments/${commentId}`
6. Header: `Authorization: Bearer ${token}`

## 输入数据/参数

### Headers
```
Authorization: Bearer ${token}
Content-Type: application/json
```

### Path Parameters
```
taskId: "adacb6d2-44a5-424d-8983-2eb6bfe3b2c4"
commentId: "comment-uuid"
```

### cURL
```bash
curl -X DELETE "http://localhost:4100/api/v1/tasks/adacb6d2-44a5-424d-8983-2eb6bfe3b2c4/comments/comment-uuid" \
  -H "Authorization: Bearer ${token}" \
  -H "Content-Type: application/json"
```

## 实际结果
- **状态码**：404
- **响应**：```json
{
  "success": false,
  "message": "Cannot DELETE /api/v1/tasks/:taskId/comments/:id"
}
```

## 期望结果
- **状态码**：200
- **响应**：```json
{
  "success": true,
  "message": "评论删除成功"
}
```

## 影响范围
- 评论删除功能不可用
- 无法管理评论内容
- 协作功能受影响

## 修复建议
1. 检查评论模块路由配置
2. 确认路由是否注册
3. 检查评论模块是否加载
4. 验证控制器是否存在

## 相关文件
- 测试文件：`tests/integration/api/comment-module/delete-comment.test.js`
- API路由：`DELETE /api/v1/tasks/:taskId/comments/:id`
- 控制器：`CommentController.delete()`
- 模块：评论模块
- 数据库表：`comments`