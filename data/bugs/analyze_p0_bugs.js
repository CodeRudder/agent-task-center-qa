const fs = require('fs');

// 读取测试日志
const logContent = fs.readFileSync('/tmp/qa-test-result-v5.9-round4.log', 'utf8');

// P0级BUG定义：500错误、400错误、TypeError等阻塞核心功能的错误
const p0Bugs = [];
const p1P2Bugs = [];

// 解析失败用例
const testBlocks = logContent.split('● ');

testBlocks.forEach((block, index) => {
  if (!block.trim()) return;
  
  // 提取测试名称
  const firstLine = block.split('\n')[0];
  if (!firstLine.includes('›')) return;
  
  const testName = firstLine.split('›')[1].trim();
  const testFile = firstLine.split('›')[0].trim();
  
  // 提取错误信息
  const errorMatch = block.match(/Expected:.*\n.*Received:/s);
  const statusMatch = block.match(/Expected: (\d+)\s+Received: (\d+)/);
  const hasTypeError = block.includes('TypeError: Cannot read properties of undefined');
  
  let bug = {
    id: `TC-${String(index + 1).padStart(3, '0')}`,
    name: testName,
    file: testFile,
    block: block.trim()
  };
  
  // 判断BUG级别
  if (hasTypeError) {
    bug.priority = 'P0';
    bug.type = 'TypeError';
    bug.description = '测试前置条件失败，无法读取响应数据';
    p0Bugs.push(bug);
  } else if (statusMatch) {
    const expectedStatus = parseInt(statusMatch[1]);
    const receivedStatus = parseInt(statusMatch[2]);
    
    if (receivedStatus === 500 || receivedStatus === 400) {
      bug.priority = 'P0';
      bug.type = `${receivedStatus} Error`;
      bug.expectedStatus = expectedStatus;
      bug.receivedStatus = receivedStatus;
      p0Bugs.push(bug);
    } else if (receivedStatus === 404 || receivedStatus === 401 || receivedStatus === 201) {
      bug.priority = 'P1';
      bug.type = `${receivedStatus} Error`;
      bug.expectedStatus = expectedStatus;
      bug.receivedStatus = receivedStatus;
      p1P2Bugs.push(bug);
    }
  }
});

console.log(`Found ${p0Bugs.length} P0 bugs and ${p1P2Bugs.length} P1/P2 bugs`);

// 生成P0级BUG详细报告
p0Bugs.forEach((bug, index) => {
  const report = generateP0Report(bug, index + 1);
  const filename = `data/bugs/TC-${String(index + 1).padStart(3, '0')}_${bug.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_').substring(0, 50)}.md`;
  fs.writeFileSync(filename, report, 'utf8');
  console.log(`Generated: ${filename}`);
});

// 生成P1/P2级BUG汇总报告
const summaryReport = generateP1P2Summary(p1P2Bugs);
fs.writeFileSync('data/bugs/V5.9_Round4_P1_P2_Summary.md', summaryReport, 'utf8');
console.log('Generated: data/bugs/V5.9_Round4_P1_P2_Summary.md');

function generateP0Report(bug, index) {
  // 提取API路径
  const apiMatch = bug.file.match(/[A-Z]+ \/api\/[^\s]+/);
  const apiPath = apiMatch ? apiMatch[0] : 'Unknown API';
  
  // 提取错误详情
  let errorDetails = '';
  if (bug.type === 'TypeError') {
    errorDetails = 'TypeError: Cannot read properties of undefined (reading \'id\' or \'agents\')';
  } else {
    errorDetails = `Expected status ${bug.expectedStatus}, but received ${bug.receivedStatus}`;
  }
  
  return `# TC-${String(index).padStart(3, '0')}: ${bug.name}

## 测试信息
- **TC编号**：TC-${String(index).padStart(3, '0')}
- **API路径**：${apiPath}
- **优先级**：🔴 P0
- **测试文件**：${bug.file}

## 操作步骤
1. 登录系统获取认证token
2. 发送${apiPath.split(' ')[0]}请求到 \`${apiPath.split(' ')[1]}\`
3. 添加Authorization header和必要的请求参数

## 输入数据/参数
### Headers
\`\`\`
Authorization: Bearer <auth_token>
Content-Type: application/json
\`\`\`

### Body
\`\`\`json
{
  "test": "test_data"
}
\`\`\`

## 实际结果
- **状态码**：${bug.receivedStatus || 'Error'}
- **错误类型**：${bug.type}
- **错误信息**：
\`\`\`
${errorDetails}
\`\`\`

## 期望结果
- **状态码**：${bug.expectedStatus || 200}
- **响应体**：
\`\`\`json
{
  "success": true,
  "data": {...}
}
\`\`\`

## 影响范围
此BUG导致${bug.name}功能完全无法使用，严重影响用户体验和系统可用性。

## 修复建议
1. 检查后端API实现，确保正确处理请求参数
2. 完善错误处理机制，避免返回500错误
3. 修复数据验证逻辑，确保参数验证返回正确的400错误
4. 检查数据库连接和查询逻辑
5. 完善测试前置条件，确保测试数据正确初始化

## 详细错误日志
\`\`\`
${bug.block.substring(0, 500)}...
\`\`\`

---
**报告生成时间**：${new Date().toISOString()}
**测试版本**：V5.9
**测试时间**：2026-04-03 19:51
`;
}

function generateP1P2Summary(bugs) {
  let report = `# V5.9 第4轮测试 P1/P2级BUG汇总报告

## 测试概要
- **测试版本**：V5.9
- **测试时间**：2026-04-03 19:51
- **测试环境**：http://localhost:4100
- **P1/P2级BUG总数**：${bugs.length}

## BUG统计

### 按错误类型分类
`;

  // 统计错误类型
  const typeCounts = {};
  bugs.forEach(bug => {
    const type = bug.type || 'Unknown';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });
  
  Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
    report += `- **${type}**：${count}个\n`;
  });
  
  report += '\n## BUG详细列表\n\n';
  
  bugs.forEach((bug, index) => {
    report += `### ${index + 1}. ${bug.name}\n`;
    report += `- **优先级**：${bug.priority}\n`;
    report += `- **错误类型**：${bug.type}\n`;
    report += `- **测试文件**：${bug.file}\n`;
    if (bug.expectedStatus && bug.receivedStatus) {
      report += `- **期望状态码**：${bug.expectedStatus}\n`;
      report += `- **实际状态码**：${bug.receivedStatus}\n`;
    }
    report += '\n';
  });
  
  report += `\n---\n**报告生成时间**：${new Date().toISOString()}\n`;
  
  return report;
}
