# TC-REPORT-001: 风险预警报表API返回404错误

## 优先级
🟡 P1（严重）

## 操作步骤
1. 使用测试账号登录系统（test@example.com / Test123456）
2. 获取登录返回的accessToken
3. 发送GET请求到风险预警报表API：`http://localhost:4100/api/v1/reports/risk`
4. 在请求头中添加Authorization：`Bearer ${accessToken}`

## 输入数据/参数

### 请求URL
```
GET http://localhost:4100/api/v1/reports/risk
```

### 请求头
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

### 查询参数（可选）
```
?threshold=medium
&startDate=2026-04-01
&endDate=2026-04-03
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
  "message": "Cannot GET /api/v1/reports/risk",
  "error": "Not Found"
}
```

### 错误详情
```
Error: Route not found - GET /api/v1/reports/risk
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
    "riskData": {
      "totalTasks": 100,
      "overdueTasks": 10,
      "highRiskTasks": 5,
      "mediumRiskTasks": 15,
      "lowRiskTasks": 70
    },
    "warnings": [
      {
        "type": "overdue",
        "message": "有10个任务已逾期",
        "count": 10
      },
      {
        "type": "high_risk",
        "message": "有5个高风险任务需要关注",
        "count": 5
      }
    ]
  }
}
```

## 影响范围
- 风险预警报表功能不可用
- 用户无法查看项目风险分析
- 影响项目决策和风险管控

## 复现频率
100%（每次请求都返回404错误）

## 环境信息
- **版本**：V5.9（Commit: 55a8067）
- **测试环境**：TEST环境（http://localhost:4100）
- **测试时间**：2026-04-03 10:45:00

## 修复建议
1. 检查报表模块的路由配置
2. 确认 `/api/v1/reports/risk` 路由是否已注册
3. 验证报表控制器是否正确实现
4. 检查报表模块是否已正确加载

## 测试用例文件
`tests/integration/api/report-module/risk-warning.test.js`

## 测试用例名称
"正常场景 - 获取风险预警报表成功"
