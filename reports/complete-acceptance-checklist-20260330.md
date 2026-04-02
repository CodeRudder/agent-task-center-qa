# 完整验收清单（V5.7+版本）

**创建日期**: 2026-03-30
**负责人**: @qa
**审核人**: @product
**优先级**: 🔴 P0（高优先级）
**状态**: ⏳ 待验收

---

## 📋 验收概览

### 验收范围
- **前端页面**: 5个主要页面 + 子功能
- **后端API**: 16个模块，32个controller
- **验收环境**: TEST环境（端口4100）
- **验收标准**: 所有P0功能必须通过

### 验收状态
- ✅ 已完成: V5.7评论功能部分验收（2026-03-29）
- ❌ 未完成: 完整页面和API验收

---

## 🎨 前端页面验收清单

### 1. 登录页 (P0 - 必须)

**路由**: `/login`

#### 功能点
- [ ] **登录功能**
  - [ ] 正常登录（正确账号密码）
  - [ ] 错误密码提示
  - [ ] 账号不存在提示
  - [ ] 表单验证（空值、格式）
  - [ ] 记住我功能
  - [ ] Token存储

- [ ] **UI/UX**
  - [ ] 页面布局正确
  - [ ] 输入框交互正常
  - [ ] 按钮状态反馈
  - [ ] 错误提示显示
  - [ ] 响应式布局

- [ ] **API集成**
  - [ ] POST /api/v1/auth/login
  - [ ] 返回token正确
  - [ ] 登录失败处理

### 2. 仪表盘/首页 (P0 - 必须)

**路由**: `/dashboard`

#### 功能点

##### 2.1 任务列表视图 (P0 - 必须)

- [ ] **任务表格展示**
  - [ ] 表格列显示正确（标题、状态、负责人、优先级、截止时间）
  - [ ] 任务数据正确加载
  - [ ] 空状态提示正确显示
  - [ ] 加载状态正确显示
  - [ ] 任务数量统计显示

- [ ] **任务筛选功能**
  - [ ] 按状态筛选（pending、in_progress、completed、blocked）
  - [ ] 按优先级筛选（P0、P1、P2、P3）
  - [ ] 按负责人筛选
  - [ ] 按项目筛选
  - [ ] 按标签筛选
  - [ ] 按日期范围筛选
  - [ ] 多条件组合筛选
  - [ ] 筛选条件清空功能

- [ ] **任务搜索功能**
  - [ ] 关键字搜索（标题、描述）
  - [ ] 实时搜索建议
  - [ ] 搜索结果高亮
  - [ ] 搜索无结果提示
  - [ ] 搜索历史记录

- [ ] **任务排序功能**
  - [ ] 按创建时间排序（升序/降序）
  - [ ] 按更新时间排序（升序/降序）
  - [ ] 按优先级排序
  - [ ] 按截止时间排序
  - [ ] 按标题排序
  - [ ] 排序方向切换

- [ ] **任务分页功能**
  - [ ] 分页组件显示正确
  - [ ] 每页条数选择（10/20/50/100）
  - [ ] 页码跳转功能
  - [ ] 首页/末页跳转
  - [ ] 总数显示正确
  - [ ] 当前页码高亮

- [ ] **任务创建功能**
  - [ ] 创建任务按钮显示
  - [ ] 创建任务表单正确
  - [ ] 必填字段验证
  - [ ] 表单提交成功
  - [ ] 创建后列表刷新
  - [ ] 错误提示正确

- [ ] **任务批量操作**
  - [ ] 任务多选功能
  - [ ] 全选/取消全选
  - [ ] 批量修改状态
  - [ ] 批量修改负责人
  - [ ] 批量修改优先级
  - [ ] 批量删除
  - [ ] 批量操作确认提示

- [ ] **任务状态切换**
  - [ ] 状态切换按钮显示
  - [ ] 状态切换成功
  - [ ] 状态历史记录
  - [ ] 状态切换权限控制
  - [ ] 列表实时更新

- [ ] **任务详情跳转**
  - [ ] 点击任务跳转到详情页
  - [ ] 新窗口打开选项
  - [ ] 返回列表页位置保持
  - [ ] 浏览器前进/后退正确

##### 2.2 任务状态统计 (P1)

- [ ] **统计数据展示**
  - [ ] 总任务数统计
  - [ ] 各状态任务数统计
  - [ ] 已完成任务数统计
  - [ ] 进行中任务数统计
  - [ ] 待处理任务数统计
  - [ ] 阻塞任务数统计
  - [ ] 统计数据实时更新

##### 2.3 看板视图 (P1)

- [ ] **看板布局**
  - [ ] 看板列布局正确（按状态分列）
  - [ ] 任务卡片显示正确
  - [ ] 任务数量显示
  - [ ] 列宽度自适应

- [ ] **拖拽功能**
  - [ ] 任务卡片可拖拽
  - [ ] 拖拽视觉反馈
  - [ ] 拖拽位置提示
  - [ ] 拖拽取消功能

- [ ] **状态流转**
  - [ ] 拖拽后状态更新
  - [ ] 状态流转规则正确
  - [ ] 流转记录保存
  - [ ] 权限验证

- [ ] **实时更新**
  - [ ] WebSocket连接正常
  - [ ] 任务更新实时推送
  - [ ] 多用户同步更新
  - [ ] 断线重连机制

- [ ] **UI/UX**
  - [ ] 页面布局正确
  - [ ] 数据加载状态
  - [ ] 空状态提示
  - [ ] 响应式布局

- [ ] **API集成**
  - [ ] GET /api/v1/tasks
  - [ ] GET /api/v1/statistics
  - [ ] WebSocket连接

### 3. 任务详情页 (P0 - 必须)

**路由**: `/tasks/:id`

#### 功能点
- [ ] **任务信息展示**
  - [ ] 基本信息（标题、描述、状态）
  - [ ] 任务元数据（创建时间、更新时间）
  - [ ] 负责人信息
  - [ ] 任务标签
  - [ ] 任务分类

- [ ] **子任务功能**
  - [ ] 子任务列表
  - [ ] 创建子任务
  - [ ] 编辑子任务
  - [ ] 删除子任务
  - [ ] 子任务状态切换

- [ ] **评论功能（V5.7）**
  - [ ] 评论列表
  - [ ] 创建评论
  - [ ] 编辑评论
  - [ ] 删除评论
  - [ ] @提及用户
  - [ ] 评论回复
  - [ ] 评论历史

- [ ] **任务依赖**
  - [ ] 依赖关系展示
  - [ ] 添加依赖
  - [ ] 删除依赖
  - [ ] 依赖状态检查

- [ ] **进度跟踪**
  - [ ] 进度百分比
  - [ ] 进度更新
  - [ ] 进度历史

- [ ] **UI/UX**
  - [ ] 页面布局正确
  - [ ] 信息展示完整
  - [ ] 交互反馈及时
  - [ ] 响应式布局

- [ ] **API集成**
  - [ ] GET /api/v1/tasks/:id
  - [ ] PUT /api/v1/tasks/:id
  - [ ] GET /api/v1/tasks/:id/subtasks
  - [ ] POST /api/v1/tasks/:id/subtasks
  - [ ] GET /api/v1/tasks/:id/comments
  - [ ] POST /api/v1/tasks/:id/comments
  - [ ] PATCH /api/v1/comments/:id
  - [ ] DELETE /api/v1/comments/:id

### 4. 任务模板页 (P1 - 重要)

**路由**: `/templates`

#### 功能点
- [ ] **模板列表**
  - [ ] 模板展示
  - [ ] 模板筛选
  - [ ] 模板搜索

- [ ] **模板管理**
  - [ ] 创建模板
  - [ ] 编辑模板
  - [ ] 删除模板
  - [ ] 使用模板创建任务

- [ ] **UI/UX**
  - [ ] 页面布局正确
  - [ ] 模板卡片展示
  - [ ] 响应式布局

- [ ] **API集成**
  - [ ] GET /api/v1/templates
  - [ ] POST /api/v1/templates
  - [ ] PUT /api/v1/templates/:id
  - [ ] DELETE /api/v1/templates/:id

### 5. 用户管理页 (P0 - V5.6必须)

**路由**: `/users`

#### 功能点
- [ ] **用户列表**
  - [ ] 用户展示
  - [ ] 用户筛选
  - [ ] 用户搜索

- [ ] **用户管理**
  - [ ] 创建用户
  - [ ] 编辑用户
  - [ ] 删除用户
  - [ ] 角色分配
  - [ ] 权限设置

- [ ] **RBAC权限（V5.6）**
  - [ ] 角色管理
  - [ ] 权限分配
  - [ ] 权限验证
  - [ ] 访问控制

- [ ] **UI/UX**
  - [ ] 页面布局正确
  - [ ] 用户卡片展示
  - [ ] 响应式布局

- [ ] **API集成**
  - [ ] GET /api/v1/users
  - [ ] POST /api/v1/users
  - [ ] PUT /api/v1/users/:id
  - [ ] DELETE /api/v1/users/:id
  - [ ] GET /api/v1/permissions
  - [ ] POST /api/v1/permissions
  - [ ] PUT /api/v1/permissions/:id

---

## 🔌 后端API验收清单

### 1. 认证API (auth) - P0

**模块**: auth
**Controller**: verify.controller.ts

#### API端点
- [ ] **POST /api/v1/auth/login**
  - [ ] 正常登录
  - [ ] 错误密码
  - [ ] 账号不存在
  - [ ] 参数验证

- [ ] **POST /api/v1/auth/verify**
  - [ ] Token验证
  - [ ] Token过期处理

- [ ] **POST /api/v1/auth/logout**
  - [ ] 登出功能
  - [ ] Token清除

### 2. 用户API (user) - P0

**模块**: user

#### API端点
- [ ] **GET /api/v1/users**
  - [ ] 用户列表
  - [ ] 分页功能
  - [ ] 筛选功能

- [ ] **GET /api/v1/users/:id**
  - [ ] 用户详情
  - [ ] 权限验证

- [ ] **POST /api/v1/users**
  - [ ] 创建用户
  - [ ] 参数验证
  - [ ] 唯一性检查

- [ ] **PUT /api/v1/users/:id**
  - [ ] 更新用户
  - [ ] 权限验证

- [ ] **DELETE /api/v1/users/:id**
  - [ ] 删除用户
  - [ ] 权限验证
  - [ ] 关联数据处理

### 3. 任务API (task) - P0

**模块**: task
**Controllers**: task.controller.ts, subtask.controller.ts, task-dependency.controller.ts

#### API端点
- [ ] **GET /api/v1/tasks**
  - [ ] 任务列表
  - [ ] 分页功能
  - [ ] 筛选功能
  - [ ] 排序功能

- [ ] **GET /api/v1/tasks/:id**
  - [ ] 任务详情
  - [ ] 关联数据加载

- [ ] **POST /api/v1/tasks**
  - [ ] 创建任务
  - [ ] 参数验证
  - [ ] 默认值设置

- [ ] **PUT /api/v1/tasks/:id**
  - [ ] 更新任务
  - [ ] 权限验证
  - [ ] 状态流转

- [ ] **DELETE /api/v1/tasks/:id**
  - [ ] 删除任务
  - [ ] 软删除
  - [ ] 关联数据处理

- [ ] **GET /api/v1/tasks/:id/subtasks**
  - [ ] 子任务列表

- [ ] **POST /api/v1/tasks/:id/subtasks**
  - [ ] 创建子任务

- [ ] **GET /api/v1/tasks/:id/dependencies**
  - [ ] 依赖关系列表

- [ ] **POST /api/v1/tasks/:id/dependencies**
  - [ ] 添加依赖

### 4. 评论API (comment) - P0 (V5.7)

**模块**: comment
**Controller**: comment.controller.ts, agent-comments.controller.ts

#### API端点
- [ ] **GET /api/v1/tasks/:taskId/comments**
  - [ ] 评论列表
  - [ ] 分页功能
  - [ ] 排序功能

- [ ] **POST /api/v1/tasks/:taskId/comments**
  - [ ] 创建评论
  - [ ] 参数验证
  - [ ] @提及处理

- [ ] **PATCH /api/v1/comments/:id** ❌ V5.7未通过
  - [ ] 编辑评论
  - [ ] 权限验证
  - [ ] 编辑历史记录

- [ ] **DELETE /api/v1/comments/:id** ❌ V5.7未通过
  - [ ] 删除评论
  - [ ] 软删除
  - [ ] 权限验证

- [ ] **GET /api/v1/comments/:id/history** ❌ V5.7未通过
  - [ ] 评论历史
  - [ ] 版本对比

### 5. 通知API (notification) - P0

**模块**: notification
**Controller**: notification.controller.ts, agent-notifications.controller.ts

#### API端点
- [ ] **GET /api/v1/notifications**
  - [ ] 通知列表
  - [ ] 未读筛选
  - [ ] 类型筛选

- [ ] **POST /api/v1/notifications/:id/read**
  - [ ] 标记已读

- [ ] **POST /api/v1/notifications/read-all**
  - [ ] 全部标记已读

- [ ] **DELETE /api/v1/notifications/:id**
  - [ ] 删除通知

### 6. 模板API (templates) - P1

**模块**: templates
**Controller**: templates.controller.ts

#### API端点
- [ ] **GET /api/v1/templates**
  - [ ] 模板列表
  - [ ] 筛选功能

- [ ] **GET /api/v1/templates/:id**
  - [ ] 模板详情

- [ ] **POST /api/v1/templates**
  - [ ] 创建模板
  - [ ] 参数验证

- [ ] **PUT /api/v1/templates/:id**
  - [ ] 更新模板

- [ ] **DELETE /api/v1/templates/:id**
  - [ ] 删除模板

### 7. Agent API (agent-api) - P0

**模块**: agent-api
**Controllers**: agent-tasks.controller.ts, agent-comments.controller.ts, agent-notifications.controller.ts

#### API端点
- [ ] **GET /api/v1/agent/tasks**
  - [ ] Agent任务列表
  - [ ] Token验证

- [ ] **POST /api/v1/agent/tasks/:id/start**
  - [ ] 开始任务

- [ ] **POST /api/v1/agent/tasks/:id/complete**
  - [ ] 完成任务

- [ ] **POST /api/v1/agent/tasks/:id/progress**
  - [ ] 更新进度

- [ ] **POST /api/v1/agent/tasks/:id/block**
  - [ ] 阻塞任务

- [ ] **POST /api/v1/agent/tasks/:id/unblock**
  - [ ] 解除阻塞

### 8. Agent管理API (agents) - P1

**模块**: agents
**Controllers**: agents.controller.ts, admin-revoke-token.controller.ts, admin-regenerate-token.controller.ts

#### API端点
- [ ] **GET /api/v1/agents**
  - [ ] Agent列表

- [ ] **POST /api/v1/agents**
  - [ ] 创建Agent
  - [ ] Token生成

- [ ] **PUT /api/v1/agents/:id**
  - [ ] 更新Agent

- [ ] **DELETE /api/v1/agents/:id**
  - [ ] 删除Agent

- [ ] **POST /api/v1/admin/agents/:id/regenerate-token**
  - [ ] 重新生成Token

- [ ] **POST /api/v1/admin/agents/:id/revoke-token**
  - [ ] 撤销Token

### 9. 权限API (permission) - P0 (V5.6)

**模块**: permission

#### API端点
- [ ] **GET /api/v1/permissions**
  - [ ] 权限列表

- [ ] **POST /api/v1/permissions**
  - [ ] 创建权限

- [ ] **PUT /api/v1/permissions/:id**
  - [ ] 更新权限

- [ ] **DELETE /api/v1/permissions/:id**
  - [ ] 删除权限

- [ ] **GET /api/v1/roles**
  - [ ] 角色列表

- [ ] **POST /api/v1/roles**
  - [ ] 创建角色

- [ ] **PUT /api/v1/roles/:id**
  - [ ] 更新角色

- [ ] **DELETE /api/v1/roles/:id**
  - [ ] 删除角色

### 10. 项目API (project) - P1

**模块**: project

#### API端点
- [ ] **GET /api/v1/projects**
  - [ ] 项目列表

- [ ] **GET /api/v1/projects/:id**
  - [ ] 项目详情

- [ ] **POST /api/v1/projects**
  - [ ] 创建项目

- [ ] **PUT /api/v1/projects/:id**
  - [ ] 更新项目

- [ ] **DELETE /api/v1/projects/:id**
  - [ ] 删除项目

### 11. 分类API (category) - P1

**模块**: category

#### API端点
- [ ] **GET /api/v1/categories**
  - [ ] 分类列表

- [ ] **POST /api/v1/categories**
  - [ ] 创建分类

- [ ] **PUT /api/v1/categories/:id**
  - [ ] 更新分类

- [ ] **DELETE /api/v1/categories/:id**
  - [ ] 删除分类

### 12. 标签API (tag) - P1

**模块**: tag

#### API端点
- [ ] **GET /api/v1/tags**
  - [ ] 标签列表

- [ ] **POST /api/v1/tags**
  - [ ] 创建标签

- [ ] **PUT /api/v1/tags/:id**
  - [ ] 更新标签

- [ ] **DELETE /api/v1/tags/:id**
  - [ ] 删除标签

### 13. 统计API (statistics) - P1

**模块**: statistics

#### API端点
- [ ] **GET /api/v1/statistics**
  - [ ] 统计数据

- [ ] **GET /api/v1/statistics/tasks**
  - [ ] 任务统计

- [ ] **GET /api/v1/statistics/users**
  - [ ] 用户统计

### 14. 实时通信API (realtime) - P1

**模块**: realtime

#### 功能
- [ ] **WebSocket连接**
  - [ ] 连接建立
  - [ ] 心跳检测
  - [ ] 断线重连

- [ ] **实时推送**
  - [ ] 任务更新推送
  - [ ] 通知推送
  - [ ] 评论推送

### 15. 投票API (vote) - P2

**模块**: vote

#### API端点
- [ ] **GET /api/v1/votes**
  - [ ] 投票列表

- [ ] **POST /api/v1/votes**
  - [ ] 创建投票

- [ ] **POST /api/v1/votes/:id/vote**
  - [ ] 参与投票

### 16. 管理员API (admin) - P1

**模块**: admin

#### API端点
- [ ] **GET /api/v1/admin/users**
  - [ ] 用户管理

- [ ] **GET /api/v1/admin/system**
  - [ ] 系统信息

- [ ] **POST /api/v1/admin/settings**
  - [ ] 系统设置

---

## 📊 验收统计

### 页面统计
- 总页面数：5个
- P0页面：4个（登录、仪表盘、任务详情、用户管理）
- P1页面：1个（模板）

### API统计
- 总模块数：16个
- 总Controller数：32个
- P0模块：8个（auth、user、task、comment、notification、agent-api、permission）
- P1模块：6个（templates、agents、project、category、tag、statistics、realtime、admin）
- P2模块：1个（vote）

---

## 🚨 已知问题

### V5.7验收未通过问题
1. ❌ **P0-001**: 编辑评论API不存在
2. ❌ **P0-002**: 删除评论API不存在
3. ❌ **P0-003**: 评论历史记录API不存在

---

## 📝 验收执行记录

### 验收进度
- ⏳ 待开始：完整验收

### 验收结果
- 待填写

---

## 📋 验收标准

### P0功能验收标准
- 所有P0功能必须100%通过
- 不允许有P0级缺陷
- API响应时间 < 500ms
- 错误处理正确

### P1功能验收标准
- P1功能通过率 ≥ 90%
- P1级缺陷 ≤ 2个
- 功能基本可用

### P2功能验收标准
- P2功能通过率 ≥ 80%
- 功能可用

---

## 🎯 下一步行动

1. **@qa**: 按照此清单执行完整验收
2. **@product**: 确认验收标准和优先级
3. **@fullstack-dev**: 修复V5.7未通过的P0缺陷

---

**创建人**: Claw修理者
**创建时间**: 2026-03-30 08:34
**更新时间**: 2026-03-30 08:34
**状态**: ⏳ 待验收
