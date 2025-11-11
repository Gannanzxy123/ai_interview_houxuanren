# AI 面试模拟 — 自动化与测试

[![Manual](https://github.com/Gannanzxy123/ai_interviewer_train_personal/actions/workflows/playwright.yml/badge.svg?event=workflow_dispatch)](https://github.com/Gannanzxy123/ai_interviewer_train_personal/actions/workflows/playwright.yml)
> 手动：在 Actions 页面 Run workflow 触发完整套件（含移动端）
> 将上方徽章中的 Gannanzxy123/ai_interviewer_train_personal 替换为你的 GitHub 组织与仓库名。

## 快速开始
- 安装依赖
  - `npm i -D @playwright/test http-server`
  - `npx playwright install`
- 启动静态服务
  - `npm run serve`
- 运行端到端测试
  - `npm test`
  - 自定义基准地址：`SUT_URL="http://localhost:8080" npm test`
- 查看报告
  - `npm run test:report`

## 常用脚本（package.json）
```json
{
  "scripts": {
    "serve": "http-server . -p 8080",
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:report": "playwright show-report"
  }
}
```

## RPA 内置演示
- 打开：`/pages/simulate_training.html?rpa=1`
- 自动验证：评分必填>0、跳过/下一题规则、最后一题按钮变更、答案必填、生成报告

更多细节见 `README_测试说明.md`。




## 手动触发指南（workflow_dispatch）
- 打开仓库 → Actions → 选择 Playwright E2E Workflow → 点击右侧 “Run workflow”
- 运行完成后，在该运行页面底部 Artifacts 处下载报告

![Run workflow 指南占位图](docs/screenshots/run_workflow_guide.png)

## 脚本速查（常用）
- `npm run test:desktop`：桌面矩阵（Chromium/Firefox/WebKit）
- `npm run test:mobile`：移动矩阵（Pixel 5 / iPhone 12）
- `npm run test:simulate`：仅模拟面试页用例
- `npm run test:full`：多页面全链路用例
- `npm run test:guide`：匹配标题包含 guide 的用例
- `npm run test:role`：岗位筛选/引导等辅助用例
- `npm run test:report`：打开测试报告
