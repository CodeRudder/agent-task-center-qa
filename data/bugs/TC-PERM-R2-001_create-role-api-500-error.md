# TC-PERM-R2-001: 创建角色API返回500错误

## 测试信息
- **TC编号**：TC-PERM-R2-001
- **API路径**：POST /api/v1/roles
- **优先级**：🔴 P0（阻塞核心功能）
- **测试环境**：http://localhost:4100

## 操作步骤
1. 使用`admin@example.com / Admin123!`登录
2. POST `/api/v1/auth/login`获取token
3. POST `/api/v1/roles`创建角色
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
  "name": "测试角色",
  "description": "这是一个测试角色",
  "permissions": ["task.read"]
}
```

### cURL
```bash
curl -X POST "http://localhost:4100/api/v1/roles" \
  -H "Authorization: Bearer ${token}" \
  -H "Content-Type: application/json" \
  -d '{"name":"测试角色","description":"这是一个测试角色","permissions":["task.read"]}'
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
    "name": "测试角色",
    "description": "这是一个测试角色",
    "permissions": ["task.read"],
    "createdAt": "2026-04-03T14:25:00Z"
  }
}
```

## 影响范围
- 无法创建角色
- 阻塞权限管理功能
- 级联影响：后续更新/删除角色测试失败

## 修复建议
1. 检查角色创建业务逻辑
2. 检查数据库插入操作
3. 验证permissions数组格式
4. 添加异常处理和日志

## 相关文件
- 测试文件：`tests/integration/api/permission-module/create-role.test.js`
- API路由：`POST /api/v1/roles`
- 控制器：`RoleController.create()`
- 数据库表：`roles`
