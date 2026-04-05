# UI测试用例文档（V5.9）

**文档版本**：v1.0  
**创建时间**：2026-04-05 23:34 GMT+8  
**创建人**：QA Engineer  
**测试环境**：PROD环境（http://localhost:5100）  
**前端源码路径**：~/work/projects/dev-working-group/agent-task-center/ops/frontend/src/

---

## 📋 测试用例目录

### P0 - 核心业务流程（必须覆盖）
- [1. LoginPage - 登录页面](#1-loginpage---登录页面)
- [2. TaskListPage - 任务列表页面](#2-tasklistpage---任务列表页面)
- [3. TaskDetail - 任务详情页面](#3-taskdetail---任务详情页面)
- [4. TaskCreateModal - 创建任务模态框](#4-taskcreatemodal---创建任务模态框)
- [5. TaskEditModal - 编辑任务模态框](#5-taskeditmodal---编辑任务模态框)

### P1 - 重要功能（必须覆盖）
- [6. AgentList - Agent列表页面](#6-agentlist---agent列表页面)
- [7. AgentDetail - Agent详情页面](#7-agentdetail---agent详情页面)
- [8. AgentCreate - 创建Agent页面](#8-agentcreate---创建agent页面)
- [9. TokenManagementPage - Token管理页面](#9-tokenmanagementpage---token管理页面)
- [10. Dashboard - 仪表盘页面](#10-dashboard---仪表盘页面)

### P2 - 辅助功能（按需覆盖）
- [11. SubTaskManagement - 子任务管理页面](#11-subtaskmanagement---子任务管理页面)
- [12. TaskDependencies - 任务依赖管理页面](#12-taskdependencies---任务依赖管理页面)
- [13. TaskTemplates - 任务模板页面](#13-tasktemplates---任务模板页面)
- [14. AgentLoadSummary - Agent负载汇总页面](#14-agentloadsummary---agent负载汇总页面)
- [15. AgentPerformanceRanking - Agent性能排名页面](#15-agentperformanceranking---agent性能排名页面)

### 未实现页面
- [16. 未实现页面清单](#16-未实现页面清单)

---

## P0 - 核心业务流程

## 1. LoginPage - 登录页面

**页面文件**：`pages/LoginPage.tsx`  
**路由**：`/login`  
**优先级**：P0

---

### TC-LOGIN-001 - 正常登录（邮箱+密码）

**用例ID**：TC-LOGIN-001  
**测试目标**：验证用户使用邮箱和密码能正常登录系统  
**前置条件**：
- 已注册用户账号
- 测试账号：admin@example.com / admin123

**测试步骤**：
1. 访问登录页面（http://localhost:5100/login）
2. 输入用户名：admin@example.com
3. 输入密码：admin123
4. 点击"登录"按钮
5. 等待系统响应

**预期结果**：
- ✅ 登录成功
- ✅ 显示成功提示："登录成功"
- ✅ 自动跳转到首页（/）
- ✅ 用户信息存储到localStorage（如果选择"记住我"）

**API验证**：
```bash
curl -X POST http://localhost:5100/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

**优先级**：P0

---

### TC-LOGIN-002 - 记住我功能

**用例ID**：TC-LOGIN-002  
**测试目标**：验证"记住我"功能正常工作  
**前置条件**：
- 已注册用户账号

**测试步骤**：
1. 访问登录页面
2. 输入用户名和密码
3. 勾选"记住我（7天内免登录）"复选框
4. 点击"登录"按钮
5. 登录成功后，关闭浏览器
6. 重新打开浏览器访问系统

**预期结果**：
- ✅ 勾选"记住我"后，7天内无需重新登录
- ✅ Token持久化存储（localStorage或cookie）
- ✅ 自动保持登录状态

**API验证**：
```bash
# 检查login接口返回的token有效期
# 应包含refreshToken或expiresIn字段
```

**优先级**：P0

---

### TC-LOGIN-003 - 表单验证（空字段）

**用例ID**：TC-LOGIN-003  
**测试目标**：验证登录表单的必填字段验证  
**前置条件**：
- 已打开登录页面

**测试步骤**：
1. 不输入用户名，直接点击"登录"
2. 检查是否显示验证提示
3. 输入用户名，不输入密码，点击"登录"
4. 检查是否显示验证提示

**预期结果**：
- ✅ 用户名为空时，显示"请输入用户名和密码"警告
- ✅ 密码为空时，显示"请输入用户名和密码"警告
- ✅ 不发送登录请求

**优先级**：P0

---

### TC-LOGIN-004 - 登录失败（错误凭证）

**用例ID**：TC-LOGIN-004  
**测试目标**：验证错误凭证的登录处理  
**前置条件**：
- 已打开登录页面

**测试步骤**：
1. 输入错误的用户名或密码
2. 点击"登录"按钮
3. 检查错误提示

**预期结果**：
- ✅ 显示"登录失败"提示
- ✅ 显示登录错误组件（LoginError）
- ✅ 显示剩余登录尝试次数
- ✅ 不跳转页面

**API验证**：
```bash
curl -X POST http://localhost:5100/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wrong@example.com",
    "password": "wrongpassword"
  }'

# 预期返回：401 Unauthorized
```

**优先级**：P0

---

### TC-LOGIN-005 - 账户锁定机制

**用例ID**：TC-LOGIN-005  
**测试目标**：验证多次登录失败后的账户锁定机制  
**前置条件**：
- 已打开登录页面

**测试步骤**：
1. 连续5次输入错误密码
2. 检查第5次失败后的提示
3. 尝试再次登录

**预期结果**：
- ✅ 第5次失败后，账户被锁定
- ✅ 显示"账户已锁定"提示
- ✅ 显示锁定时长
- ✅ 登录按钮被禁用
- ✅ 显示"忘记密码"链接

**优先级**：P0

---

### TC-LOGIN-006 - 忘记密码功能

**用例ID**：TC-LOGIN-006  
**测试目标**：验证"忘记密码"功能入口  
**前置条件**：
- 已打开登录页面

**测试步骤**：
1. 点击"忘记密码？"链接
2. 检查页面跳转

**预期结果**：
- ✅ 跳转到 `/forgot-password` 页面
- ✅ 或显示密码重置模态框（取决于实现）

**优先级**：P1

---

## 2. TaskListPage - 任务列表页面

**页面文件**：`pages/TaskListPage.tsx`  
**路由**：`/` 或 `/tasks`  
**优先级**：P0

---

### TC-TASKLIST-001 - 任务列表展示

**用例ID**：TC-TASKLIST-001  
**测试目标**：验证任务列表能正确显示所有任务  
**前置条件**：
- 用户已登录
- 系统中存在测试任务

**测试步骤**：
1. 登录系统
2. 访问任务列表页面
3. 等待页面加载完成
4. 检查任务列表显示

**预期结果**：
- ✅ 任务列表成功加载
- ✅ 每个任务显示：标题、状态、优先级、负责人、截止日期、创建时间
- ✅ 任务标签显示（前2个+剩余数量）
- ✅ 分页信息正确显示

**API验证**：
```bash
curl -X GET http://localhost:5100/api/v1/tasks \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

**优先级**：P0

---

### TC-TASKLIST-002 - 搜索任务

**用例ID**：TC-TASKLIST-002  
**测试目标**：验证任务搜索功能  
**前置条件**：
- 任务列表页面已加载

**测试步骤**：
1. 在搜索框输入关键词
2. 等待300ms（防抖）
3. 检查搜索结果

**预期结果**：
- ✅ 搜索结果匹配关键词（标题、描述）
- ✅ 搜索框带搜索图标
- ✅ 搜索结果实时更新

**API验证**：
```bash
curl -X GET "http://localhost:5100/api/v1/tasks?search=测试任务" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

**优先级**：P0

---

### TC-TASKLIST-003 - 状态筛选

**用例ID**：TC-TASKLIST-003  
**测试目标**：验证按状态筛选任务  
**前置条件**：
- 任务列表页面已加载

**测试步骤**：
1. 点击状态筛选下拉框
2. 选择"待办"（todo）
3. 检查筛选结果
4. 选择"进行中"（in_progress）
5. 检查筛选结果
6. 选择"所有状态"

**预期结果**：
- ✅ 筛选选项：所有状态、待办、进行中、已完成、审核中
- ✅ 筛选后只显示对应状态的任务
- ✅ 状态标签正确显示（带颜色）

**API验证**：
```bash
curl -X GET "http://localhost:5100/api/v1/tasks?status=in_progress" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

**优先级**：P0

---

### TC-TASKLIST-004 - 优先级筛选

**用例ID**：TC-TASKLIST-004  
**测试目标**：验证按优先级筛选任务  
**前置条件**：
- 任务列表页面已加载

**测试步骤**：
1. 点击优先级筛选下拉框
2. 选择"高"（high）
3. 检查筛选结果
4. 选择"紧急"（urgent）
5. 检查筛选结果

**预期结果**：
- ✅ 筛选选项：所有优先级、低、中、高、紧急
- ✅ 筛选后只显示对应优先级的任务
- ✅ 优先级标签正确显示（带颜色）

**API验证**：
```bash
curl -X GET "http://localhost:5100/api/v1/tasks?priority=high" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

**优先级**：P0

---

### TC-TASKLIST-005 - 任务排序

**用例ID**：TC-TASKLIST-005  
**测试目标**：验证任务排序功能  
**前置条件**：
- 任务列表页面已加载

**测试步骤**：
1. 点击表格列标题"标题"
2. 检查排序结果
3. 再次点击"标题"
4. 检查排序方向切换
5. 点击"截止日期"
6. 检查排序结果
7. 点击"创建时间"
8. 检查排序结果

**预期结果**：
- ✅ 首次点击升序排序（↑）
- ✅ 再次点击降序排序（↓）
- ✅ 排序指示器显示正确
- ✅ 任务列表按指定字段排序

**API验证**：
```bash
curl -X GET "http://localhost:5100/api/v1/tasks?sortBy=title&sortOrder=asc" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

**优先级**：P0

---

### TC-TASKLIST-006 - 分页功能

**用例ID**：TC-TASKLIST-006  
**测试目标**：验证分页功能  
**前置条件**：
- 任务列表页面已加载
- 任务总数超过单页显示数量

**测试步骤**：
1. 检查分页信息显示
2. 点击"下一页"按钮
3. 检查任务列表更新
4. 点击"上一页"按钮
5. 检查任务列表更新

**预期结果**：
- ✅ 显示"共 X 条记录，第 Y / Z 页"
- ✅ 第一页时"上一页"按钮禁用
- ✅ 最后一页时"下一页"按钮禁用
- ✅ 分页后任务列表正确更新

**API验证**：
```bash
curl -X GET "http://localhost:5100/api/v1/tasks?page=2&limit=10" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

**优先级**：P0

---

### TC-TASKLIST-007 - 创建任务入口

**用例ID**：TC-TASKLIST-007  
**测试目标**：验证创建任务入口和模态框  
**前置条件**：
- 用户已登录

**测试步骤**：
1. 点击"新建任务"按钮
2. 检查模态框显示

**预期结果**：
- ✅ "新建任务"按钮可见且可点击
- ✅ 点击后显示创建任务模态框
- ✅ 模态框标题为"新建任务"
- ✅ 模态框大小为lg（大）

**优先级**：P0

---

### TC-TASKLIST-008 - 任务选择（单选）

**用例ID**：TC-TASKLIST-008  
**测试目标**：验证任务单选功能  
**前置条件**：
- 任务列表页面已加载

**测试步骤**：
1. 点击某个任务的复选框
2. 检查复选框状态
3. 点击另一个任务的复选框
4. 检查复选框状态

**预期结果**：
- ✅ 可以单独选择任务
- ✅ 复选框状态正确更新
- ✅ 已选任务数量显示

**优先级**：P0

---

### TC-TASKLIST-009 - 任务选择（全选）

**用例ID**：TC-TASKLIST-009  
**测试目标**：验证任务全选功能  
**前置条件**：
- 任务列表页面已加载

**测试步骤**：
1. 点击表头的全选复选框
2. 检查所有任务复选框状态
3. 再次点击全选复选框
4. 检查所有任务复选框状态

**预期结果**：
- ✅ 全选后，所有任务复选框被勾选
- ✅ 取消全选后，所有任务复选框被取消
- ✅ 批量操作按钮显示（删除、归档）

**优先级**：P0

---

### TC-TASKLIST-010 - 批量删除任务

**用例ID**：TC-TASKLIST-010  
**测试目标**：验证批量删除任务功能  
**前置条件**：
- 已选择多个任务

**测试步骤**：
1. 选择多个任务
2. 点击"删除 (X)"按钮
3. 检查删除确认弹窗
4. 确认删除
5. 检查任务列表

**预期结果**：
- ✅ 显示删除确认弹窗
- ✅ 弹窗显示"确认批量删除"
- ✅ 弹窗显示删除数量
- ✅ 确认后，任务被删除
- ✅ 任务列表刷新

**API验证**：
```bash
curl -X DELETE http://localhost:5100/api/v1/tasks/batch \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "taskIds": ["id1", "id2", "id3"]
  }'
```

**优先级**：P0

---

### TC-TASKLIST-011 - 批量归档任务

**用例ID**：TC-TASKLIST-011  
**测试目标**：验证批量归档任务功能  
**前置条件**：
- 已选择多个任务

**测试步骤**：
1. 选择多个任务
2. 点击"归档 (X)"按钮
3. 检查归档确认弹窗
4. 确认归档
5. 检查任务列表

**预期结果**：
- ✅ 显示归档确认弹窗
- ✅ 弹窗显示"确认批量归档"
- ✅ 弹窗显示归档数量
- ✅ 确认后，任务被归档
- ✅ 任务列表刷新

**优先级**：P0

---

### TC-TASKLIST-012 - 查看任务详情

**用例ID**：TC-TASKLIST-012  
**测试目标**：验证查看任务详情功能  
**前置条件**：
- 任务列表页面已加载

**测试步骤**：
1. 点击某个任务行（非操作按钮）
2. 检查页面跳转

**预期结果**：
- ✅ 跳转到任务详情页面
- ✅ URL格式：`/tasks/{taskId}`

**优先级**：P0

---

### TC-TASKLIST-013 - 编辑任务

**用例ID**：TC-TASKLIST-013  
**测试目标**：验证编辑任务入口  
**前置条件**：
- 任务列表页面已加载

**测试步骤**：
1. 点击某个任务的编辑按钮
2. 检查编辑模态框

**预期结果**：
- ✅ 显示编辑任务模态框
- ✅ 模态框标题为"编辑任务"
- ✅ 表单预填充当前任务数据

**优先级**：P0

---

### TC-TASKLIST-014 - 删除单个任务

**用例ID**：TC-TASKLIST-014  
**测试目标**：验证删除单个任务功能  
**前置条件**：
- 任务列表页面已加载

**测试步骤**：
1. 点击某个任务的删除按钮
2. 检查删除确认弹窗
3. 确认删除
4. 检查任务列表

**预期结果**：
- ✅ 显示删除确认弹窗
- ✅ 弹窗显示任务标题和ID
- ✅ 确认后，任务被删除
- ✅ 任务列表刷新

**API验证**：
```bash
curl -X DELETE "http://localhost:5100/api/v1/tasks/{TASK_ID}" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

**优先级**：P0

---

### TC-TASKLIST-015 - 响应式布局（移动端）

**用例ID**：TC-TASKLIST-015  
**测试目标**：验证移动端卡片视图  
**前置条件**：
- 使用移动设备或调整浏览器宽度

**测试步骤**：
1. 调整浏览器宽度到移动端尺寸（<768px）
2. 检查任务列表显示

**预期结果**：
- ✅ 表格视图切换为卡片视图
- ✅ 每个任务显示为卡片
- ✅ 卡片包含：标题、状态、优先级、描述摘要、负责人、截止日期
- ✅ 复选框和操作按钮保持可用

**优先级**：P1

---

## 3. TaskDetail - 任务详情页面

**页面文件**：`pages/TaskDetail/index.tsx`  
**路由**：`/tasks/:id`  
**优先级**：P0

---

### TC-TASKDETAIL-001 - 任务基本信息显示

**用例ID**：TC-TASKDETAIL-001  
**测试目标**：验证任务详情页面正确显示任务信息  
**前置条件**：
- 用户已登录
- 已创建测试任务

**测试步骤**：
1. 从任务列表点击某个任务
2. 等待详情页面加载
3. 检查任务详情显示

**预期结果**：
- ✅ 任务标题显示
- ✅ 任务描述显示
- ✅ 任务状态显示（带颜色标签）
- ✅ 任务优先级显示（带颜色标签）
- ✅ 任务进度显示（百分比+进度条）
- ✅ 创建时间显示
- ✅ 更新时间显示
- ✅ 负责人显示

**API验证**：
```bash
curl -X GET "http://localhost:5100/api/v1/tasks/{TASK_ID}" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

**优先级**：P0

---

### TC-TASKDETAIL-002 - 任务进度更新

**用例ID**：TC-TASKDETAIL-002  
**测试目标**：验证任务进度更新功能  
**前置条件**：
- 已打开任务详情页面

**测试步骤**：
1. 找到进度更新控件
2. 拖动进度条或输入进度值
3. 保存更新
4. 检查进度显示

**预期结果**：
- ✅ 进度可以更新（0-100%）
- ✅ 进度条视觉更新
- ✅ 进度百分比显示正确
- ✅ 更新时间刷新

**API验证**：
```bash
curl -X PATCH "http://localhost:5100/api/v1/tasks/{TASK_ID}/progress" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"progress": 50}'
```

**优先级**：P0

---

### TC-TASKDETAIL-003 - 任务验收（通过）

**用例ID**：TC-TASKDETAIL-003  
**测试目标**：验证任务验收通过功能  
**前置条件**：
- 已打开任务详情页面
- 任务状态为"待验收"（review）

**测试步骤**：
1. 在评论框输入验收意见
2. 点击"通过"或"验收"按钮
3. 检查任务状态更新

**预期结果**：
- ✅ 验收意见输入框可用
- ✅ 点击"通过"后，任务状态变为"已验收"（accepted）
- ✅ 显示"验收成功"提示
- ✅ 自动返回任务列表

**API验证**：
```bash
curl -X POST "http://localhost:5100/api/v1/tasks/{TASK_ID}/accept" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "验收通过，质量不错"
  }'
```

**优先级**：P0

---

### TC-TASKDETAIL-004 - 任务驳回

**用例ID**：TC-TASKDETAIL-004  
**测试目标**：验证任务驳回功能  
**前置条件**：
- 已打开任务详情页面
- 任务状态为"待验收"（review）

**测试步骤**：
1. 在评论框输入驳回原因
2. 点击"驳回"按钮
3. 检查任务状态更新

**预期结果**：
- ✅ 驳回原因输入框可用
- ✅ 点击"驳回"后，任务状态变为"已驳回"（rejected）
- ✅ 显示"已驳回"提示
- ✅ 自动返回任务列表

**API验证**：
```bash
curl -X POST "http://localhost:5100/api/v1/tasks/{TASK_ID}/reject" \
  -H "Authorization: Bearer <ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "comment": "需要修改XXX部分"
  }'
```

**优先级**：P0

---

### TC-TASKDETAIL-005 - 返回列表

**用例ID**：TC-TASKDETAIL-005  
**测试目标**：验证返回列表功能  
**前置条件**：
- 已打开任务详情页面

**测试步骤**：
1. 点击"返回"或"返回列表"按钮
2. 检查页面跳转

**预期结果**：
- ✅ 返回到任务列表页面
- ✅ URL为 `/tasks` 或 `/`

**优先级**：P0

---

### TC-TASKDETAIL-006 - 任务加载失败处理

**用例ID**：TC-TASKDETAIL-006  
**测试目标**：验证任务加载失败的处理  
**前置条件**：
- 用户已登录

**测试步骤**：
1. 访问一个不存在的任务ID（如 /tasks/999999）
2. 检查错误处理

**预期结果**：
- ✅ 显示"加载任务失败"错误提示
- ✅ 自动返回任务列表页面
- ✅ 不显示空白页面

**优先级**：P1

---

## 4. TaskCreateModal - 创建任务模态框

**组件文件**：`components/TaskCreateModal.tsx`（推测）  
**触发入口**：任务列表页"新建任务"按钮  
**优先级**：P0

---

### TC-TASKCREATE-001 - 打开创建模态框

**用例ID**：TC-TASKCREATE-001  
**测试目标**：验证创建任务模态框能正确打开  
**前置条件**：
- 用户已登录
- 在任务列表页面

**测试步骤**：
1. 点击"新建任务"按钮
2. 检查模态框显示

**预期结果**：
- ✅ 模态框打开
- ✅ 模态框标题为"新建任务"
- ✅ 表单字段为空
- ✅ 背景遮罩显示

**优先级**：P0

---

### TC-TASKCREATE-002 - 任务标题输入

**用例ID**：TC-TASKCREATE-002  
**测试目标**：验证任务标题输入功能  
**前置条件**：
- 创建任务模态框已打开

**测试步骤**：
1. 在任务标题输入框输入文本
2. 检查输入显示

**预期结果**：
- ✅ 输入框可用
- ✅ 输入内容正确显示
- ✅ 支持中文、英文、数字

**优先级**：P0

---

### TC-TASKCREATE-003 - 任务描述输入

**用例ID**：TC-TASKCREATE-003  
**测试目标**：验证任务描述输入功能  
**前置条件**：
- 创建任务模态框已打开

**测试步骤**：
1. 在任务描述输入框输入长文本
2. 检查输入显示

**预期结果**：
- ✅ 描述输入框可用（多行文本框）
- ✅ 支持长文本输入
- ✅ 支持换行

**优先级**：P0

---

### TC-TASKCREATE-004 - 优先级选择

**用例ID**：TC-TASKCREATE-004  
**测试目标**：验证任务优先级选择  
**前置条件**：
- 创建任务模态框已打开

**测试步骤**：
1. 点击优先级下拉框
2. 选择"高"（high）
3. 选择"紧急"（urgent）
4. 检查选择结果

**预期结果**：
- ✅ 优先级选项：低、中、高、紧急
- ✅ 默认选中"中"
- ✅ 选择后正确显示

**优先级**：P0

---

### TC-TASKCREATE-005 - 状态选择

**用例ID**：TC-TASKCREATE-005  
**测试目标**：验证任务状态选择  
**前置条件**：
- 创建任务模态框已打开

**测试步骤**：
1. 点击状态下拉框
2. 选择"待办"（todo）
3. 选择"进行中"（in_progress）
4. 检查选择结果

**预期结果**：
- ✅ 状态选项：待办、进行中、已完成、审核中
- ✅ 默认选中"待办"
- ✅ 选择后正确显示

**优先级**：P0

---

### TC-TASKCREATE-006 - 分配人选择

**用例ID**：TC-TASKCREATE-006  
**测试目标**：验证分配人选择功能  
**前置条件**：
- 创建任务模态框已打开
- 系统中存在可用用户

**测试步骤**：
1. 点击分配人下拉框
2. 搜索或选择用户
3. 检查选择结果

**预期结果**：
- ✅ 分配人下拉框显示可用用户列表
- ✅ 支持搜索用户
- ✅ 可以不选择（可选字段）
- ✅ 选择后显示用户名

**优先级**：P0

---

### TC-TASKCREATE-007 - 截止日期选择

**用例ID**：TC-TASKCREATE-007  
**测试目标**：验证截止日期选择功能  
**前置条件**：
- 创建任务模态框已打开

**测试步骤**：
1. 点击截止日期输入框
2. 选择日期
3. 检查选择结果

**预期结果**：
- ✅ 日期选择器弹出
- ✅ 可以选择日期
- ✅ 可以不选择（可选字段）
- ✅ 选择后日期格式正确显示

**优先级**：P0

---

### TC-TASKCREATE-008 - 任务标签输入

**用例ID**：TC-TASKCREATE-008  
**测试目标**：验证任务标签输入功能  
**前置条件**：
- 创建任务模态框已打开

**测试步骤**：
1. 在标签输入框输入标签
2. 按Enter或点击添加
3. 输入多个标签
4. 检查标签显示

**预期结果**：
- ✅ 标签输入框可用
- ✅ 支持添加多个标签
- ✅ 标签显示为pill样式
- ✅ 可以删除已添加的标签

**优先级**：P0

---

### TC-TASKCREATE-009 - 表单验证（必填字段）

**用例ID**：TC-TASKCREATE-009  
**测试目标**：验证表单必填字段验证  
**前置条件**：
- 创建任务模态框已打开

**测试步骤**：
1. 不输入任务标题
2. 点击"提交"或"创建"按钮
3. 检查验证提示

**预期结果**：
- ✅ 显示"请输入任务标题"提示
- ✅ 不提交表单
- ✅ 标题输入框高亮显示错误

**优先级**：P0

---

### TC-TASKCREATE-010 - 提交创建

**用例ID**：TC-TASKCREATE-010  
**测试目标**：验证任务创建提交  
**前置条件**：
- 创建任务模态框已打开
- 已填写必填字段

**测试步骤**：
1. 填写任务标题
2. 填写任务描述
3. 选择优先级和状态
4. 点击"提交"或"创建"按钮
5. 等待创建完成
6. 检查任务列表

**预期结果**：
- ✅ 显示"创建中..."加载状态
- ✅ 创建成功后，模态框关闭
- ✅ 任务列表刷新
- ✅ 新任务出现在列表中
- ✅ 显示"创建成功"提示

**API验证**：
```bash
curl -X POST http://localhost:5100/api/v1/tasks \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "测试任务",
    "description": "测试任务描述",
    "priority": "medium",
    "status": "todo",
    "assigneeId": "user123",
    "dueDate": "2026-04-10",
    "tags": ["前端", "测试"]
  }'
```

**优先级**：P0

---

### TC-TASKCREATE-011 - 取消创建

**用例ID**：TC-TASKCREATE-011  
**测试目标**：验证取消创建功能  
**前置条件**：
- 创建任务模态框已打开
- 已填写部分表单

**测试步骤**：
1. 点击"取消"按钮或关闭模态框
2. 检查模态框关闭

**预期结果**：
- ✅ 模态框关闭
- ✅ 不创建任务
- ✅ 不显示错误提示
- ✅ 表单数据不保存

**优先级**：P0

---

### TC-TASKCREATE-012 - 创建失败处理

**用例ID**：TC-TASKCREATE-012  
**测试目标**：验证创建失败的处理  
**前置条件**：
- 创建任务模态框已打开
- 后端API返回错误

**测试步骤**：
1. 填写表单
2. 提交创建（模拟API失败）
3. 检查错误处理

**预期结果**：
- ✅ 显示"创建失败"错误提示
- ✅ 模态框保持打开
- ✅ 表单数据保留
- ✅ 可以重新提交

**优先级**：P1

---

## 5. TaskEditModal - 编辑任务模态框

**组件文件**：`components/TaskEditModal.tsx`（推测）  
**触发入口**：任务列表页编辑按钮  
**优先级**：P0

---

### TC-TASKEDIT-001 - 打开编辑模态框

**用例ID**：TC-TASKEDIT-001  
**测试目标**：验证编辑任务模态框能正确打开  
**前置条件**：
- 用户已登录
- 在任务列表页面

**测试步骤**：
1. 点击某个任务的编辑按钮
2. 检查模态框显示

**预期结果**：
- ✅ 模态框打开
- ✅ 模态框标题为"编辑任务"
- ✅ 表单预填充当前任务数据
- ✅ 所有字段显示当前值

**优先级**：P0

---

### TC-TASKEDIT-002 - 更新任务标题

**用例ID**：TC-TASKEDIT-002  
**测试目标**：验证更新任务标题功能  
**前置条件**：
- 编辑任务模态框已打开

**测试步骤**：
1. 修改任务标题
2. 点击"保存"或"更新"按钮
3. 等待更新完成
4. 检查任务列表

**预期结果**：
- ✅ 显示"更新中..."加载状态
- ✅ 更新成功后，模态框关闭
- ✅ 任务列表刷新
- ✅ 任务标题已更新
- ✅ 显示"更新成功"提示

**API验证**：
```bash
curl -X PATCH "http://localhost:5100/api/v1/tasks/{TASK_ID}" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "更新后的任务标题"
  }'
```

**优先级**：P0

---

### TC-TASKEDIT-003 - 修改任务状态

**用例ID**：TC-TASKEDIT-003  
**测试目标**：验证修改任务状态功能  
**前置条件**：
- 编辑任务模态框已打开

**测试步骤**：
1. 修改任务状态（如从"待办"改为"进行中"）
2. 点击"保存"
3. 检查任务列表

**预期结果**：
- ✅ 状态可以修改
- ✅ 保存后状态标签正确更新
- ✅ 状态颜色正确显示

**API验证**：
```bash
curl -X PATCH "http://localhost:5100/api/v1/tasks/{TASK_ID}" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress"
  }'
```

**优先级**：P0

---

### TC-TASKEDIT-004 - 重新分配任务

**用例ID**：TC-TASKEDIT-004  
**测试目标**：验证重新分配任务功能  
**前置条件**：
- 编辑任务模态框已打开

**测试步骤**：
1. 修改分配人
2. 点击"保存"
3. 检查任务列表

**预期结果**：
- ✅ 可以更改分配人
- ✅ 保存后负责人名称更新
- ✅ 新分配人收到通知（如支持）

**API验证**：
```bash
curl -X PATCH "http://localhost:5100/api/v1/tasks/{TASK_ID}" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "assigneeId": "new-user-id"
  }'
```

**优先级**：P0

---

### TC-TASKEDIT-005 - 表单验证

**用例ID**：TC-TASKEDIT-005  
**测试目标**：验证编辑表单验证  
**前置条件**：
- 编辑任务模态框已打开

**测试步骤**：
1. 清空任务标题
2. 点击"保存"
3. 检查验证提示

**预期结果**：
- ✅ 显示"请输入任务标题"提示
- ✅ 不提交表单
- ✅ 标题输入框高亮显示错误

**优先级**：P0

---

### TC-TASKEDIT-006 - 取消编辑

**用例ID**：TC-TASKEDIT-006  
**测试目标**：验证取消编辑功能  
**前置条件**：
- 编辑任务模态框已打开
- 已修改部分字段

**测试步骤**：
1. 修改任务标题
2. 点击"取消"按钮或关闭模态框
3. 检查任务列表

**预期结果**：
- ✅ 模态框关闭
- ✅ 任务数据不更新
- ✅ 不显示错误提示
- ✅ 原始数据保持不变

**优先级**：P0

---

### TC-TASKEDIT-007 - 更新失败处理

**用例ID**：TC-TASKEDIT-007  
**测试目标**：验证更新失败的处理  
**前置条件**：
- 编辑任务模态框已打开
- 后端API返回错误

**测试步骤**：
1. 修改表单
2. 提交更新（模拟API失败）
3. 检查错误处理

**预期结果**：
- ✅ 显示"更新失败"错误提示
- ✅ 模态框保持打开
- ✅ 表单数据保留修改
- ✅ 可以重新提交

**优先级**：P1

---

## P1 - 重要功能

## 6. AgentList - Agent列表页面

**页面文件**：`pages/AgentList/index.tsx`  
**路由**：`/agents`  
**优先级**：P1

---

### TC-AGENTLIST-001 - Agent列表展示

**用例ID**：TC-AGENTLIST-001  
**测试目标**：验证Agent列表能正确显示  
**前置条件**：
- 用户已登录
- 系统中存在Agent数据

**测试步骤**：
1. 访问Agent列表页面
2. 等待页面加载完成
3. 检查Agent列表显示

**预期结果**：
- ✅ Agent列表成功加载
- ✅ 每个Agent显示：名称、类型、状态、负载、性能指标
- ✅ 状态标签正确显示（带颜色）
- ✅ 负载进度条正确显示

**API验证**：
```bash
curl -X GET http://localhost:5100/api/v1/agents \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

**优先级**：P1

---

### TC-AGENTLIST-002 - 搜索Agent

**用例ID**：TC-AGENTLIST-002  
**测试目标**：验证Agent搜索功能  
**前置条件**：
- Agent列表页面已加载

**测试步骤**：
1. 在搜索框输入关键词
2. 检查搜索结果

**预期结果**：
- ✅ 搜索结果匹配关键词（名称、类型）
- ✅ 搜索结果实时更新

**API验证**：
```bash
curl -X GET "http://localhost:5100/api/v1/agents?search=test" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

**优先级**：P1

---

### TC-AGENTLIST-003 - 状态筛选

**用例ID**：TC-AGENTLIST-003  
**测试目标**：验证按状态筛选Agent  
**前置条件**：
- Agent列表页面已加载

**测试步骤**：
1. 选择状态筛选条件
2. 检查筛选结果

**预期结果**：
- ✅ 筛选结果正确
- ✅ 状态标签正确显示

**优先级**：P1

---

### TC-AGENTLIST-004 - 类型筛选

**用例ID**：TC-AGENTLIST-004  
**测试目标**：验证按类型筛选Agent  
**前置条件**：
- Agent列表页面已加载

**测试步骤**：
1. 选择类型筛选条件
2. 检查筛选结果

**预期结果**：
- ✅ 筛选结果正确
- ✅ 类型标签正确显示

**优先级**：P1

---

### TC-AGENTLIST-005 - 创建Agent入口

**用例ID**：TC-AGENTLIST-005  
**测试目标**：验证创建Agent入口  
**前置条件**：
- Agent列表页面已加载

**测试步骤**：
1. 点击"创建Agent"按钮
2. 检查页面跳转或模态框

**预期结果**：
- ✅ 跳转到创建Agent页面
- ✅ 或显示创建Agent模态框

**优先级**：P1

---

### TC-AGENTLIST-006 - 查看Agent详情

**用例ID**：TC-AGENTLIST-006  
**测试目标**：验证查看Agent详情功能  
**前置条件**：
- Agent列表页面已加载

**测试步骤**：
1. 点击某个Agent
2. 检查页面跳转

**预期结果**：
- ✅ 跳转到Agent详情页面
- ✅ URL格式：`/agents/{agentId}`

**优先级**：P1

---

## 7. AgentDetail - Agent详情页面

**页面文件**：`pages/AgentDetail/index.tsx`  
**路由**：`/agents/:id`  
**优先级**：P1

---

### TC-AGENTDETAIL-001 - Agent基本信息显示

**用例ID**：TC-AGENTDETAIL-001  
**测试目标**：验证Agent详情页面正确显示Agent信息  
**前置条件**：
- 用户已登录
- 已创建测试Agent

**测试步骤**：
1. 从Agent列表点击某个Agent
2. 等待详情页面加载
3. 检查Agent详情显示

**预期结果**：
- ✅ Agent名称显示
- ✅ Agent类型显示
- ✅ Agent状态显示
- ✅ Agent配置信息显示
- ✅ Agent性能指标显示

**API验证**：
```bash
curl -X GET "http://localhost:5100/api/v1/agents/{AGENT_ID}" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

**优先级**：P1

---

### TC-AGENTDETAIL-002 - Agent状态管理

**用例ID**：TC-AGENTDETAIL-002  
**测试目标**：验证Agent启动/停止功能  
**前置条件**：
- 已打开Agent详情页面

**测试步骤**：
1. 点击"启动"或"停止"按钮
2. 检查Agent状态更新

**预期结果**：
- ✅ 可以启动Agent
- ✅ 可以停止Agent
- ✅ 状态标签正确更新

**优先级**：P1

---

### TC-AGENTDETAIL-003 - Agent配置编辑

**用例ID**：TC-AGENTDETAIL-003  
**测试目标**：验证Agent配置编辑功能  
**前置条件**：
- 已打开Agent详情页面

**测试步骤**：
1. 点击"编辑"按钮
2. 修改配置参数
3. 保存修改
4. 检查配置更新

**预期结果**：
- ✅ 可以编辑配置
- ✅ 修改成功保存
- ✅ 配置显示更新

**API验证**：
```bash
curl -X PATCH "http://localhost:5100/api/v1/agents/{AGENT_ID}" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "config": {
      "param1": "value1"
    }
  }'
```

**优先级**：P1

---

## 8. AgentCreate - 创建Agent页面

**页面文件**：`pages/AgentCreate/index.tsx`  
**路由**：`/agents/create`  
**优先级**：P1

---

### TC-AGENTCREATE-001 - 创建Agent表单

**用例ID**：TC-AGENTCREATE-001  
**测试目标**：验证创建Agent功能  
**前置条件**：
- 用户已登录
- 访问创建Agent页面

**测试步骤**：
1. 输入Agent名称
2. 选择Agent类型
3. 配置Agent参数
4. 点击"创建"
5. 检查Agent列表

**预期结果**：
- ✅ 表单验证正确
- ✅ Agent创建成功
- ✅ 跳转到Agent列表或详情页面
- ✅ 新Agent出现在列表中

**API验证**：
```bash
curl -X POST http://localhost:5100/api/v1/agents \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "测试Agent",
    "type": "chat",
    "config": {}
  }'
```

**优先级**：P1

---

## 9. TokenManagementPage - Token管理页面

**页面文件**：`pages/TokenManagementPage.tsx`  
**路由**：`/tokens` 或 `/settings/tokens`  
**优先级**：P1

---

### TC-TOKENMGT-001 - Token列表展示

**用例ID**：TC-TOKENMGT-001  
**测试目标**：验证Token列表能正确显示  
**前置条件**：
- 用户已登录

**测试步骤**：
1. 访问Token管理页面
2. 等待页面加载完成
3. 检查Token列表显示

**预期结果**：
- ✅ Token列表成功加载
- ✅ 每个Token显示：名称、关联Agent、创建时间、过期时间、状态

**API验证**：
```bash
curl -X GET http://localhost:5100/api/v1/tokens \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

**优先级**：P1

---

### TC-TOKENMGT-002 - 生成Token

**用例ID**：TC-TOKENMGT-002  
**测试目标**：验证生成Token功能  
**前置条件**：
- Token管理页面已加载

**测试步骤**：
1. 选择或输入Agent名称
2. 点击"生成Token"按钮
3. 检查Token显示

**预期结果**：
- ✅ Token生成成功
- ✅ Token显示模态框弹出
- ✅ 可以复制Token
- ✅ Token只显示一次

**API验证**：
```bash
curl -X POST http://localhost:5100/api/v1/tokens \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "agent123"
  }'
```

**优先级**：P1

---

### TC-TOKENMGT-003 - 撤销Token

**用例ID**：TC-TOKENMGT-003  
**测试目标**：验证撤销Token功能  
**前置条件**：
- Token管理页面已加载
- 存在有效Token

**测试步骤**：
1. 找到一个有效Token
2. 点击"撤销"按钮
3. 确认撤销
4. 检查Token状态

**预期结果**：
- ✅ 显示确认弹窗
- ✅ 确认后Token被撤销
- ✅ Token状态更新为"已撤销"
- ✅ Token无法再使用

**API验证**：
```bash
curl -X DELETE "http://localhost:5100/api/v1/tokens/{TOKEN_ID}" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

**优先级**：P1

---

### TC-TOKENMGT-004 - 批量撤销Token

**用例ID**：TC-TOKENMGT-004  
**测试目标**：验证批量撤销Token功能  
**前置条件**：
- Token管理页面已加载
- 已选择多个Token

**测试步骤**：
1. 选择多个Token
2. 点击"批量撤销"按钮
3. 确认撤销
4. 检查Token状态

**预期结果**：
- ✅ 显示确认弹窗
- ✅ 确认后所有Token被撤销
- ✅ Token状态更新

**优先级**：P1

---

## 10. Dashboard - 仪表盘页面

**页面文件**：`pages/Dashboard/index.tsx`  
**路由**：`/dashboard` 或 `/`  
**优先级**：P1

---

### TC-DASHBOARD-001 - 仪表盘数据展示

**用例ID**：TC-DASHBOARD-001  
**测试目标**：验证仪表盘数据正确展示  
**前置条件**：
- 用户已登录

**测试步骤**：
1. 访问仪表盘页面
2. 等待页面加载完成
3. 检查数据展示

**预期结果**：
- ✅ 统计卡片显示（任务总数、Agent总数、活跃用户等）
- ✅ 图表显示（任务趋势、Agent负载等）
- ✅ 最近活动列表显示

**API验证**：
```bash
curl -X GET http://localhost:5100/api/v1/dashboard/stats \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

**优先级**：P1

---

### TC-DASHBOARD-002 - 数据刷新

**用例ID**：TC-DASHBOARD-002  
**测试目标**：验证数据刷新功能  
**前置条件**：
- 仪表盘页面已加载

**测试步骤**：
1. 点击"刷新"按钮
2. 检查数据更新

**预期结果**：
- ✅ 数据重新加载
- ✅ 统计数据更新
- ✅ 图表重新渲染

**优先级**：P1

---

## P2 - 辅助功能

## 11. SubTaskManagement - 子任务管理页面

**页面文件**：`pages/SubTaskManagement/index.tsx`  
**路由**：`/tasks/:id/subtasks` 或 `/subtasks`  
**优先级**：P2

---

### TC-SUBTASK-001 - 子任务列表展示

**用例ID**：TC-SUBTASK-001  
**测试目标**：验证子任务列表能正确显示  
**前置条件**：
- 用户已登录
- 存在主任务和子任务

**测试步骤**：
1. 访问子任务管理页面
2. 等待页面加载完成
3. 检查子任务列表显示

**预期结果**：
- ✅ 子任务列表成功加载
- ✅ 每个子任务显示：标题、状态、优先级、进度

**优先级**：P2

---

### TC-SUBTASK-002 - 创建子任务

**用例ID**：TC-SUBTASK-002  
**测试目标**：验证创建子任务功能  
**前置条件**：
- 子任务管理页面已加载

**测试步骤**：
1. 点击"创建子任务"按钮
2. 填写子任务信息
3. 提交创建
4. 检查子任务列表

**预期结果**：
- ✅ 子任务创建成功
- ✅ 子任务出现在列表中
- ✅ 主任务进度自动更新

**优先级**：P2

---

## 12. TaskDependencies - 任务依赖管理页面

**页面文件**：`pages/TaskDependencies/index.tsx`  
**路由**：`/tasks/:id/dependencies` 或 `/dependencies`  
**优先级**：P2

---

### TC-DEPENDENCY-001 - 依赖关系展示

**用例ID**：TC-DEPENDENCY-001  
**测试目标**：验证任务依赖关系正确展示  
**前置条件**：
- 用户已登录
- 存在任务依赖关系

**测试步骤**：
1. 访问任务依赖管理页面
2. 等待页面加载完成
3. 检查依赖关系图或列表

**预期结果**：
- ✅ 依赖关系正确显示
- ✅ 前置任务列表显示
- ✅ 后置任务列表显示

**优先级**：P2

---

### TC-DEPENDENCY-002 - 添加依赖关系

**用例ID**：TC-DEPENDENCY-002  
**测试目标**：验证添加任务依赖功能  
**前置条件**：
- 任务依赖管理页面已加载

**测试步骤**：
1. 点击"添加依赖"按钮
2. 选择前置任务
3. 保存依赖关系
4. 检查依赖关系更新

**预期结果**：
- ✅ 依赖关系创建成功
- ✅ 依赖关系图或列表更新

**优先级**：P2

---

## 13. TaskTemplates - 任务模板页面

**页面文件**：`pages/TaskTemplates/index.tsx`  
**路由**：`/templates` 或 `/tasks/templates`  
**优先级**：P2

---

### TC-TEMPLATE-001 - 模板列表展示

**用例ID**：TC-TEMPLATE-001  
**测试目标**：验证任务模板列表能正确显示  
**前置条件**：
- 用户已登录
- 系统中存在任务模板

**测试步骤**：
1. 访问任务模板页面
2. 等待页面加载完成
3. 检查模板列表显示

**预期结果**：
- ✅ 模板列表成功加载
- ✅ 每个模板显示：名称、描述、使用次数

**优先级**：P2

---

### TC-TEMPLATE-002 - 创建模板

**用例ID**：TC-TEMPLATE-002  
**测试目标**：验证创建任务模板功能  
**前置条件**：
- 任务模板页面已加载

**测试步骤**：
1. 点击"创建模板"按钮
2. 填写模板信息
3. 保存模板
4. 检查模板列表

**预期结果**：
- ✅ 模板创建成功
- ✅ 模板出现在列表中

**优先级**：P2

---

### TC-TEMPLATE-003 - 从模板创建任务

**用例ID**：TC-TEMPLATE-003  
**测试目标**：验证从模板创建任务功能  
**前置条件**：
- 任务模板页面已加载

**测试步骤**：
1. 选择一个模板
2. 点击"使用模板创建任务"
3. 检查任务创建表单

**预期结果**：
- ✅ 任务创建表单预填充模板数据
- ✅ 可以修改模板数据
- ✅ 提交后任务创建成功

**优先级**：P2

---

## 14. AgentLoadSummary - Agent负载汇总页面

**页面文件**：`pages/AgentLoadSummary/index.tsx`  
**路由**：`/agents/load-summary`  
**优先级**：P2

---

### TC-LOADSUMMARY-001 - 负载汇总展示

**用例ID**：TC-LOADSUMMARY-001  
**测试目标**：验证Agent负载汇总数据正确展示  
**前置条件**：
- 用户已登录

**测试步骤**：
1. 访问Agent负载汇总页面
2. 等待页面加载完成
3. 检查负载汇总数据

**预期结果**：
- ✅ 负载统计数据显示
- ✅ 负载排行榜显示
- ✅ 负载趋势图显示

**优先级**：P2

---

## 15. AgentPerformanceRanking - Agent性能排名页面

**页面文件**：`pages/AgentPerformanceRanking/index.tsx`  
**路由**：`/agents/ranking` 或 `/agents/performance`  
**优先级**：P2

---

### TC-RANKING-001 - 性能排名展示

**用例ID**：TC-RANKING-001  
**测试目标**：验证Agent性能排名数据正确展示  
**前置条件**：
- 用户已登录

**测试步骤**：
1. 访问Agent性能排名页面
2. 等待页面加载完成
3. 检查性能排名数据

**预期结果**：
- ✅ 性能排行榜显示
- ✅ 每个Agent显示：排名、名称、性能得分
- ✅ 可以按不同维度排序

**优先级**：P2

---

## 未实现页面

## 16. 未实现页面清单

以下页面在任务清单中列出，但在前端源码中未找到对应实现：

---

### 16.1 ProjectListPage - 项目列表页面

**状态**：❌ 页面未实现  
**优先级**：P1  
**说明**：在 `pages/` 目录下未找到 `ProjectListPage.tsx` 或 `ProjectList/` 目录

---

### 16.2 ProjectDetailPage - 项目详情页面

**状态**：❌ 页面未实现  
**优先级**：P1  
**说明**：在 `pages/` 目录下未找到 `ProjectDetailPage.tsx` 或 `ProjectDetail/` 目录

---

### 16.3 UserListPage - 用户列表页面

**状态**：❌ 页面未实现  
**优先级**：P1  
**说明**：在 `pages/` 目录下未找到 `UserListPage.tsx` 或 `UserList/` 目录

---

### 16.4 UserDetailPage - 用户详情页面

**状态**：❌ 页面未实现  
**优先级**：P1  
**说明**：在 `pages/` 目录下未找到 `UserDetailPage.tsx` 或 `UserDetail/` 目录

---

### 16.5 RoleListPage - 角色列表页面

**状态**：❌ 页面未实现  
**优先级**：P1（V5.9新增）  
**说明**：在 `pages/` 目录下未找到 `RoleListPage.tsx` 或 `RoleList/` 目录

---

### 16.6 WebhookListPage - Webhook列表页面

**状态**：❌ 页面未实现  
**优先级**：P1（V5.9新增）  
**说明**：在 `pages/` 目录下未找到 `WebhookListPage.tsx` 或 `WebhookList/` 目录

---

### 16.7 ApiKeyListPage - API密钥列表页面

**状态**：❌ 页面未实现  
**优先级**：P2（V5.9新增）  
**说明**：在 `pages/` 目录下未找到 `ApiKeyListPage.tsx` 或 `ApiKeyList/` 目录

---

### 16.8 ReportDashboardPage - 报表仪表盘页面

**状态**：❌ 页面未实现  
**优先级**：P2（V5.9新增）  
**说明**：在 `pages/` 目录下未找到 `ReportDashboardPage.tsx` 或 `ReportDashboard/` 目录

---

### 16.9 NotificationCenter - 通知中心页面

**状态**：❌ 页面未实现  
**优先级**：P2  
**说明**：在 `pages/` 目录下未找到 `NotificationCenter.tsx` 或 `NotificationCenter/` 目录

---

### 16.10 ProfilePage - 个人资料页面

**状态**：❌ 页面未实现  
**优先级**：P2  
**说明**：在 `pages/` 目录下未找到 `ProfilePage.tsx` 或 `Profile/` 目录

---

## 📊 测试用例统计

### 按优先级统计
- **P0（核心业务流程）**：69个测试用例
- **P1（重要功能）**：24个测试用例
- **P2（辅助功能）**：11个测试用例
- **未实现页面**：10个页面（标注）

### 按页面统计
- **LoginPage**：6个测试用例
- **TaskListPage**：15个测试用例
- **TaskDetail**：6个测试用例
- **TaskCreateModal**：12个测试用例
- **TaskEditModal**：7个测试用例
- **AgentList**：6个测试用例
- **AgentDetail**：3个测试用例
- **AgentCreate**：1个测试用例
- **TokenManagementPage**：4个测试用例
- **Dashboard**：2个测试用例
- **SubTaskManagement**：2个测试用例
- **TaskDependencies**：2个测试用例
- **TaskTemplates**：3个测试用例
- **AgentLoadSummary**：1个测试用例
- **AgentPerformanceRanking**：1个测试用例
- **未实现页面**：10个页面（0个测试用例）

**总计**：104个测试用例

---

## 📝 附录

### A. 测试环境配置

**前端环境**：
- URL：http://localhost:5100
- 测试账号：admin@example.com / admin123

**后端API**：
- Base URL：http://localhost:5100/api/v1
- 认证方式：Bearer Token

### B. 测试数据准备

**登录测试账号**：
- 管理员：admin@example.com / admin123
- 普通用户：qa@prod.com / qa123

**测试任务数据**：
- 至少准备5-10个不同状态的任务
- 包含不同优先级：低、中、高、紧急
- 包含不同状态：待办、进行中、已完成、审核中

**测试Agent数据**：
- 至少准备3-5个不同类型的Agent
- 包含不同状态：活跃、空闲、离线

### C. 测试执行建议

**测试顺序**：
1. 先测试登录功能（TC-LOGIN-001至TC-LOGIN-006）
2. 再测试核心任务流程（TC-TASKLIST-001至TC-TASKEDIT-007）
3. 最后测试辅助功能（P2优先级用例）

**测试工具**：
- 手动测试：使用浏览器直接测试
- 自动化测试：使用Playwright、Cypress等工具
- API测试：使用curl、Postman等工具

**注意事项**：
- 执行测试前，确保测试环境已正确配置
- 每个测试用例执行前，重置测试数据
- 记录测试结果和发现的问题
- 截图保存关键测试步骤

---

**文档结束**

_创建人：QA Engineer | 创建时间：2026-04-05 23:34 GMT+8 | 版本：v1.0_
