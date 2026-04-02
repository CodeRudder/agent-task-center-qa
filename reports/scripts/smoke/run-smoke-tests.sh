#!/bin/bash

###############################################################################
# 冒烟测试执行脚本
# 文件位置：team-docs/qa-reports/scripts/smoke/run-smoke-tests.sh
# 功能：执行所有冒烟测试，生成测试报告，发送测试结果
###############################################################################

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
BASE_URL="${BASE_URL:-http://localhost:3101}"
TEST_USER="${TEST_USER:-test@test.com}"
TEST_PASSWORD="${TEST_PASSWORD:-test123}"
REPORT_DIR="team-docs/qa-reports/smoke-reports"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_FILE="${REPORT_DIR}/smoke-test-report-${TIMESTAMP}.html"
SUMMARY_FILE="${REPORT_DIR}/smoke-test-summary-${TIMESTAMP}.txt"

# 创建报告目录
mkdir -p "$REPORT_DIR"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  冒烟测试执行脚本${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}测试配置:${NC}"
echo -e "  BASE_URL: ${BASE_URL}"
echo -e "  TEST_USER: ${TEST_USER}"
echo -e "  REPORT_DIR: ${REPORT_DIR}"
echo ""

# 检查Playwright是否安装
if ! command -v npx &> /dev/null; then
    echo -e "${RED}错误: npx未安装，请先安装Node.js和npm${NC}"
    exit 1
fi

# 检查测试文件是否存在
TEST_FILE="team-docs/qa-reports/scripts/smoke/login-to-task-list.spec.js"
if [ ! -f "$TEST_FILE" ]; then
    echo -e "${RED}错误: 测试文件不存在: ${TEST_FILE}${NC}"
    exit 1
fi

echo -e "${GREEN}开始执行冒烟测试...${NC}"
echo ""

# 执行Playwright测试
START_TIME=$(date +%s)

npx playwright test "$TEST_FILE" \
  --project=chromium \
  --reporter=html \
  --output="$REPORT_DIR" \
  --config=team-docs/qa-reports/scripts/playwright.config.js 2>&1 | tee "$SUMMARY_FILE"

TEST_EXIT_CODE=${PIPESTATUS[0]}
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  测试结果汇总${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ 冒烟测试全部通过！${NC}"
    TEST_RESULT="PASS"
else
    echo -e "${RED}❌ 冒烟测试失败！${NC}"
    TEST_RESULT="FAIL"
fi

echo ""
echo -e "${YELLOW}测试统计:${NC}"
echo -e "  执行时间: ${DURATION} 秒"
echo -e "  测试结果: ${TEST_RESULT}"
echo -e "  详细报告: ${REPORT_FILE}"
echo -e "  测试日志: ${SUMMARY_FILE}"
echo ""

# 生成简单报告
cat > "$REPORT_FILE" << EOF
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>冒烟测试报告 - ${TIMESTAMP}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .status { padding: 10px; border-radius: 4px; margin: 20px 0; text-align: center; font-size: 18px; font-weight: bold; }
        .status.pass { background: #d4edda; color: #155724; }
        .status.fail { background: #f8d7da; color: #721c24; }
        .info { background: #e7f3ff; padding: 15px; border-radius: 4px; margin: 10px 0; }
        .info p { margin: 5px 0; }
        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 冒烟测试报告</h1>
            <p>Agent任务管理系统 - UI登录到任务列表</p>
        </div>
        
        <div class="status ${TEST_RESULT,,}">
            测试结果: ${TEST_RESULT}
        </div>
        
        <div class="info">
            <h3>测试信息</h3>
            <p><strong>执行时间:</strong> $(date '+%Y-%m-%d %H:%M:%S')</p>
            <p><strong>测试环境:</strong> ${BASE_URL}</p>
            <p><strong>测试账户:</strong> ${TEST_USER}</p>
            <p><strong>执行耗时:</strong> ${DURATION} 秒</p>
        </div>
        
        <div class="info">
            <h3>测试范围</h3>
            <ul>
                <li>✅ 用户登录流程</li>
                <li>✅ 任务列表页面显示</li>
                <li>✅ Token保存验证</li>
                <li>✅ 核心功能可用性</li>
                <li>✅ 页面性能验证</li>
                <li>✅ 错误检查</li>
                <li>✅ 完整流程集成测试</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>生成时间: $(date '+%Y-%m-%d %H:%M:%S')</p>
            <p>QA Engineer Agent</p>
        </div>
    </div>
</body>
</html>
EOF

echo -e "${GREEN}测试报告已生成: ${REPORT_FILE}${NC}"

# 发送测试结果（可选）
# 如果配置了通知服务（如邮件、Slack、Rocket.Chat等），可以在这里添加发送逻辑

# 示例：发送到Rocket.Chat（需要配置webhook）
# if [ -n "$ROCKET_CHAT_WEBHOOK" ]; then
#     curl -X POST -H 'Content-Type: application/json' \
#          --data "{\"text\":\"冒烟测试完成\n结果: ${TEST_RESULT}\n耗时: ${DURATION}秒\n报告: ${REPORT_FILE}\"}" \
#          "$ROCKET_CHAT_WEBHOOK"
# fi

# 示例：发送邮件（需要配置邮件服务）
# if [ -n "$NOTIFICATION_EMAIL" ]; then
#     echo "冒烟测试完成，结果: ${TEST_RESULT}" | mail -s "冒烟测试报告" "$NOTIFICATION_EMAIL"
# fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  冒烟测试执行完成${NC}"
echo -e "${BLUE}========================================${NC}"

# 退出码
exit $TEST_EXIT_CODE
