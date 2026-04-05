# TC-PROJ-R2-001: 创建项目API返回500错误

## 测试信息
- **TC编号**：TC-PROJ-R2-001
- **API路径**：POST /api/v1/projects
- **优先级**：🔴 P0（阻塞核心功能）
- **测试环境**：http://localhost:4100

## 操作步骤
1. 使用`admin@example.com / Admin123!`登录
2. POST `/api/v1/auth/login`获取token
3. POST `/api/v1/projects`创建项目
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
  "name": "测试项目",
  "description": "这是一个测试项目",
  "status": "active"
}
```

### cURL
```bash
curl -X POST "http://localhost:4100/api/v1/projects" \
  -H "Authorization: Bearer ${token}" \
  -H "Content-Type: application/json" \
  -d '{"name":"测试项目","description":"这是一个测试项目","status":"active"}'
```

## 实际结果
- **状态码**：500
- **响应**：```json
{"success": false, "message": "Internal server error"}
```

## 期望结果
- **状态码**：201
- **响应**：```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "测试项目",
    "description": "这是一个测试项目",
    "status": "active",
    "createdAt": "2026-04-03T14:25:00Z"
  }
}
```

## 影响范围
- 无法创建新项目
- 阻塞项目创建流程
- 级联影响：后续更新/删除测试失败（无法获取项目ID）

## 修复建议
1. 检查项目创建业务逻辑
2. 检查数据库插入操作
3. 添加异常处理和日志

## 相关文件
- 测试文件：`tests/integration/api/project-module/create-project.test.js`
- API路由：`POST /api/v1/projects`
- 控制器：`ProjectController.create()`
