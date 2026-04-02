# TC-AUTH-002: 密码重置错误消息语言不一致

## 操作步骤
1. 调用POST /api/v1/auth/reset-password API
2. 提供过期的token
3. 发送HTTP POST请求

## 输入数据/参数
```json
{
  "token": "expired_token",
  "newPassword": "NewPassword123!"
}
```

## 实际结果
- **HTTP状态码**: 400 Bad Request
- **错误消息**: ["token must be longer than or equal to 64 characters"]

## 期望结果
- **HTTP状态码**: 400 Bad Request
- **错误消息**: ["Token已过期"]

## 严重程度
🟢 P2（一般）- 不影响功能，但影响用户体验

## 根本原因
API使用英文错误消息，测试期望中文错误消息。需要实现国际化（i18n）支持。

## 环境
- **测试时间**: 2026-04-02 11:00
- **API地址**: http://localhost:3000
