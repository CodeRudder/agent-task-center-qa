# TC-P0-008: 密码找回功能API不存在

## 缺陷信息
- **缺陷ID**: DEFECT-P0-001
- **测试用例**: TC-P0-008
- **缺陷标题**: 密码找回功能API不存在
- **严重程度**: P0（致命）
- **优先级**: P0（必须修复）
- **发现时间**: 2026-04-01 19:40
- **测试人员**: @qa
- **开发负责人**: @fullstack-dev

## 操作步骤
1. 打开终端或Postman
2. 使用curl发送POST请求到密码找回API
3. 请求URL: `POST http://localhost:3000/api/v1/auth/forgot-password`
4. 请求方法: POST
5. 请求头: `Content-Type: application/json`

## 输入数据/参数
**请求URL**: 
```
POST http://localhost:3000/api/v1/auth/forgot-password
```

**请求头**:
```json
{
  "Content-Type": "application/json"
}
```

**请求体**:
```json
{
  "email": "admin@example.com"
}
```

**完整curl命令**:
```bash
curl -X POST http://localhost:3000/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com"}'
```

## 实际结果
**HTTP状态码**: 404 Not Found

**响应体**:
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Cannot POST /api/v1/auth/forgot-password",
  "timestamp": "2026-04-01T11:40:09.577Z"
}
```

**完整响应**:
```json
{"success":false,"statusCode":404,"message":"Cannot POST /api/v1/auth/forgot-password","timestamp":"2026-04-01T11:40:09.577Z"}
HTTP_CODE:404
```

**错误原因**: API路由不存在，服务器返回404错误

## 期望结果
**期望HTTP状态码**: 200 OK 或 201 Created

**期望响应体**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "密码重置邮件已发送",
  "data": {
    "email": "admin@example.com",
    "message": "如果该邮箱存在，密码重置链接已发送到您的邮箱"
  }
}
```

**期望行为**:
1. 服务器接收密码找回请求
2. 验证邮箱格式是否正确
3. 检查邮箱是否存在于数据库中
4. 生成密码重置Token
5. 发送密码重置邮件到用户邮箱
6. 返回成功响应

## 影响范围
- **影响功能**: P0-004 密码找回（邮箱验证）
- **影响用户**: 所有忘记密码的用户
- **业务影响**: 用户无法通过邮箱找回密码，必须联系管理员重置密码
- **PRD要求**: 根据V5.8 PRD文档，P0-004是必须完成的功能

## 验证步骤
**验证API不存在的其他尝试**:
1. 尝试访问 `/api/v1/auth/reset-password` - 404 Not Found
2. 尝试访问 `/api/v1/auth/forgot` - 404 Not Found
3. 尝试访问 `/api/v1/auth/recover` - 404 Not Found
4. 检查Swagger API文档 - 未找到密码找回相关API

## 需要实现的API
根据V5.8技术方案文档和PRD文档，需要实现以下API：

1. **发送密码重置邮件**
   - 路径: `POST /api/v1/auth/forgot-password`
   - 请求体: `{"email": "user@example.com"}`
   - 响应: 成功发送密码重置邮件

2. **重置密码**
   - 路径: `POST /api/v1/auth/reset-password`
   - 请求体: `{"token": "reset_token", "password": "new_password"}`
   - 响应: 成功重置密码

## 技术要求
根据V5.8技术方案文档：
- **重置链接有效期**: 1小时
- **重置链接使用次数**: 一次性使用
- **新密码规则**: 最少8位，包含字母和数字
- **邮件服务**: SMTP服务已配置

## 测试环境
- **前端URL**: http://localhost:4100
- **后端URL**: http://localhost:3000/api
- **数据库**: PostgreSQL 15.x
- **邮件服务**: SMTP（已配置）

## 附件
- **V5.8 PRD文档**: `/home/gongdewei/.openclaw/workspace-product/docs/prd/v5.8-prd.md`
- **V5.8技术方案**: `/home/gongdewei/workspace/team-docs/architecture/v5.8-technical-design.md`
- **验收测试计划**: `/home/gongdewei/.openclaw/workspace-qa/test-plans/v5.8-login-acceptance-test-plan.md`

## 修复建议
1. 实现 `POST /api/v1/auth/forgot-password` API
2. 实现 `POST /api/v1/auth/reset-password` API
3. 配置邮件发送服务
4. 实现密码重置Token生成和验证
5. 实现Token过期机制（1小时）
6. 实现Token一次性使用机制
7. 添加新密码规则验证

## 验收标准
修复后需要满足以下验收标准：
- ✅ 密码找回API存在且可访问
- ✅ 发送密码重置邮件成功
- ✅ 重置链接有效期正确（1小时）
- ✅ 重置链接一次性使用正确
- ✅ 新密码规则验证正确
- ✅ P0级用例TC-P0-008通过
- ✅ 相关的P0级用例TC-P0-009至TC-P0-012通过

---
*BUG报告生成时间: 2026-04-01 19:55*
*报告生成人: @qa*
*报告版本: v1.0*
