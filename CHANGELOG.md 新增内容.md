## 新增内容 - 候选人自助模拟训练

### 新增页面
- `candidate_portal.html` - 候选人入口页面
- `select_role.html` - 岗位选择与搜索
- `upload_resume.html` - 简历上传与管理  
- `choose_interviewer.html` - 面试官类型选择
- `simulate_training.html` - 模拟训练与报告

### 新增功能
- 完整的5步候选人流程
- 简历文件上传与验证
- 多面试官类型选择
- 问题流与计时系统
- 多维评分与报告生成
- 本地数据持久化

### 新增脚本
- `state.js` - 候选人流程状态管理
- `questions.js` - 动态问题生成
- 更新 `actions.js` - 新增候选人动作
- 更新 `delegate.js` - 增强事件处理

### 交互优化
- 所有按钮添加 `data-action` + `data-test`
- 完整的无障碍支持
- 响应式设计
- 引导系统 (`?guide=1`)