// 问题生成脚本
class QuestionGenerator {
    constructor() {
        this.questionTemplates = {
            HR: [
                "请简单介绍一下您自己，并说明为什么对这个岗位感兴趣？",
                "您的职业规划是什么？未来3-5年希望达到什么样的目标？",
                "为什么选择离开当前/上一家公司？",
                "您如何看待工作与生活的平衡？",
                "在团队合作中，您通常扮演什么角色？"
            ],
            Tech: [
                "请描述一个您解决过的技术难题，您是如何分析和解决的？",
                "在您的技术栈中，最擅长的是哪一部分？为什么？",
                "请谈谈您对[技术领域]最新发展趋势的看法？",
                "在项目开发中，您如何进行代码质量保证？",
                "请描述一个您主导或参与的技术架构设计案例？"
            ],
            Manager: [
                "在团队合作中遇到意见分歧时，您通常会如何处理？",
                "请举例说明您如何带领团队完成一个具有挑战性的目标？",
                "您如何评估团队成员的绩效？",
                "当项目进度出现风险时，您会采取什么措施？",
                "请描述您的一次成功的人员管理经验？"
            ],
            Stress: [
                "如果您的项目进度严重滞后，您会采取什么措施来追赶进度？",
                "当您的技术方案被团队成员质疑时，您会如何应对？",
                "请描述一次您处理紧急线上事故的经历？",
                "如果您的直接上级对您的工作不满意，您会怎么做？",
                "在资源有限的情况下，您如何平衡多个项目的优先级？"
            ]
        };

        this.resumeKeywords = {
            'React': ['请谈谈您在React项目中的状态管理经验？', 'React Hooks在实际项目中的应用场景？'],
            'Vue': ['Vue 2和Vue 3的主要区别是什么？', '请分享Vue项目性能优化的经验？'],
            'TypeScript': ['TypeScript在大型项目中的优势体现在哪些方面？', '请谈谈TypeScript的泛型应用？'],
            'Java': ['Java并发编程中需要注意哪些问题？', 'JVM调优有哪些实践经验？'],
            'Spring': ['Spring Boot的自动配置原理是什么？', 'Spring Cloud在微服务架构中的作用？'],
            '算法': ['请描述一个您解决过的复杂算法问题？', '在实际项目中如何平衡算法复杂度和业务需求？'],
            '架构': ['请谈谈您在系统架构设计方面的经验？', '微服务架构的优缺点有哪些？']
        };
    }

    generateQuestions(job, interviewers, resumeInfo = null) {
        let questions = [];
        
        // 根据面试官类型生成问题
        interviewers.forEach(type => {
            const typeQuestions = this.questionTemplates[type] || [];
            const selectedQuestions = this.selectRandomQuestions(typeQuestions, 2);
            questions.push(...selectedQuestions.map(q => ({ type, text: q })));
        });

        // 基于简历关键词生成追问问题
        if (resumeInfo) {
            const resumeQuestions = this.generateResumeQuestions(resumeInfo.name);
            if (resumeQuestions.length > 0) {
                questions.push(...resumeQuestions.slice(0, 2));
            }
        }

        return this.shuffleArray(questions);
    }

    selectRandomQuestions(questions, count) {
        const shuffled = [...questions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, questions.length));
    }

    generateResumeQuestions(filename) {
        const questions = [];
        const lowerFilename = filename.toLowerCase();

        Object.entries(this.resumeKeywords).forEach(([keyword, keywordQuestions]) => {
            if (lowerFilename.includes(keyword.toLowerCase()) || 
                filename.includes(keyword)) {
                questions.push({
                    type: 'Tech',
                    text: this.selectRandomQuestions(keywordQuestions, 1)[0]
                });
            }
        });

        return questions;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

// 全局问题生成器
window.questionGenerator = new QuestionGenerator();

// 生成问题的便捷函数
window.generateQuestions = function(job, interviewers, resumeInfo) {
    return window.questionGenerator.generateQuestions(job, interviewers, resumeInfo);
};