# BUG报告: TC-V5.9-005

## 基本信息
- **BUG ID**: TC-V5.9-005
- **发现时间**: 2026-04-05 22:42
- **测试轮次**: 第12轮
- **严重程度**: P2 (一般)
- **优先级**: P2
- **状态**: 待修复

## 问题描述
更新任务API在接收到无效的UUID格式时，返回的验证错误消息与测试期望不一致。API返回"Validation failed (uuid is expected)"，测试期望"Task not found"。

## 测试环境
- **测试文件**: `tests/integration/api/task-module/update-task.test.js`
- **测试端点**: PUT /api/v1/tasks/:id
- **测试时间**: 2026-04-05 22:42
- **API_BASE_URL**: http://localhost:3001

## 复现步骤

### 测试用例: 异常场景 - 任务不存在

**输入数据**:
```json
{
  "title": "Updated Task Title",
  "description": "Updated description"
}
```

**任务ID**: `invalid-uuid-format` (无效的UUID格式)

**请求**:
```bash
PUT /api/v1/tasks/invalid-uuid-format
Headers: {
  "Authorization": "Bearer <valid_token>"
}
Body: {
  "title": "Updated Task Title",
  "description": "Updated description"
}
```

**实际结果**:
```json
{
  "status": 400,
  "body": {
    "success": false,
    "message": "Validation failed (uuid is expected)"
  }
}
```

**期望结果**:
```json
{
  "status": 404,
  "body": {
    "success": false,
    "message": "Task not found"
  }
}
```

**错误信息**:
```
expect(received).toContain(expected) // indexOf

Expected substring: "Task not found"
Received string:    "Validation failed (uuid is expected)"

  > 101 |      expect(response.body.message).toContain('Task not found');
       |                                     ^
```

### 测试用例: 边界条件 - 标题为空

**输入数据**:
```json
{
  "title": "",
  "description": "Valid description"
}
```

**请求**:
```bash
PUT /api/v1/tasks/<valid_task_id>
Headers: {
  "Authorization": "Bearer <valid_token>"
}
Body: {
  "title": "",
  "description": "Valid description"
}
```

**实际结果**:
```json
{
  "status": 400,
  "body": {
    "success": false,
    "message": "title should not be empty"
  }
}
```

**期望结果**:
```json
{
  "status": 400,
  "body": {
    "success": false,
    "message": "标题不能为空"
  }
}
```

**错误信息**:
```
expect(received).toContain(expected) // indexOf

Expected substring: "标题不能为空"
Received string:    "title should not be empty"

  > 132 |      expect(response.body.message).toContain('标题不能为空');
       |                                     ^
```

## 根本原因分析

**问题1: 验证逻辑顺序问题**
API在路由层（UUID验证）先进行参数验证，而不是在业务层（任务查询）处理。这导致：

1. 无效UUID格式返回400状态码（验证错误）
2. 测试期望404状态码（资源不存在）

**问题2: 错误消息语言不统一**
- API返回英文错误消息："title should not be empty"
- 测试期望中文错误消息："标题不能为空"

**问题3: 验证层级设计**
API使用参数验证中间件（如class-validator），在路由层就拦截了无效的UUID，无法到达业务逻辑判断任务是否存在。

## 影响范围

**受影响的测试用例**:
- 异常场景 - 任务不存在
- 边界条件 - 标题为空

**影响的功能**:
- 任务更新功能的用户体验
- API错误消息的一致性
- 前端错误处理逻辑

## 修复建议

**方案1: 修改API验证逻辑（推荐）**

将UUID验证从路由层移到业务层：

```typescript
// 当前实现（路由层验证）
@Put(':id')
@UseParamValidators({
  id: { type: 'uuid' }
})
async updateTask(@Param('id') id: string, @Body() updateDto: UpdateTaskDto) {
  // 业务逻辑
}

// 建议实现（业务层验证）
@Put(':id')
async updateTask(@Param('id') id: string, @Body() updateDto: UpdateTaskDto) {
  // 先检查任务是否存在
  const task = await this.taskRepository.findById(id);
  if (!task) {
    throw new NotFoundException('Task not found');
  }

  // 业务逻辑
  return await this.taskRepository.update(id, updateDto);
}
```

**方案2: 修改测试用例（如果API行为正确）**

如果API当前的验证逻辑是正确的（路由层验证是合理的），则测试用例应该改为：

```javascript
test('异常场景 - 任务不存在（无效UUID格式）', async () => {
  const response = await request(app)
    .put('/api/v1/tasks/invalid-uuid-format')
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      title: 'Updated Task Title',
      description: 'Updated description'
    });

  // 验证错误（400）而不是未找到（404）
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('success', false);
  expect(response.body.message).toContain('uuid');
});

test('异常场景 - 任务不存在（有效UUID但不存在）', async () => {
  const nonExistentId = '00000000-0000-0000-0000-000000000000';
  const response = await request(app)
    .put(`/api/v1/tasks/${nonExistentId}`)
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      title: 'Updated Task Title'
    });

  // 此时应该返回404
  expect(response.status).toBe(404);
  expect(response.body.message).toContain('Task not found');
});
```

**方案3: 统一错误消息语言**

在API中添加错误消息翻译层：

```typescript
// 错误消息配置
const ERROR_MESSAGES = {
  TASK_TITLE_EMPTY: '标题不能为空',
  TASK_NOT_FOUND: '任务不存在',
  INVALID_UUID: '无效的任务ID格式'
};

// 在验证器中使用
@IsNotEmpty({ message: ERROR_MESSAGES.TASK_TITLE_EMPTY })
title: string;
```

## 验收标准

- ✅ 无效UUID格式返回400状态码，消息包含"uuid"或"无效格式"
- ✅ 有效UUID但任务不存在返回404状态码，消息为"Task not found"或"任务不存在"
- ✅ 所有错误消息使用统一的语言（中文或英文）
- ✅ 验证逻辑顺序合理：先验证格式，再验证存在性

## 附件

**测试日志**:
```
● 更新任务API集成测试 › PUT /api/v1/tasks/:id › 异常场景 - 任务不存在

    expect(received).toContain(expected) // indexOf

    Expected substring: "Task not found"
    Received string:    "Validation failed (uuid is expected)"

      99 |       expect(response.status).toBe(400);
     100 |       expect(response.body).toHaveProperty('success', false);
    > 101 |      expect(response.body.message).toContain('Task not found');
         |                                     ^

  ● 更新任务API集成测试 › PUT /api/v1/tasks/:id › 边界条件 - 标题为空

    expect(received).toContain(expected) // indexOf

    Expected substring: "标题不能为空"
    Received string:    "title should not be empty"

     130 |      expect(response.status).toBe(400);
     131 |      expect(response.body).toHaveProperty('success', false);
    > 132 |      expect(response.body.message).toContain('标题不能为空');
         |                                     ^
```

**报告生成时间**: 2026-04-05 22:42
