# TC-TASK-R2-002: 获取任务详情API返回500错误

## 测试信息
- **TC编号**：TC-TASK-R2-002
- **API路径**：GET /api/v1/tasks/:id
- **优先级**：🔴 P0（阻塞核心功能）
- **测试时间**：2026-04-03 14:25
- **测试环境**：http://localhost:4100

## 操作步骤
1. 使用测试账号登录系统：`admin@example.com / Admin123!`
2. 发送POST请求到 `/api/v1/auth/login` 获取访问令牌
3. 从登录响应中提取 `accessToken`
4. 创建一个测试任务（如果创建任务API正常）
5. 发送GET请求到 `/api/v1/tasks/${taskId}`
6. 添加Authorization header：`Bearer ${accessToken}`

## 输入数据/参数

### Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Path Parameters
```
id: "adacb6d2-44a5-424d-8983-2eb6bfe3b2c4"
```

### cURL命令示例
```bash
curl -X GET "http://localhost:4100/api/v1/tasks/adacb6d2-44a5-424d-8983-2eb6bfe3b2c4" \
  -H "Authorization: Bearer ${accessToken}" \
  -H "Content-Type: application/json"
```

## 实际结果
- **HTTP状态码**：500
- **响应体**：```json
{
  "success": false,
  "message": "Internal server error"
}
```
- **错误类型**：后端服务器错误
- **测试失败信息**：```
Expected: 200
Received: 500
```

## 期望结果
- **HTTP状态码**：200
- **响应体**：```json
{
  "success": true,
  "data": {
    "id": "adacb6d2-44a5-424d-8983-2eb6bfe3b2c4",
    "title": "测试任务详情",
    "description": "这是一个测试任务",
    "status": "todo",
    "priority": "medium",
    "assigneeId": "user-uuid",
    "projectId": "project-uuid",
    "createdAt": "2026-04-03T14:25:00Z",
    "updatedAt": "2026-04-03T14:25:00Z"
  }
}
```

## 影响范围
- **功能影响**：无法查看任务详情
- **用户影响**：所有用户无法查看任务的完整信息
- **业务影响**：阻塞任务详情查看功能
- **级联影响**：
  - 无法查看任务描述
  - 无法查看任务分配情况
  - 无法查看任务创建和更新时间

## 测试用例覆盖
以下4个测试用例失败：
1. 正常场景 - 获取任务详情成功
2. 异常场景 - 任务不存在（Expected 404, Received 500）
3. 边界条件 - 无效的任务ID格式（Expected 400, Received 500）
4. 边界条件 - 任务ID为空（Expected 404, Received 500）

## 修复建议
1. **立即排查**：
   - 检查后端服务日志
   - 定位500错误的具体原因
   - 检查数据库查询逻辑

2. **可能原因**：
   - 数据库查询失败
   - 任务ID验证逻辑错误
   - 业务逻辑异常
   - 数据格式转换失败

3. **修复步骤**：
   - 修复数据库查询或业务逻辑
   - 添加任务ID格式验证
   - 添加异常处理和错误日志
   - 验证修复后重新测试

## 相关文件
- **测试文件**：`tests/integration/api/task-module/get-task-detail.test.js`
- **API路由**：`GET /api/v1/tasks/:id`
- **控制器**：TaskController.getTaskDetail()

## 附加信息
- **测试执行时间**：17ms
- **数据库表**：tasks
- **需要的权限**：task.read
- **任务ID格式**：UUID v4
