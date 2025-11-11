// 候选人流程状态管理
class CandidateFlowState {
    constructor() {
        this.storageKey = 'candidateFlow';
        this.state = this.loadState();
    }

    loadState() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            return JSON.parse(stored);
        }
        return {
            job: null,
            resume: null,
            interviewers: [],
            session: {
                startedAt: null,
                steps: []
            },
            report: null
        };
    }

    saveState() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    }

    setJob(jobId, jobTitle) {
        this.state.job = { id: jobId, title: jobTitle };
        this.saveState();
    }

    setResume(fileData) {
        this.state.resume = {
            name: fileData.name,
            size: fileData.size,
            type: fileData.type
        };
        this.saveState();
    }

    setInterviewers(types) {
        this.state.interviewers = types;
        this.saveState();
    }

    startSession() {
        this.state.session.startedAt = new Date().toISOString();
        this.state.session.steps = [];
        this.saveState();
    }

    addStep(question, answer, scores, timeSpent) {
        this.state.session.steps.push({
            q: question,
            a: answer,
            time: timeSpent,
            scores: scores || {}
        });
        this.saveState();
    }

    setReport(reportData) {
        this.state.report = reportData;
        this.saveState();
    }

    clear() {
        this.state = {
            job: null,
            resume: null,
            interviewers: [],
            session: {
                startedAt: null,
                steps: []
            },
            report: null
        };
        this.saveState();
    }

    getCurrentState() {
        return this.state;
    }
}

// 全局状态实例
window.candidateFlowState = new CandidateFlowState();