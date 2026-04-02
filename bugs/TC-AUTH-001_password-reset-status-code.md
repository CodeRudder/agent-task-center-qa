# TC-AUTH-001: 密码重置API状态码不一致

## 操作步骤
1. 调用POST /api/v1/auth/reset-password API
2. 提供有效的token和新密码
3. 发送HTTP POST请求

## 输入数据/参数
```json
{
  "token": "valid_token_64_characters_or_longer",
  "newPassword": "NewPassword123!"
}
```

## 实际结果
- **HTTP状态码**: 400 Bad Request
- **错误消息**: "token must be longer than or equal to 64 characters"

## 期望结果
- **HTTP状态码**: 200 OK
- **响应体**: 
```json
{
  "success": true,
  "message": "密码重置成功"
}
```

## 严重程度
🟡 P1（严重）- 影响密码重置功能

## 环境
- **测试时间**: 2026-04-02 11:00
- **API地址**: http://localhost:3000
- **测试账号**: admin@example.com
