# Agent Task Center QA - E2E Tests

这是一个使用 Playwright 进行端到端测试的项目。

## 项目结构

```
agent-task-center-qa/
├── tests/              # 测试用例
│   └── auth/          # 认证相关测试
├── test-results/      # 测试结果
├── playwright.config.ts # Playwright 配置
├── tsconfig.json      # TypeScript 配置
└── package.json       # 项目依赖
```

## 安装依赖

```bash
npm install
```

## 运行测试

```bash
# 运行所有测试
npx playwright test

# 运行特定测试文件
npx playwright test tests/auth/login.spec.ts

# 以UI模式运行
npx playwright test --ui

# 生成测试报告
npx playwright show-report
```

## 测试环境

- 基础URL: http://localhost:3100
- 测试浏览器: Chromium

## 测试用例

### 认证测试 (auth/login.spec.ts)
- TC-LOGIN-001: 使用正确凭据登录
- TC-LOGIN-002: 记住登录状态
- TC-LOGIN-003: 登录后Token有效性验证
- ... (更多测试用例)
