# TC-PROJ-R2-002: 获取项目列表API返回500错误

## 测试信息
- **TC编号**：TC-PROJ-R2-002
- **API路径**：GET /api/v1/projects
- **优先级**：🔴 P0（阻塞核心功能）
- **测试时间**：2026-04-03 14:25
- **测试环境**：http://localhost:4100

## 操作步骤
1. 使用测试账号登录系统：`admin@example.com / Admin123!`
2. 发送POST请求到 `/api/v1/auth/login` 获取访问令牌
3. 从登录响应中提取 `accessToken`
4. 发送GET请求到 `/api/v1/projects`
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
status: active
```

### cURL命令示例
```bash
curl -X GET "http://localhost:4100/api/v1/projects?page=1&limit=10" \
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
    "projects": [
      {
        "id": "uuid",
        "name": "项目名称",
        "description": "项目描述",
        "status": "active",
        "ownerId": "user-uuid",
        "createdAt": "2026-04-03T14:25:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50
    }
  }
}
```

## 影响范围
- **功能影响**：项目列表功能完全不可用
- **用户影响**：所有用户无法查看项目列表
- **业务影响**：阻塞项目管理核心流程
- **级联影响**：
  - 无法查看活跃项目
  - 无法按状态筛选项目
  - 无法分页浏览项目

## 测试用例覆盖
以下2个测试用例失败：
1. 正常场景 - 获取项目列表成功
2. 正常场景 - 分页查询项目列表

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
- **测试文件**：`tests/integration/api/project-module/get-projects.test.js`
- **API路由**：`GET /api/v1/projects`
- **控制器**：ProjectController.getProjects()

## 附加信息
- **测试执行时间**：未记录
- **数据库表**：projects
- **需要的权限**：project.read
