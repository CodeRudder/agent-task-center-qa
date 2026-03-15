# API接口测试用例 - 任务管理

## 文档信息
- **模块**：任务管理API
- **用例数量**：30个
- **优先级分布**：P0: 12 | P1: 13 | P2: 5
- **更新日期**：2026-03-02
- **基础路径**：`/api/v1/tasks`

---

## 1. 创建任务 API (TC-API-TASK-001 ~ TC-API-TASK-006)

### TC-API-TASK-001: 创建任务 - 成功
```http
POST /api/v1/tasks
Content-Type: application/json
Authorization: Bearer {token}

{
  "title": "测试任务001",
  "description": "任务描述",
  "priority": "high",
  "dueDate": "2026-03-10T18:00:00Z",
  "assignees": ["agent-001"]
}
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-001 |
| **优先级** | P0 |
| **预期状态码** | 201 Created |
| **预期响应** | `{ "code": 201, "data": { "taskId": "xxx", "status": "todo", ... } }` |
| **验证点** | taskId生成、status为todo、createdAt记录 |

### TC-API-TASK-002: 创建任务 - 缺少必填项
```http
POST /api/v1/tasks
Content-Type: application/json
Authorization: Bearer {token}

{
  "description": "没有标题"
}
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-002 |
| **优先级** | P0 |
| **预期状态码** | 400 Bad Request |
| **预期响应** | `{ "code": 400, "message": "title is required" }` |
| **验证点** | 参数校验 |

### TC-API-TASK-003: 创建任务 - 未授权
```http
POST /api/v1/tasks
Content-Type: application/json

{
  "title": "测试任务"
}
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-003 |
| **优先级** | P0 |
| **预期状态码** | 401 Unauthorized |
| **预期响应** | `{ "code": 401, "message": "Unauthorized" }` |
| **验证点** | 认证校验 |

### TC-API-TASK-004: 创建任务 - 截止时间过期
```http
POST /api/v1/tasks
Content-Type: application/json
Authorization: Bearer {token}

{
  "title": "过期任务",
  "dueDate": "2020-01-01T00:00:00Z"
}
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-004 |
| **优先级** | P0 |
| **预期状态码** | 400 Bad Request |
| **预期响应** | `{ "code": 400, "message": "dueDate must be in the future" }` |
| **验证点** | 时间校验 |

### TC-API-TASK-005: 创建任务 - 标题超长
```http
POST /api/v1/tasks
Content-Type: application/json
Authorization: Bearer {token}

{
  "title": "256个字符的标题...",
  "dueDate": "2026-03-10T18:00:00Z"
}
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-005 |
| **优先级** | P1 |
| **预期状态码** | 400 Bad Request |
| **预期响应** | `{ "code": 400, "message": "title max length is 255" }` |
| **验证点** | 长度校验 |

### TC-API-TASK-006: 创建任务 - SQL注入
```http
POST /api/v1/tasks
Content-Type: application/json
Authorization: Bearer {token}

{
  "title": "'; DROP TABLE tasks; --",
  "dueDate": "2026-03-10T18:00:00Z"
}
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-006 |
| **优先级** | P0 |
| **预期状态码** | 201 Created（SQL被转义） |
| **验证点** | SQL注入被防御，标题原样存储 |

---

## 2. 查询任务 API (TC-API-TASK-007 ~ TC-API-TASK-012)

### TC-API-TASK-007: 获取任务列表
```http
GET /api/v1/tasks?page=1&pageSize=20
Authorization: Bearer {token}
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-007 |
| **优先级** | P0 |
| **预期状态码** | 200 OK |
| **预期响应** | `{ "code": 200, "data": { "items": [...], "total": 50, "page": 1 } }` |
| **验证点** | 分页、数据结构 |

### TC-API-TASK-008: 按状态筛选
```http
GET /api/v1/tasks?status=in_progress
Authorization: Bearer {token}
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-008 |
| **优先级** | P0 |
| **预期状态码** | 200 OK |
| **验证点** | 只返回进行中的任务 |

### TC-API-TASK-009: 多条件筛选
```http
GET /api/v1/tasks?status=in_progress&priority=high&assignee=agent-001
Authorization: Bearer {token}
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-009 |
| **优先级** | P1 |
| **预期状态码** | 200 OK |
| **验证点** | 多条件AND逻辑 |

### TC-API-TASK-010: 关键词搜索
```http
GET /api/v1/tasks?keyword=测试
Authorization: Bearer {token}
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-010 |
| **优先级** | P0 |
| **预期状态码** | 200 OK |
| **验证点** | 标题/描述包含关键词的任务 |

### TC-API-TASK-011: 排序
```http
GET /api/v1/tasks?sort=dueDate&order=asc
Authorization: Bearer {token}
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-011 |
| **优先级** | P1 |
| **预期状态码** | 200 OK |
| **验证点** | 按截止时间升序排列 |

### TC-API-TASK-012: 获取单个任务
```http
GET /api/v1/tasks/{taskId}
Authorization: Bearer {token}
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-012 |
| **优先级** | P0 |
| **预期状态码** | 200 OK |
| **验证点** | 返回完整任务信息 |

---

## 3. 更新任务 API (TC-API-TASK-013 ~ TC-API-TASK-018)

### TC-API-TASK-013: 更新任务进度
```http
PATCH /api/v1/tasks/{taskId}/progress
Content-Type: application/json
Authorization: Bearer {agent-token}

{
  "progress": 50
}
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-013 |
| **优先级** | P0 |
| **预期状态码** | 200 OK |
| **验证点** | progress更新、updatedAt更新 |

### TC-API-TASK-014: 更新任务状态
```http
PATCH /api/v1/tasks/{taskId}/status
Content-Type: application/json
Authorization: Bearer {agent-token}

{
  "status": "completed"
}
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-014 |
| **优先级** | P0 |
| **预期状态码** | 200 OK |
| **前置条件** | progress = 100 |
| **验证点** | 状态流转正确、通知触发 |

### TC-API-TASK-015: 非法状态流转
```http
PATCH /api/v1/tasks/{taskId}/status
Content-Type: application/json
Authorization: Bearer {agent-token}

{
  "status": "completed"
}
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-015 |
| **优先级** | P0 |
| **预期状态码** | 400 Bad Request |
| **前置条件** | 当前状态=todo, progress=0 |
| **预期响应** | `{ "code": 400, "message": "Invalid status transition" }` |

### TC-API-TASK-016: 验收任务
```http
POST /api/v1/tasks/{taskId}/accept
Content-Type: application/json
Authorization: Bearer {admin-token}

{
  "rating": 5,
  "comment": "完成得很好"
}
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-016 |
| **优先级** | P0 |
| **预期状态码** | 200 OK |
| **验证点** | 状态变为accepted、评分记录、通知发送 |

### TC-API-TASK-017: 驳回任务
```http
POST /api/v1/tasks/{taskId}/reject
Content-Type: application/json
Authorization: Bearer {admin-token}

{
  "reason": "需要补充文档"
}
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-017 |
| **优先级** | P0 |
| **预期状态码** | 200 OK |
| **验证点** | 状态变为in_progress、驳回原因记录 |

### TC-API-TASK-018: 越权更新
```http
PATCH /api/v1/tasks/{taskId}/progress
Content-Type: application/json
Authorization: Bearer {other-agent-token}

{
  "progress": 80
}
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-018 |
| **优先级** | P0 |
| **预期状态码** | 403 Forbidden |
| **验证点** | 非负责人无法更新 |

---

## 4. 删除任务 API (TC-API-TASK-019 ~ TC-API-TASK-021)

### TC-API-TASK-019: 删除任务
```http
DELETE /api/v1/tasks/{taskId}
Authorization: Bearer {admin-token}
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-019 |
| **优先级** | P0 |
| **预期状态码** | 200 OK |
| **验证点** | 任务移入回收站、软删除 |

### TC-API-TASK-020: Agent无权删除
```http
DELETE /api/v1/tasks/{taskId}
Authorization: Bearer {agent-token}
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-020 |
| **优先级** | P0 |
| **预期状态码** | 403 Forbidden |
| **验证点** | 权限控制 |

### TC-API-TASK-021: 删除不存在的任务
```http
DELETE /api/v1/tasks/non-existent-id
Authorization: Bearer {admin-token}
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-021 |
| **优先级** | P1 |
| **预期状态码** | 404 Not Found |

---

## 5. 评论API (TC-API-TASK-022 ~ TC-API-TASK-025)

### TC-API-TASK-022: 添加评论
```http
POST /api/v1/tasks/{taskId}/comments
Content-Type: application/json
Authorization: Bearer {token}

{
  "content": "这个任务有个问题...",
  "mentions": ["agent-002"]
}
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-022 |
| **优先级** | P1 |
| **预期状态码** | 201 Created |
| **验证点** | 评论创建、@提及通知 |

### TC-API-TASK-023: 获取评论列表
```http
GET /api/v1/tasks/{taskId}/comments
Authorization: Bearer {token}
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-023 |
| **优先级** | P1 |
| **预期状态码** | 200 OK |
| **验证点** | 按时间排序、包含用户信息 |

### TC-API-TASK-024: 删除评论
```http
DELETE /api/v1/tasks/{taskId}/comments/{commentId}
Authorization: Bearer {comment-author-token}
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-024 |
| **优先级** | P2 |
| **预期状态码** | 200 OK |
| **验证点** | 只能删除自己的评论 |

### TC-API-TASK-025: XSS攻击评论
```http
POST /api/v1/tasks/{taskId}/comments
Content-Type: application/json
Authorization: Bearer {token}

{
  "content": "<script>alert('xss')</script>"
}
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-025 |
| **优先级** | P0 |
| **预期状态码** | 201 Created |
| **验证点** | 脚本被转义，不执行 |

---

## 6. 附件API (TC-API-TASK-026 ~ TC-API-TASK-030)

### TC-API-TASK-026: 上传附件
```http
POST /api/v1/tasks/{taskId}/attachments
Content-Type: multipart/form-data
Authorization: Bearer {token}

file: test.pdf
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-026 |
| **优先级** | P1 |
| **预期状态码** | 201 Created |
| **验证点** | 文件存储、返回附件ID |

### TC-API-TASK-027: 下载附件
```http
GET /api/v1/tasks/{taskId}/attachments/{attachmentId}
Authorization: Bearer {token}
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-027 |
| **优先级** | P1 |
| **预期状态码** | 200 OK |
| **验证点** | 文件内容正确 |

### TC-API-TASK-028: 上传超大文件
```http
POST /api/v1/tasks/{taskId}/attachments
Content-Type: multipart/form-data
Authorization: Bearer {token}

file: 100MB.pdf
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-028 |
| **优先级** | P1 |
| **预期状态码** | 413 Payload Too Large |
| **验证点** | 文件大小限制（50MB） |

### TC-API-TASK-029: 上传非法文件类型
```http
POST /api/v1/tasks/{taskId}/attachments
Content-Type: multipart/form-data
Authorization: Bearer {token}

file: virus.exe
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-029 |
| **优先级** | P1 |
| **预期状态码** | 400 Bad Request |
| **验证点** | 文件类型白名单校验 |

### TC-API-TASK-030: 删除附件
```http
DELETE /api/v1/tasks/{taskId}/attachments/{attachmentId}
Authorization: Bearer {uploader-token}
```

| 项目 | 内容 |
|------|------|
| **用例ID** | TC-API-TASK-030 |
| **优先级** | P2 |
| **预期状态码** | 200 OK |
| **验证点** | 文件从存储中删除 |

---

## API响应码定义

| 状态码 | 含义 | 场景 |
|--------|------|------|
| 200 OK | 成功 | 查询、更新、删除成功 |
| 201 Created | 创建成功 | 创建任务、评论、附件 |
| 400 Bad Request | 请求错误 | 参数校验失败 |
| 401 Unauthorized | 未认证 | token缺失或无效 |
| 403 Forbidden | 无权限 | 越权操作 |
| 404 Not Found | 资源不存在 | 任务ID不存在 |
| 409 Conflict | 冲突 | 状态冲突、重复操作 |
| 413 Payload Too Large | 请求体过大 | 文件超出限制 |
| 500 Internal Server Error | 服务器错误 | 系统异常 |

---

## 测试用例统计

| 分类 | 数量 | P0 | P1 | P2 |
|------|------|----|----|-----|
| 创建任务 | 6 | 5 | 1 | 0 |
| 查询任务 | 6 | 4 | 2 | 0 |
| 更新任务 | 6 | 5 | 0 | 1 |
| 删除任务 | 3 | 2 | 1 | 0 |
| 评论 | 4 | 1 | 2 | 1 |
| 附件 | 5 | 0 | 4 | 1 |
| **合计** | **30** | **17** | **10** | **3** |

---

**文档状态**：已完成  
**下一步**：编写Jest测试配置  
**负责人**：qa  
**最后更新**：2026-03-02
