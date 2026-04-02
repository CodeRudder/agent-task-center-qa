# TC-AUTH-003: 登录API状态码不一致

## 操作步骤
1. 调用POST /api/v1/auth/login API
2. 提供正确的邮箱和密码
3. 发送HTTP POST请求

## 输入数据/参数
```json
{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```

## 实际结果
- **HTTP状态码**: 201 Created
- **响应体**: 
```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "user": {...}
  }
}
```

## 期望结果
- **HTTP状态码**: 200 OK
- **响应体**: 
```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "user": {...}
  }
}
```

## 严重程度
🟢 P2（一般）- 功能正常，状态码不符合REST规范

## 说明
登录功能正常工作，但返回201 Created而不是200 OK。根据HTTP规范，登录操作应该返回200 OK（因为不是创建新资源）。

## 环境
- **测试时间**: 2026-04-02 11:00
- **API地址**: http://localhost:3000
- **测试账号**: admin@example.com
