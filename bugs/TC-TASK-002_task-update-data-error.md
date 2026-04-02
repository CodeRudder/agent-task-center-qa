# TC-TASK-002: 更新任务API数据访问错误

## 操作步骤
1. 先调用POST /api/v1/tasks创建任务
2. 从响应中获取任务ID
3. 调用PUT /api/v1/tasks/:id更新任务
4. 发送HTTP PUT请求

## 输入数据/参数
### 创建任务
```json
{
  "title": "原任务标题",
  "description": "原任务描述"
}
```

### 更新任务
```json
{
  "title": "更新后的任务标题",
  "description": "更新后的任务描述"
}
```

## 实际结果
- **HTTP状态码**: 500 Internal Server Error（创建任务失败）
- **错误类型**: TypeError: Cannot read properties of undefined (reading 'id')
- **错误原因**: 创建任务API返回500，导致response.body.data为undefined

## 期望结果
- **创建任务**: 201 Created，返回任务ID
- **更新任务**: 200 OK，返回更新后的任务信息

## 严重程度
🔴 P0（致命）- 无法更新任务，核心功能不可用

## 根本原因
创建任务API失败（TC-TASK-001），导致后续更新任务测试无法执行。

## 环境
- **测试时间**: 2026-04-02 11:00
- **API地址**: http://localhost:3000
- **认证**: Bearer Token
