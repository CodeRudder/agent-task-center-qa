# TC-V5.9-002: Auth模块错误消息语言不匹配

## 优先级
🟡 **P1 - 严重**

## 影响范围
约10个测试用例失败，覆盖Auth模块重置密码和登录API

## 操作步骤

### 测试1：重置密码 - Token过期
```bash
# API调用
POST http://localhost:3001/api/v1/auth/reset-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "token": "expired_token_64_chars_min_length...",
  "newPassword": "NewPass123!"
}
```

### 测试2：重置密码 - Token无效
```bash
# API调用
POST http://localhost:3001/api/v1/auth/reset-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "token": "invalid_token_format",
  "newPassword": "NewPass123!"
}
```

### 测试3：重置密码 - 密码太短
```bash
# API调用
POST http://localhost:3001/api/v1/auth/reset-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "token": "valid_token_64_chars_min_length...",
  "newPassword": "Short1!"
}
```

### 测试4：重置密码 - 密码缺少大写字母
```bash
# API调用
POST http://localhost:3001/api/v1/auth/reset-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "token": "valid_token_64_chars_min_length...",
  "newPassword": "newpass123!"
}
```

### 测试5：重置密码 - 密码缺少小写字母
```bash
# API调用
POST http://localhost:3001/api/v1/auth/reset-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "token": "valid_token_64_chars_min_length...",
  "newPassword": "NEWPASS123!"
}
```

### 测试6：重置密码 - 密码缺少数字
```bash
# API调用
POST http://localhost:3001/api/v1/auth/reset-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "token": "valid_token_64_chars_min_length...",
  "newPassword": "NewPassword!"
}
```

## 输入数据/参数

**Headers**:
- `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (有效token)

**Body**:
```json
{
  "token": "string (64-128 characters)",
  "newPassword": "string (6-20 characters, must contain uppercase, lowercase, number)"
}
```

## 实际结果

**HTTP状态码**: `400 Bad Request`

**响应体**:
```json
{
  "success": false,
  "statusCode": 400,
  "message": [
    "token must be longer than or equal to 64 characters",
    "token must be shorter than or equal to 128 characters",
    "token must be a string",
    "newPassword must be shorter than or equal to 20 characters",
    "newPassword must be longer than or equal to 6 characters",
    "newPassword must be a string",
    "newPassword must match ^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$ regular expression"
  ],
  "timestamp": "2026-04-02T11:00:00.000Z"
}
```

**Jest测试输出**:
```
Expected value: "Token已过期"
Received array: ["token must be longer than or equal to 64 characters"]

Expected value: "Token无效"
Received array: ["token must be longer than or equal to 64 characters"]

Expected value: "密码长度至少8位"
Received array: ["token must be longer than or equal to 64 characters", "newPassword must be longer than or equal to 6 characters"]

Expected value: "密码必须包含大写字母"
Received array: ["token must be longer than or equal to 64 characters"]

Expected value: "密码必须包含小写字母"
Received array: ["token must be longer than or equal to 64 characters"]

Expected value: "密码必须包含数字"
Received array: ["token must be longer than or equal to 64 characters"]

Expected value: "Token是必填字段"
Received array: ["token must be shorter than or equal to 128 characters", "token must be longer than or equal to 64 characters", "token must be a string"]

Expected value: "新密码是必填字段"
Received array: ["token must be longer than or equal to 64 characters", "newPassword must be shorter than or equal to 20 characters", "newPassword must be longer than or equal to 6 characters", "newPassword must be a string"]
```

## 期望结果

**HTTP状态码**: `400 Bad Request` (保持不变)

**响应体**:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Token已过期",  // 中文错误消息
  "timestamp": "2026-04-02T11:00:00.000Z"
}
```

或

```json
{
  "success": false,
  "statusCode": 400,
  "message": "密码长度至少8位",  // 中文错误消息
  "timestamp": "2026-04-02T11:00:00.000Z"
}
```

**期望的错误消息（中文）**:
- "Token已过期"
- "Token无效"
- "密码长度至少8位"
- "密码必须包含大写字母"
- "密码必须包含小写字母"
- "密码必须包含数字"
- "Token是必填字段"
- "新密码是必填字段"

## 环境信息

- **测试时间**: 2026-04-02 19:00
- **测试环境**: prepare/v5.9分支
- **代码版本**: commit fa70a95
- **后端服务**: http://localhost:3001
- **测试账号**: admin@example.com / Admin123!

## 附加信息

**问题原因**:
- API使用class-validator进行参数验证
- class-validator默认返回英文错误消息
- 测试期望中文错误消息以匹配前端UI

**修复建议**:
1. 在class-validator装饰器中添加中文消息
2. 或使用自定义验证管道转换错误消息
3. 或在响应拦截器中统一转换错误消息

**修复示例**:
```typescript
// 方法1：使用class-validator的message选项
@IsString({ message: 'Token是必填字段' })
@IsLength(64, 128, { message: 'token长度必须在64-128字符之间' })
token: string;

// 方法2：自定义验证管道
@Injectable()
class ValidationPipe implements PipeTransform {
  transform(value: any) {
    // 转换英文错误消息为中文
  }
}
```

**相关测试文件**:
- `tests/integration/api/auth-module/reset-password.test.js` - 10个失败
- `tests/integration/api/auth-module/login.test.js` - 5个失败

**影响用户**:
- 所有使用中文界面的用户
- 用户体验下降，无法理解错误信息