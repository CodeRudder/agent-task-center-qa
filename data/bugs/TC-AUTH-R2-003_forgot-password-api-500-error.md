# TC-AUTH-R2-003: 密码找回API返回500错误

## 测试信息
- **TC编号**：TC-AUTH-R2-003
- **API路径**：POST /api/v1/auth/forgot-password
- **优先级**：🔴 P0（阻塞核心功能）
- **测试环境**：http://localhost:4100

## 操作步骤
1. POST `/api/v1/auth/forgot-password`
2. 请求体包含邮箱地址

## 输入数据/参数

### Headers
```
Content-Type: application/json
```

### Body
```json
{
  "email": "test@example.com"
}
```

### cURL
```bash
curl -X POST "http://localhost:4100/api/v1/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
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
  "message": "密码重置邮件已发送"
}
```

## 影响范围
- 密码找回功能不可用
- 用户无法自助重置密码
- 增加客服工作量

## 修复建议
1. 检查邮件发送逻辑
2. 检查用户查询逻辑
3. 验证邮箱服务配置
4. 添加异常处理和日志

## 相关文件
- 测试文件：`tests/integration/api/auth-module/forgot-password.test.js`
- API路由：`POST /api/v1/auth/forgot-password`
- 控制器：`AuthController.forgotPassword()`
