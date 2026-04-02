# 验收任务01：P0模块验收

**任务ID**: AT-20260330-001
**创建日期**: 2026-03-30
**负责人**: @qa
**优先级**: 🔴 P0（最高优先级）
**截止时间**: 2026-03-30 18:00
**状态**: ⏳ 待执行

---

## 📋 任务概览

### 验收范围
- **模块数量**: 7个P0模块
- **Controller数量**: 约20个
- **API端点数量**: 约60个
- **验收环境**: TEST环境（端口4100）
- **验收标准**: 100%通过，不允许有P0缺陷

### 验收模块列表

| 序号 | 模块名称 | 优先级 | Controller数量 | API数量 | 负责人 |
|------|---------|--------|--------------|---------|--------|
| 1 | auth（认证） | P0 | 2 | 6 | @qa |
| 2 | user（用户） | P0 | 2 | 5 | @qa |
| 3 | task（任务） | P0 | 3 | 10+ | @qa |
| 4 | comment（评论） | P0 | 2 | 8 | @qa |
| 5 | notification（通知） | P0 | 2 | 5 | @qa |
| 6 | agent-api（Agent接口） | P0 | 3 | 8 | @qa |
| 7 | permission（权限） | P0 | 2 | 7 | @qa |

---

## 🎯 验收清单

### 1. 认证API（auth） - P0

**模块路径**: `backend/src/modules/auth`

#### API端点验收

- [ ] **POST /api/v1/auth/register**
  - [ ] 用户注册成功
  - [ ] 参数验证（邮箱格式、密码强度）
  - [ ] 重复邮箱提示
  - [ ] 返回token正确
  - [ ] 错误处理

- [ ] **POST /api/v1/auth/login**
  - [ ] 登录成功
  - [ ] 返回accessToken和refreshToken
  - [ ] 错误密码提示
  - [ ] 账号不存在提示
  - [ ] Token过期时间正确

- [ ] **POST /api/v1/auth/logout**
  - [ ] 登出成功
  - [ ] Token失效
  - [ ] 重定向正确

- [ ] **POST /api/v1/auth/refresh**
  - [ ] Token刷新成功
  - [ ] 新Token有效
  - [ ] 旧Token失效
  - [ ] 刷新Token过期处理

- [ ] **POST /api/v1/auth/verify** ⚠️（已知缺失）
  - [ ] Token验证
  - [ ] 返回用户信息
  - [ ] 过期Token处理
  - [ ] **状态**: ❌ API不存在（P0缺陷）

- [ ] **POST /api/v1/auth/forgot-password**
  - [ ] 发送重置邮件
  - [ ] 邮件格式正确
  - [ ] 链接有效
  - [ ] 过期处理

#### 验收标准
- **通过率**: 100%
- **响应时间**: < 500ms
- **安全性**: Token机制正确，无安全漏洞

---

### 2. 用户API（user） - P0

**模块路径**: `backend/src/modules/user`

#### API端点验收

- [ ] **GET /api/v1/users**
  - [ ] 用户列表返回正确
  - [ ] 分页功能正常
  - [ ] 筛选功能正常
  - [ ] 权限验证

- [ ] **GET /api/v1/users/:id**
  - [ ] 用户详情返回正确
  - [ ] 不存在用户处理
  - [ ] 权限验证

- [ ] **POST /api/v1/users**
  - [ ] 创建用户成功
  - [ ] 参数验证
  - [ ] 默认值设置
  - [ ] 返回用户信息

- [ ] **PUT /api/v1/users/:id**
  - [ ] 更新用户成功
  - [ ] 权限验证
  - [ ] 参数验证
  - [ ] 返回更新后的用户信息

- [ ] **DELETE /api/v1/users/:id**
  - [ ] 删除用户成功
  - [ ] 软删除验证
  - [ ] 权限验证
  - [ ] 关联数据处理

#### 验收标准
- **通过率**: 100%
- **响应时间**: < 500ms
- **权限控制**: RBAC正确实现

---

### 3. 任务API（task） - P0

**模块路径**: `backend/src/modules/task`

#### API端点验收

- [ ] **GET /api/v1/tasks**
  - [ ] 任务列表返回正确
  - [ ] 分页功能正常
  - [ ] 筛选功能（状态、优先级、负责人）
  - [ ] 排序功能
  - [ ] 搜索功能

- [ ] **GET /api/v1/tasks/:id**
  - [ ] 任务详情返回正确
  - [ ] 包含子任务
  - [ ] 包含依赖关系
  - [ ] 不存在任务处理

- [ ] **POST /api/v1/tasks**
  - [ ] 创建任务成功
  - [ ] 参数验证
  - [ ] 默认值设置
  - [ ] 返回任务信息

- [ ] **PUT /api/v1/tasks/:id**
  - [ ] 更新任务成功
  - [ ] 状态流转正确
  - [ ] 权限验证
  - [ ] 历史记录保存

- [ ] **DELETE /api/v1/tasks/:id**
  - [ ] 删除任务成功
  - [ ] 软删除验证
  - [ ] 关联数据处理

- [ ] **GET /api/v1/tasks/:id/subtasks**
  - [ ] 子任务列表返回正确

- [ ] **POST /api/v1/tasks/:id/subtasks**
  - [ ] 创建子任务成功
  - [ ] 父子关系正确

- [ ] **GET /api/v1/tasks/:id/dependencies**
  - [ ] 依赖关系列表返回正确

- [ ] **POST /api/v1/tasks/:id/dependencies**
  - [ ] 添加依赖成功
  - [ ] 循环依赖检测

- [ ] **PATCH /api/v1/tasks/:id/status**
  - [ ] 状态更新成功
  - [ ] 流转规则正确
  - [ ] 通知触发

#### 验收标准
- **通过率**: 100%
- **响应时间**: < 500ms
- **业务逻辑**: 状态流转、依赖关系正确

---

### 4. 评论API（comment） - P0（V5.7）

**模块路径**: `backend/src/modules/comment`

#### API端点验收

- [ ] **GET /api/v1/tasks/:taskId/comments**
  - [ ] 评论列表返回正确
  - [ ] 分页功能正常
  - [ ] 排序功能
  - [ ] 包含用户信息

- [ ] **POST /api/v1/tasks/:taskId/comments**
  - [ ] 创建评论成功
  - [ ] 参数验证（内容长度）
  - [ ] @提及处理
  - [ ] 通知触发

- [ ] **GET /api/v1/comments/:id**
  - [ ] 评论详情返回正确
  - [ ] 包含编辑历史

- [ ] **PATCH /api/v1/comments/:id** ⚠️（已知缺失）
  - [ ] 编辑评论成功
  - [ ] 权限验证（只能编辑自己的评论）
  - [ ] isEdited标记
  - [ ] 编辑历史记录
  - [ ] **状态**: ❌ API不存在（P0缺陷）

- [ ] **DELETE /api/v1/comments/:id** ⚠️（已知缺失）
  - [ ] 删除评论成功
  - [ ] 软删除验证
  - [ ] "该评论已被删除"占位符
  - [ ] 权限验证
  - [ ] **状态**: ❌ API不存在（P0缺陷）

- [ ] **POST /api/v1/comments/:id/reply**
  - [ ] 创建回复成功
  - [ ] parentId正确设置
  - [ ] 嵌套结构正确

- [ ] **GET /api/v1/comments/:id/history** ⚠️（已知缺失）
  - [ ] 编辑历史返回正确
  - [ ] 版本对比
  - [ ] **状态**: ❌ API不存在（P0缺陷）

- [ ] **POST /api/v1/comments/:id/mentions**
  - [ ] @提及处理正确
  - [ ] 通知发送

#### 验收标准
- **通过率**: 100%（当前: 37.5%）
- **已知缺陷**: 3个P0缺陷（编辑、删除、历史记录API缺失）
- **响应时间**: < 500ms

---

### 5. 通知API（notification） - P0

**模块路径**: `backend/src/modules/notification`

#### API端点验收

- [ ] **GET /api/v1/notifications**
  - [ ] 通知列表返回正确
  - [ ] 分页功能正常
  - [ ] 按类型筛选
  - [ ] 按已读状态筛选

- [ ] **GET /api/v1/notifications/:id**
  - [ ] 通知详情返回正确
  - [ ] 关联对象信息

- [ ] **POST /api/v1/notifications/:id/read**
  - [ ] 标记已读成功
  - [ ] 状态更新正确

- [ ] **POST /api/v1/notifications/read-all**
  - [ ] 全部标记已读成功

- [ ] **DELETE /api/v1/notifications/:id**
  - [ ] 删除通知成功

#### 验收标准
- **通过率**: 100%
- **响应时间**: < 500ms
- **实时性**: 通知及时推送

---

### 6. Agent API（agent-api） - P0

**模块路径**: `backend/src/modules/agent-api`

#### API端点验收

- [ ] **GET /api/v1/agent/tasks**
  - [ ] Agent任务列表返回正确
  - [ ] Token验证
  - [ ] 筛选功能

- [ ] **GET /api/v1/agent/tasks/:id**
  - [ ] Agent任务详情返回正确
  - [ ] 权限验证

- [ ] **POST /api/v1/agent/tasks/:id/start**
  - [ ] 启动任务成功
  - [ ] 状态更新正确

- [ ] **POST /api/v1/agent/tasks/:id/complete**
  - [ ] 完成任务成功
  - [ ] 状态更新正确
  - [ ] 结果保存

- [ ] **POST /api/v1/agent/tasks/:id/block**
  - [ ] 阻塞任务成功
  - [ ] 原因记录

- [ ] **POST /api/v1/agent/tasks/:id/unblock**
  - [ ] 解除阻塞成功

- [ ] **POST /api/v1/agent/tasks/:id/progress**
  - [ ] 更新进度成功
  - [ ] 进度百分比正确

- [ ] **GET /api/v1/agent/notifications**
  - [ ] Agent通知列表返回正确

#### 验收标准
- **通过率**: 100%
- **响应时间**: < 500ms
- **安全性**: Agent Token验证正确

---

### 7. 权限API（permission） - P0（V5.6）

**模块路径**: `backend/src/modules/permission`

#### API端点验收

- [ ] **GET /api/v1/permissions**
  - [ ] 权限列表返回正确
  - [ ] 分页功能正常

- [ ] **POST /api/v1/permissions**
  - [ ] 创建权限成功
  - [ ] 参数验证
  - [ ] 唯一性验证

- [ ] **PUT /api/v1/permissions/:id**
  - [ ] 更新权限成功
  - [ ] 权限验证

- [ ] **DELETE /api/v1/permissions/:id**
  - [ ] 删除权限成功
  - [ ] 关联检查

- [ ] **GET /api/v1/roles**
  - [ ] 角色列表返回正确

- [ ] **POST /api/v1/roles**
  - [ ] 创建角色成功
  - [ ] 权限关联正确

- [ ] **PUT /api/v1/roles/:id**
  - [ ] 更新角色成功
  - [ ] 权限更新正确

- [ ] **DELETE /api/v1/roles/:id**
  - [ ] 删除角色成功
  - [ ] 用户关联处理

#### 验收标准
- **通过率**: 100%
- **响应时间**: < 500ms
- **RBAC**: 角色权限控制正确

---

## 📊 验收统计

### 预期统计
- **总API数量**: 约60个
- **总测试用例**: 约200个
- **预计耗时**: 4-6小时
- **预计Token消耗**: 50K-100K tokens

### 验收标准
- **P0 API通过率**: 100%（必须）
- **响应时间**: < 500ms
- **P0缺陷数量**: 0个（允许有已知缺陷：3个）

---

## 🚨 已知缺陷

### P0级缺陷（已确认）

| 缺陷ID | 模块 | API | 问题描述 | 状态 |
|--------|------|-----|---------|------|
| BUG-001 | comment | PATCH /api/v1/comments/:id | 编辑评论API不存在 | ❌ 未修复 |
| BUG-002 | comment | DELETE /api/v1/comments/:id | 删除评论API不存在 | ❌ 未修复 |
| BUG-003 | comment | GET /api/v1/comments/:id/history | 评论历史记录API不存在 | ❌ 未修复 |
| BUG-004 | auth | POST /api/v1/auth/verify | Token验证API不存在 | ❌ 未修复 |

---

## 📝 执行计划

### 阶段1：环境准备（30分钟）
- [ ] 确认TEST环境运行正常
- [ ] 准备测试数据
- [ ] 获取测试账号Token
- [ ] 配置测试工具

### 阶段2：API验收（3-4小时）
- [ ] 认证API验收（30分钟）
- [ ] 用户API验收（30分钟）
- [ ] 任务API验收（45分钟）
- [ ] 评论API验收（30分钟）
- [ ] 通知API验收（30分钟）
- [ ] Agent API验收（30分钟）
- [ ] 权限API验收（30分钟）

### 阶段3：报告生成（30分钟）
- [ ] 汇总测试结果
- [ ] 记录缺陷
- [ ] 生成验收报告
- [ ] 发送到验收群

---

## 📋 验收报告模板

验收完成后，需要生成验收报告，包含以下内容：
1. **执行摘要**：总体通过率、关键发现
2. **详细结果**：每个API的测试结果
3. **缺陷列表**：发现的缺陷详情
4. **性能数据**：响应时间统计
5. **建议**：改进建议

---

## 📞 联系方式

**负责人**: @qa
**审核人**: @product
**协调人**: @project-manager

---

**创建人**: Claw修理者
**创建时间**: 2026-03-30 08:51
**更新时间**: 2026-03-30 08:51
**状态**: ⏳ 待执行
