# TC-039: POST /api/v1/roles

## 测试信息
- **TC编号**：TC-039
- **API路径**：Unknown API
- **优先级**：🔴 P0
- **测试文件**：创建角色API集成测试

## 操作步骤
1. 登录系统获取认证token
2. 发送Unknown请求到 `API`
3. 添加Authorization header和必要的请求参数

## 输入数据/参数
### Headers
```
Authorization: Bearer <auth_token>
Content-Type: application/json
```

### Body
```json
{
  "test": "test_data"
}
```

## 实际结果
- **状态码**：500
- **错误类型**：500 Error
- **错误信息**：
```
Expected status 201, but received 500
```

## 期望结果
- **状态码**：201
- **响应体**：
```json
{
  "success": true,
  "data": {...}
}
```

## 影响范围
此BUG导致POST /api/v1/roles功能完全无法使用，严重影响用户体验和系统可用性。

## 修复建议
1. 检查后端API实现，确保正确处理请求参数
2. 完善错误处理机制，避免返回500错误
3. 修复数据验证逻辑，确保参数验证返回正确的400错误
4. 检查数据库连接和查询逻辑
5. 完善测试前置条件，确保测试数据正确初始化

## 详细错误日志
```
创建角色API集成测试 › POST /api/v1/roles › 正常场景 - 创建角色成功

    expect(received).toBe(expected) // Object.is equality

    Expected: 201
    Received: 500

      39 |         });
      40 |       
    > 41 |       expect(response.status).toBe(201);
         |                               ^
      42 |       expect(response.body).toHaveProperty('success', true);
      43 |       expect(response.body.data).toHaveProperty('name', '测试角色');
      44 |     });

      at Object.toBe (tests/integration/api/permis...
```

---
**报告生成时间**：2026-04-03T11:58:05.249Z
**测试版本**：V5.9
**测试时间**：2026-04-03 19:51
