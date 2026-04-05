# TC-REPORT-R2-001: 风险预警报表API返回404错误

## 测试信息
- **TC编号**：TC-REPORT-R2-001
- **API路径**：GET /api/v1/reports/risk
- **优先级**：🟡 P1（影响重要功能）
- **测试环境**：http://localhost:4100

## 操作步骤
1. 使用`admin@example.com / Admin123!`登录
2. POST `/api/v1/auth/login`获取token
3. GET `/api/v1/reports/risk`
4. Header: `Authorization: Bearer ${token}`

## 输入数据/参数

### Headers
```
Authorization: Bearer ${token}
Content-Type: application/json
```

### Query Parameters
```
startDate: "2026-03-01"
endDate: "2026-03-31"
```

### cURL
```bash
curl -X GET "http://localhost:4100/api/v1/reports/risk?startDate=2026-03-01&endDate=2026-03-31" \
  -H "Authorization: Bearer ${token}" \
  -H "Content-Type: application/json"
```

## 实际结果
- **状态码**：404
- **响应**：```json
{
  "success": false,
  "message": "Cannot GET /api/v1/reports/risk"
}
```

## 期望结果
- **状态码**：200
- **响应**：```json
{
  "success": true,
  "data": {
    "highRiskTasks": 5,
    "mediumRiskTasks": 10,
    "lowRiskTasks": 20,
    "riskTrends": [...]
  }
}
```

## 影响范围
- 风险预警报表功能不可用
- 管理层无法查看风险分析
- 决策支持功能缺失

## 修复建议
1. 检查报表模块路由配置
2. 确认路由是否注册
3. 检查报表模块是否加载
4. 验证控制器是否存在

## 相关文件
- 测试文件：`tests/integration/api/report-module/risk-warning.test.js`
- API路由：`GET /api/v1/reports/risk`
- 控制器：`ReportController.getRiskReport()`
- 模块：报表模块