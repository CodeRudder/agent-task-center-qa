# TC-REPORT-003: 对比分析报表API返回404错误

## 优先级
🟡 P1（严重）

## 操作步骤
1. 使用测试账号登录系统（test@example.com / Test123456）
2. 获取登录返回的accessToken
3. 发送GET请求到对比分析报表API：`http://localhost:4100/api/v1/reports/comparison`
4. 在请求头中添加Authorization：`Bearer ${accessToken}`

## 输入数据/参数

### 请求URL
```
GET http://localhost:4100/api/v1/reports/comparison
```

### 请求头
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

### 查询参数
```
?period=week
&baselineStartDate=2026-03-27
&baselineEndDate=2026-03-30
&currentStartDate=2026-03-31
&currentEndDate=2026-04-03
```

## 实际结果

### HTTP状态码
```
404 Not Found
```

### 响应体
```json
{
  "statusCode": 404,
  "message": "Cannot GET /api/v1/reports/comparison",
  "error": "Not Found"
}
```

### 错误详情
```
Error: Route not found - GET /api/v1/reports/comparison
```

## 期望结果

### HTTP状态码
```
200 OK
```

### 响应体
```json
{
  "success": true,
  "data": {
    "comparisonData": {
      "baseline": {
        "period": "2026-03-27 至 2026-03-30",
        "totalTasks": 80,
        "completedTasks": 60,
        "completionRate": 75.0
      },
      "current": {
        "period": "2026-03-31 至 2026-04-03",
        "totalTasks": 100,
        "completedTasks": 85,
        "completionRate": 85.0
      },
      "change": {
        "totalTasks": +25,
        "completedTasks": +25,
        "completionRate": +10.0
      }
    }
  }
}
```

## 影响范围
- 对比分析报表功能不可用
- 用户无法进行周期性对比分析
- 影响项目效果评估和改进

## 复现频率
100%（每次请求都返回404错误）

## 环境信息
- **版本**：V5.9（Commit: 55a8067）
- **测试环境**：TEST环境（http://localhost:4100）
- **测试时间**：2026-04-03 10:45:00

## 修复建议
1. 检查报表模块的路由配置
2. 确认 `/api/v1/reports/comparison` 路由是否已注册
3. 验证报表控制器是否正确实现
4. 检查对比分析的业务逻辑

## 测试用例文件
`tests/integration/api/report-module/comparison-analysis.test.js`

## 测试用例名称
"正常场景 - 获取对比分析报表成功"
