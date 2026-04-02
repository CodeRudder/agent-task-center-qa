# TC-USER-001: 获取用户详情API返回500错误

## 操作步骤

### 1. 登录获取Token
```bash
curl -X POST http://localhost:4100/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"Test123456"}'
```

### 2. 获取用户详情
```bash
curl -X GET http://localhost:4100/api/v1/users/6a8adf96-6984-4b31-a557-b24fc6bde471 \
  -H "Authorization: Bearer {token}"
```

## 输入数据/参数

### 请求头
- `Authorization`: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
- `Content-Type`: application/json

### 路径参数
- `userId`: `6a8adf96-6984-4b31-a557-b24fc6bde471`

### 测试账号
- **email**: testuser@example.com
- **password**: Test123456

## 实际结果

### 状态码
500 Internal Server Error

### 响应体
```json
{
  "success": false,
  "statusCode": 500,
  "message": "relation \"role_permissions\" does not exist",
  "timestamp": "2026-03-30T03:36:56.123Z"
}
```

### 错误信息
`relation "role_permissions" does not exist`

## 期望结果

### 状态码
200 OK

### 响应体
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": "6a8adf96-6984-4b31-a557-b24fc6bde471",
    "username": "testuser1",
    "email": "testuser@example.com",
    "displayName": "Test User",
    "role": "user",
    "status": "active",
    "createdAt": "2026-03-29T21:46:19.190Z",
    "lastLoginAt": null,
    "permissions": []
  }
}
```

## 修复状态
✅ 已修复并验证通过（2026-03-30 13:01）

---

**文件路径**: `data/bugs/TC-USER-001_get-user-detail-500-error.md`
