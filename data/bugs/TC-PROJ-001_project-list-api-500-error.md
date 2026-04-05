# TC-PROJ-001: 项目列表API返回500错误

## 优先级
🔴 P0（致命）

## 操作步骤
1. 使用测试账号登录系统（test@example.com / Test123456）
2. 获取登录返回的accessToken
3. 发送GET请求到项目列表API：`http://localhost:4100/api/v1/projects`
4. 在请求头中添加Authorization：`Bearer ${accessToken}`

## 输入数据/参数

### 请求URL
```
GET http://localhost:4100/api/v1/projects
```

### 请求头
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

### 查询参数（可选）
```
?page=1
&pageSize=10
```

## 实际结果

### HTTP状态码
```
500 Internal Server Error
```

### 响应体
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Unexpected error occurred"
}
```

### 错误详情
```
TypeError: Cannot read properties of undefined (reading 'projects')
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
    "projects": [
      {
        "id": "uuid-string",
        "name": "项目名称",
        "description": "项目描述",
        "status": "active",
        "createdAt": "2026-04-03T10:00:00.000Z",
        "updatedAt": "2026-04-03T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

## 影响范围
- 项目管理功能完全不可用
- 用户无法查看项目列表
- 影响所有依赖项目列表的功能

## 复现频率
100%（每次请求都返回500错误）

## 环境信息
- **版本**：V5.9（Commit: 55a8067）
- **测试环境**：TEST环境（http://localhost:4100）
- **测试时间**：2026-04-03 10:45:00

## 修复建议
1. 检查后端服务日志，定位500错误的具体原因
2. 验证数据库Project表的查询逻辑
3. 检查项目列表的返回数据结构
4. 验证JWT token验证逻辑

## 测试用例文件
`tests/integration/api/project-module/get-projects.test.js`

## 测试用例名称
"正常场景 - 获取项目列表成功"
