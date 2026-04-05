# TC-TASK-R2-004: 删除任务API返回500错误

## 测试信息
- **TC编号**：TC-TASK-R2-004
- **API路径**：DELETE /api/v1/tasks/:id
- **优先级**：🔴 P0（阻塞核心功能）
- **测试环境**：http://localhost:4100

## 操作步骤
1. 使用`admin@example.com / Admin123!`登录
2. POST `/api/v1/auth/login`获取token
3. 创建测试任务获取taskId
4. DELETE `/api/v1/tasks/${taskId}`
5. Header: `Authorization: Bearer ${token}`

## 输入数据/参数

### Headers
```
Authorization: Bearer ${token}
Content-Type: application/json
```

### Path Parameters
```
id: "adacb6d2-44a5-424d-8983-2eb6bfe3b2c4"
```

### cURL
```bash
curl -X DELETE "http://localhost:4100/api/v1/tasks/adacb6d2-44a5-424d-8983-2eb6bfe3b2c4" \
  -H "Authorization: Bearer ${token}" \
  -H "Content-Type: application/json"
```

## 实际结果
- **状态码**：500
- **响应**：```json
{"success": false, "message": "Internal server error"}
```

## 期望结果
- **状态码**：200
- **响应**：```json
{
  "success": true,
  "message": "任务删除成功"
}
```

## 影响范围
- 无法删除任务
- 阻塞任务管理功能
- 数据清理功能不可用

## 修复建议
1. 检查删除业务逻辑
2. 检查数据库删除操作
3. 验证任务ID存在性
4. 添加异常处理和日志

## 相关文件
- 测试文件：`tests/integration/api/task-module/delete-task.test.js`
- API路由：`DELETE /api/v1/tasks/:id`
- 控制器：`TaskController.delete()`
- 数据库表：`tasks`
