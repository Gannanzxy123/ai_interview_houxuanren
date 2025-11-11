// 候选人流程动作处理
class CandidateActions {
    constructor() {
        this.state = window.candidateFlowState;
    }

    // 入口开始
    'Portal.Start'(event) {
        event.preventDefault();
        toast('开始模拟面试流程');
        setTimeout(() => {
            window.location.href = '../pages/select_role.html';
        }, 1000);
    }

    // 选择岗位
    'Role.Select'(event) {
        event.preventDefault();
        const button = event.target;
        const roleId = button.dataset.roleId;
        const roleCard = button.closest('.role-card');
        const roleTitle = roleCard.querySelector('.role-title').textContent;

        // 保存岗位选择
        this.state.setJob(roleId, roleTitle);
        
        toast(`已选择岗位: ${roleTitle}`);
        setTimeout(() => {
            window.location.href = '../pages/upload_resume.html';
        }, 1500);
    }

    // 上传简历
    'Resume.Upload'(event) {
        const fileInput = event.target;
        if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            
            // 验证文件
            if (!this.validateResumeFile(file)) {
                return;
            }

            // 保存简历信息
            this.state.setResume(file);
            toast('简历上传成功');
        }
    }

    // 删除简历
    'Resume.Remove'(event) {
        event.preventDefault();
        this.state.setResume(null);
        document.querySelector('.file-input').value = '';
        document.getElementById('nextBtn').disabled = true;
        toast('简历已删除');
    }

    // 继续下一步（简历）
    'Resume.Upload.Next'(event) {
        event.preventDefault();
        if (!this.state.getCurrentState().resume) {
            toast('请先上传简历文件');
            return;
        }
        
        toast('简历验证通过，进入面试官选择');
        setTimeout(() => {
            window.location.href = '../pages/choose_interviewer.html';
        }, 1000);
    }

    // 开始模拟训练
    'Sim.Start'(event) {
        event.preventDefault();
        const currentState = this.state.getCurrentState();
        
        if (!currentState.job) {
            toast('请先选择岗位');
            return;
        }
        if (!currentState.resume) {
            toast('请先上传简历');
            return;
        }
        if (currentState.interviewers.length === 0) {
            toast('请选择至少一种面试官类型');
            return;
        }

        this.state.startSession();
        toast('模拟面试开始！');
        setTimeout(() => {
            window.location.href = '../pages/simulate_training.html';
        }, 1500);
    }

    // 下一题
    'Sim.Answer.Next'(event) {
        event.preventDefault();
        
        const answerInput = document.getElementById('answerInput');
        const answer = answerInput.value.trim();
        
        if (!answer) {
            toast('请输入回答内容');
            return;
        }

        // 收集评分
        const scores = {};
        document.querySelectorAll('.score-slider').forEach(slider => {
            const dimension = slider.dataset.dimension;
            scores[dimension] = parseInt(slider.value);
        });

        // 保存步骤
        const currentQuestion = document.getElementById('questionText').textContent;
        this.state.addStep(currentQuestion, answer, scores, 120); // 模拟时间

        // 清空输入
        answerInput.value = '';
        
        // 移动到下一题
        if (typeof window.currentQuestionIndex !== 'undefined') {
            window.currentQuestionIndex++;
            if (typeof window.updateQuestionDisplay === 'function') {
                window.updateQuestionDisplay();
            }
        }

        toast('回答已保存');
    }

    // 跳过问题
    'Sim.Skip'(event) {
        event.preventDefault();
        
        // 保存跳过记录
        const currentQuestion = document.getElementById('questionText').textContent;
        this.state.addStep(currentQuestion, '[跳过]', {}, 0);

        // 移动到下一题
        if (typeof window.currentQuestionIndex !== 'undefined') {
            window.currentQuestionIndex++;
            if (typeof window.updateQuestionDisplay === 'function') {
                window.updateQuestionDisplay();
            }
        }

        toast('问题已跳过');
    }

    // 结束面试
    'Sim.End'(event) {
        event.preventDefault();
        
        if (confirm('确定要结束面试吗？将生成评估报告。')) {
            if (typeof window.endInterview === 'function') {
                window.endInterview();
            }
            
            // 生成报告数据
            const reportData = this.generateReport();
            this.state.setReport(reportData);
            
            toast('面试结束，生成评估报告中...');
        }
    }

    // 保存报告
    'Report.Save'(event) {
        event.preventDefault();
        toast('报告导出功能开发中...');
        // 实际应该生成PDF并下载
    }

    // 重新选择面试官
    'Report.Retry'(event) {
        event.preventDefault();
        toast('返回面试官选择');
        setTimeout(() => {
            window.location.href = '../pages/choose_interviewer.html';
        }, 1000);
    }

    // 重新开始
    'Report.Restart'(event) {
        event.preventDefault();
        this.state.clear();
        toast('返回岗位选择');
        setTimeout(() => {
            window.location.href = '../pages/select_role.html';
        }, 1000);
    }

    // 验证简历文件
    validateResumeFile(file) {
        const allowedTypes = ['application/pdf', 
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            'text/markdown'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|docx|md)$/i)) {
            toast('不支持的文件格式，请上传PDF、DOCX或MD文件');
            return false;
        }

        if (file.size > maxSize) {
            toast('文件大小不能超过10MB');
            return false;
        }

        return true;
    }

    // 生成报告数据
    generateReport() {
        const session = this.state.getCurrentState().session;
        const steps = session.steps;

        // 计算维度平均分
        const dimScores = { Comm: 0, Tech: 0, Logic: 0, Stress: 0 };
        let scoreCount = { Comm: 0, Tech: 0, Logic: 0, Stress: 0 };

        steps.forEach(step => {
            Object.entries(step.scores).forEach(([dim, score]) => {
                dimScores[dim] += score;
                scoreCount[dim]++;
            });
        });

        const averages = {};
        Object.keys(dimScores).forEach(dim => {
            averages[dim] = scoreCount[dim] > 0 ? 
                (dimScores[dim] / scoreCount[dim]).toFixed(1) : 0;
        });

        // 计算总体评分
        const overall = Object.values(averages).reduce((sum, score) => sum + parseFloat(score), 0) / 
                       Object.values(averages).filter(score => score > 0).length;

        // 生成建议
        const advice = this.generateAdvice(averages);

        return {
            overall: overall.toFixed(1),
            dims: averages,
            advice: advice
        };
    }

    // 生成改进建议
    generateAdvice(scores) {
        const advice = [];
        
        if (scores.Comm < 7) {
            advice.push('沟通表达：建议多使用STAR法则组织回答，提升表达条理性');
        }
        if (scores.Tech < 7) {
            advice.push('技术深度：在项目描述中可以更深入讨论技术选型和架构思考');
        }
        if (scores.Logic < 7) {
            advice.push('逻辑思维：回答问题时可先构建框架，再填充细节');
        }
        if (scores.Stress < 7) {
            advice.push('抗压能力：在压力问题面前保持冷静，多展示解决问题的思路');
        }

        if (advice.length === 0) {
            advice.push('整体表现优秀，继续保持！可在具体案例中增加量化成果展示');
        }

        return advice.join('\n\n');
    }
}

// 初始化动作处理器
document.addEventListener('DOMContentLoaded', () => {
    window.candidateActions = new CandidateActions();
});