## 候选人自助演示路径

完整的候选人自助模拟训练流程：

1. **入口页面** (`candidate_portal.html`)
   - 点击"开始模拟训练"进入岗位选择

2. **岗位选择** (`select_role.html`) 
   - 浏览或搜索岗位
   - 选择目标岗位进入简历上传

3. **简历上传** (`upload_resume.html`)
   - 拖拽或选择简历文件(PDF/DOCX/MD)
   - 文件验证(≤10MB)
   - 确认后进入面试官选择

4. **面试官选择** (`choose_interviewer.html`)
   - 选择面试官类型(HR/技术/经理/压力面)
   - 支持多选，tooltip说明
   - 开始模拟训练

5. **模拟训练** (`simulate_training.html`)
   - 问题流与计时器
   - 回答输入与自评分
   - 进度跟踪
   - 结束生成评估报告

### 数据持久化
所有步骤数据自动保存到 `localStorage` (key: `candidateFlow`)，刷新页面可恢复进度。

### 离线演示
所有资源本地化，双击 `00_入口_首页.html` 即可离线运行完整流程。