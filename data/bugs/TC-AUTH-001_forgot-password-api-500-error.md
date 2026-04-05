# TC-AUTH-001: 密码找回API返回500错误

## 优先级
🟡 P1（严重）

## 操作步骤
1. 发送POST请求到密码找回API：`http://localhost:4100/api/v1/auth/forgot-password`
2. 在请求体中提供用户邮箱

## 输入数据/参数

### 请求URL
```
POST http://localhost:4100/api/v1/auth/forgot-password
```

### 请求头
```json
{
  "Content-Type": "application/json"
}
```

### 请求体
```json
{
  "email": "test@example.com"
}
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
Error: Failed to send password reset email
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
  "message": "密码重置邮件已发送，请查收邮箱"
}
```

## 影响范围
- 密码找回功能不可用
- 用户无法自助重置密码
- 增加管理员支持成本

## 复现频率
100%（每次请求都返回500错误）

## 环境信息
- **版本**：V5.9（Commit: 55a8067）
- **测试环境**：TEST环境（http://localhost:4100）
- **测试时间**：2026-04-03 10:45:00

## 修复建议
1. 检查邮件服务配置
2. 验证邮件发送逻辑
3. 检查用户查询逻辑
4. 验证密码重置token生成逻辑

## 测试用例文件
`tests/integration/api/auth-module/forgot-password.test.js`

## 测试用例名称
"正常场景 - 有效邮箱请求密码找回成功"
