# TC-AUTH-004: 登录错误消息语言不一致

## 操作步骤
1. 调用POST /api/v1/auth/login API
2. 提供错误的密码
3. 发送HTTP POST请求

## 输入数据/参数
```json
{
  "email": "admin@example.com",
  "password": "WrongPassword123!"
}
```

## 实际结果
- **HTTP状态码**: 401 Unauthorized
- **错误消息**: "Invalid credentials"

## 期望结果
- **HTTP状态码**: 401 Unauthorized
- **错误消息**: "邮箱或密码错误"

## 严重程度
🟢 P2（一般）- 不影响功能，但影响用户体验

## 根本原因
API使用英文错误消息，测试期望中文错误消息。需要实现国际化（i18n）支持。

## 环境
- **测试时间**: 2026-04-02 11:00
- **API地址**: http://localhost:3000
