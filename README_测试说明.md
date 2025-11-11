[![Playwright E2E](https://github.com/Gannanzxy123/ai_interviewer_train_personal/actions/workflows/playwright.yml/badge.svg)](https://github.com/Gannanzxy123/ai_interviewer_train_personal/actions/workflows/playwright.yml)

# 测试与自动化说明

本项目已内置两套自动化：
- Playwright 端到端测试（CI 可跑）
- 页面内 RPA 演示脚本（?rpa=1）

## 本地运行
1. 安装依赖
   - Node.js 18+
   - `npm i -D @playwright/test http-server`
   - `npx playwright install`
2. 启动静态服务
   - `npm run serve`
   - 访问 `http://localhost:8080/pages/simulate_training.html`
3. 运行 E2E 测试
   - `npm test`
   - 或指定基准地址：`SUT_URL="http://localhost:8080" npm test`
4. 查看报告
   - `npm run test:report`

## RPA 页面内演示
- 打开：`/pages/simulate_training.html?rpa=1`
- 右下角会出现“RPA 自动化测试”面板，自动执行：
  - 评分为 0 阻止“下一题”
  - 评分>0 且答案空，“下一题”推进
  - “跳过”需评分>0
  - 最后一题隐藏“跳过/结束面试”，按钮变“提交并生成报告”
  - 最后一题答案必填后进入报告

## 选择器规范
- 下一题：`[data-action="Sim.Answer.Next"]`
- 跳过：`[data-action="Sim.Skip"]`
- 结束：`[data-action="Sim.End"]`
- 答案输入：`#answerInput`
- 评分滑块：`.score-slider`
- 进度文本：`#progressText`
- 报告容器：`#reportSection`

## CI 集成
- 已提供 GitHub Actions workflow：`.github/workflows/playwright.yml`
- 自动：安装依赖 → 安装浏览器 → 启静态服务 → 运行测试 → 上传报告



## CI 工件查看（Actions Artifacts）
- 进入仓库 → Actions → 选择最新一次运行 → Artifacts
  - playwright-html-report：下载后解压，打开 `index.html` 查看完整报告（含步骤、失败快照/视频/trace）
  - test-results：包含原始截图/视频/trace 目录，便于进一步排查
- 失败排查建议
  - 优先查看 HTML 报告中的 trace（Open trace）与 video（Open video），定位元素选择器是否失效、时序是否不足
  - 若端口占用或起服失败，查看 webServer 步骤日志（CI 配置使用 `reuseExistingServer: true`）

## 测试矩阵（浏览器/视窗）
- 桌面端
  - Desktop Chrome（1366x900）
  - Desktop Firefox（1366x900）
  - Desktop Safari（1366x900）
- 移动端
  - Pixel 5（Android Chrome 配置）
  - iPhone 12（Mobile Safari 配置）


## 运行策略（CI）
- 桌面端（Chromium/Firefox/WebKit）：在 push 与 PR 均运行（快速回归）。
- 移动端（Pixel 5 / iPhone 12）：仅在 main/master 分支的 push 事件运行（减少 PR 等待时长）。
- 查看工件与报告：见上文“CI 工件查看”。

## 定时任务（Nightly）
- Actions 已配置 schedule：每日 02:00（UTC）触发工作流；移动端矩阵在此计划任务下也会运行。
- 可通过 workflow_dispatch 手动触发整套测试。

## 失败示例与复盘模板
- 建议将失败截图/视频放在 `docs/screenshots/` 目录，命名含日期与用例名，例如：
  - `docs/screenshots/2025-01-01_simulate_training_desktop_chromium.png`
  - `docs/screenshots/2025-01-01_full_flow_mobile_safari.mp4`
- 在 PR 或缺陷单中嵌入链接：
  - 示例：`![失败截图](docs/screenshots/2025-01-01_simulate_training_desktop_chromium.png)`
- 复盘要点（建议清单）：
  - 失败环境（浏览器/设备/视窗/分支/提交）
  - 失败位置（用例与步骤）
  - 元素选择器是否变化（优先 data-action/data-test）
  - 时序问题（是否需要增加等待或使用 webServer）
  - 业务逻辑变更（评分/按钮文案/必填规则）
  - 修复方案与验证（本地与 CI、桌面与移动）

## 常见失败 FAQ
- 端口占用/起服失败
  - 现象：Tests 超时，无法连接 8080
  - 处理：本地先关闭占用端口，或修改 playwright.config.ts 的 webServer 端口；CI 可改用随机端口与 SUT_URL 环境变量
- 选择器未匹配（UI 变更）
  - 现象：定位不到元素，报 Timeout 30000ms exceeded
  - 处理：优先为按钮/输入保留 data-action/data-test/ID；更新测试内选择器，避免依赖文案
- 等待时序不足
  - 现象：点击后立即断言失败
  - 处理：使用 Locator 的 expect/toBeVisible 等内置等待；必要时增加 waitForURL / waitForTimeout 小延时
- 浏览器未安装/依赖缺失
  - 现象：Failed to launch browser / no browser found
  - 处理：执行 `npx playwright install` 或在 CI 使用 `npx playwright install --with-deps`
- 工件过大/配额不足
  - 处理：仅在失败保留视频与 trace（当前已 retain-on-failure）；定期清理历史 artifact
- 权限与 Actions 受限
  - 现象：工作流未运行或被阻止
  - 处理：检查仓库 Settings → Actions 权限；Fork PR 可改为仅桌面跑或维护者手动触发

## 本地随机端口运行示例（PowerShell）
```powershell
# 选择一个可用端口并启动静态服务
$port = & node -e "const s=require('http').createServer(()=>{}); s.listen(0, ()=>{console.log(s.address().port); s.close();});"
$env:SUT_URL = "http://localhost:$port"
Start-Process -FilePath npx -ArgumentList @('http-server','.','-p','$port')
# 运行 Playwright 测试（将读取 SUT_URL）
npx playwright test
```

## 常用测试命令
```bash
# 仅跑桌面项目
npx playwright test --project=chromium --project=firefox --project=webkit
# 仅跑移动矩阵（本地调试场景）
npx playwright test --project=mobile-chrome --project=mobile-safari
# 仅跑单文件
npx playwright test tests/simulate_training.spec.ts
# 仅跑带有 "guide" 的用例（title 匹配）
npx playwright test -g guide
```

## 快速释放端口（Windows）
```powershell
# 查看占用 8080 的进程
netstat -ano | findstr :8080
# 结束进程（示例 PID 1234）
Stop-Process -Id 1234 -Force
```

## 脚本快捷命令（npm scripts）
```bash
# 桌面浏览器矩阵（Chromium/Firefox/WebKit）
npm run test:desktop
# 移动端矩阵（Pixel 5 / iPhone 12）
npm run test:mobile
# 打开测试报告
npm run test:report
```
> 如需指定服务地址，设置 SUT_URL 环境变量；或参考“本地随机端口运行示例（PowerShell）”。


![Artifacts 下载位置占位图](docs/screenshots/artifacts_guide.png)


## 本地报告查看
- 运行完成后执行 \
px playwright show-report\ 或 \
pm run test:report\`n- 将打开本地报告页面：\playwright-report/index.html\`n- 也可直接双击打开该目录下的 \index.html\`n
![本地报告查看占位图](docs/screenshots/local_report_open.png)
