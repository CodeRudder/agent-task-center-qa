# TC-TASK-R2-003: 获取任务列表API返回500错误

## 测试信息
- **TC编号**：TC-TASK-R2-003
- **API路径**：GET /api/v1/tasks
- **优先级**：🔴 P0（阻塞核心功能）
- **测试时间**：2026-04-03 14:25
- **测试环境**：http://localhost:4100

## 操作步骤
1. 使用测试账号登录系统：`admin@example.com / Admin123!`
2. 发送POST请求到 `/api/v1/auth/login` 获取访问令牌
3. 从登录响应中提取 `accessToken`
4. 发送GET请求到 `/api/v1/tasks`
5. 添加Authorization header：`Bearer ${accessToken}`

## 输入数据/参数

### Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Query Parameters
```
page: 1
limit: 10
status: todo
```

### cURL命令示例
```bash
curl -X GET "http://localhost:4100/api/v1/tasks?page=1&limit=10" \
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
    "tasks": [
      {
        "id": "uuid",
        "title": "任务标题",
        "description": "任务描述",
        "status": "todo",
        "priority": "medium",
        "createdAt": "2026-04-03T14:25:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100
    }
  }
}
```

## 影响范围
- **功能影响**：任务列表功能完全不可用
- **用户影响**：所有用户无法查看任务列表
- **业务影响**：阻塞任务管理核心流程
- **级联影响**：
  - 无法查看待办任务
  - 无法查看进行中任务
  - 无法按状态筛选任务
  - 无法分页浏览任务

## 测试用例覆盖
以下7个测试用例全部失败：
1. 正常场景 - 获取任务列表成功
2. 正常场景 - 分页查询任务列表
3. 正常场景 - 按状态筛选任务
4. 异常场景 - 未登录访问任务列表
5. 边界条件 - 分页参数为负数
6. 边界条件 - 分页参数过大
7. 边界条件 - 无效的状态筛选

## 修复建议
1. **立即排查**：
   - 检查后端服务日志
   - 定位500错误的具体原因
   - 检查数据库查询逻辑

2. **可能原因**：
   - 数据库连接失败
   - SQL查询语句错误
   - 业务逻辑异常
   - 数据验证失败

3. **修复步骤**：
   - 修复数据库连接或查询逻辑
   - 添加异常处理和错误日志
   - 验证修复后重新测试

## 相关文件
- **测试文件**：`tests/integration/api/task-module/get-tasks.test.js`
- **API路由**：`GET /api/v1/tasks`
- **控制器**：TaskController.getTasks()

## 附加信息
- **测试执行时间**：23ms
- **数据库表**：tasks
- **需要的权限**：task.read
