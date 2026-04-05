# TC-AUTH-R2-001: 密码重置API返回400错误

## 测试信息
- **TC编号**：TC-AUTH-R2-001
- **API路径**：POST /api/v1/auth/reset-password
- **优先级**：🔴 P0（阻塞核心功能）
- **测试环境**：http://localhost:4100

## 操作步骤
1. 用户通过邮件获取重置token
2. POST `/api/v1/auth/reset-password`重置密码

## 输入数据/参数

### Headers
```
Authorization: Bearer ${token}
Content-Type: application/json
```

### Body
```json
{
  "token": "valid_reset_token_64_chars_min",
  "newPassword": "NewPass123!"
}
```

### cURL
```bash
curl -X POST "http://localhost:4100/api/v1/auth/reset-password" \
  -H "Authorization: Bearer ${token}" \
  -H "Content-Type: application/json" \
  -d '{"token":"valid_reset_token_64_chars_min","newPassword":"NewPass123!"}'
```

## 实际结果
- **状态码**：400
- **响应**：```json
{
  "success": false,
  "message": ["token must be longer than or equal to 64 characters"]
}
```

## 期望结果
- **状态码**：200
- **响应**：```json
{
  "success": true,
  "message": "密码重置成功"
}
```

## 影响范围
- 密码重置功能不可用
- 用户无法自助重置密码
- 所有10个密码重置测试用例失败

## 修复建议
1. 检查token验证逻辑
2. 确认token长度要求（64字符）
3. 检查token生成和存储
4. 统一错误提示消息

## 相关文件
- 测试文件：`tests/integration/api/auth-module/reset-password.test.js`
- API路由：`POST /api/v1/auth/reset-password`
- 控制器：`AuthController.resetPassword()`
- DTO：`ResetPasswordDto`