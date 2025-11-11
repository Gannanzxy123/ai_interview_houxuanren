// 鍊欓€変汉娴佺▼鍔ㄤ綔澶勭悊
class CandidateActions {
    constructor() {
        this.state = window.candidateFlowState;
    }

    // 鍏ュ彛寮€濮?
    'Portal.Start'(event) {
        event.preventDefault();
        toast('寮€濮嬫ā鎷熼潰璇曟祦绋?);
        setTimeout(() => {
            window.location.href = '../pages/select_role.html';
        }, 1000);
    }

    // 閫夋嫨宀椾綅
    'Role.Select'(event) {
        event.preventDefault();
        const button = event.target;
        const roleId = button.dataset.roleId;
        const roleCard = button.closest('.role-card');
        const roleTitle = roleCard.querySelector('.role-title').textContent;

        // 淇濆瓨宀椾綅閫夋嫨
        this.state.setJob(roleId, roleTitle);
        
        toast(`宸查€夋嫨宀椾綅: ${roleTitle}`);
        setTimeout(() => {
            window.location.href = '../pages/upload_resume.html';
        }, 1500);
    }

    // 涓婁紶绠€鍘?
    'Resume.Upload'(event) {
        const fileInput = event.target;
        if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            
            // 楠岃瘉鏂囦欢
            if (!this.validateResumeFile(file)) {
                return;
            }

            // 淇濆瓨绠€鍘嗕俊鎭?
            this.state.setResume(file);
            toast('绠€鍘嗕笂浼犳垚鍔?);
        }
    }

    // 鍒犻櫎绠€鍘?
    'Resume.Remove'(event) {
        event.preventDefault();
        this.state.setResume(null);
        document.querySelector('.file-input').value = '';
        document.getElementById('nextBtn').disabled = true;
        toast('绠€鍘嗗凡鍒犻櫎');
    }

    // 缁х画涓嬩竴姝ワ紙绠€鍘嗭級
    'Resume.Upload.Next'(event) {
        event.preventDefault();
        if (!this.state.getCurrentState().resume) {
            toast('璇峰厛涓婁紶绠€鍘嗘枃浠?);
            return;
        }
        
        toast('绠€鍘嗛獙璇侀€氳繃锛岃繘鍏ラ潰璇曞畼閫夋嫨');
        setTimeout(() => {
            window.location.href = '../pages/choose_interviewer.html';
        }, 1000);
    }

    // 寮€濮嬫ā鎷熻缁?
    'Sim.Start'(event) {
        event.preventDefault();
        const currentState = this.state.getCurrentState();
        
        if (!currentState.job) {
            toast('璇峰厛閫夋嫨宀椾綅');
            return;
        }
        if (!currentState.resume) {
            toast('璇峰厛涓婁紶绠€鍘?);
            return;
        }
        if (currentState.interviewers.length === 0) {
            toast('璇烽€夋嫨鑷冲皯涓€绉嶉潰璇曞畼绫诲瀷');
            return;
        }

        this.state.startSession();
        toast('妯℃嫙闈㈣瘯寮€濮嬶紒');
        setTimeout(() => {
            window.location.href = '../pages/simulate_training.html';
        }, 1500);
    }

    // 涓嬩竴棰?
    'Sim.Answer.Next'(event) {
        event.preventDefault();
        if (window.setActionsDisabled) window.setActionsDisabled(true);
        
        console.log('=== 鐐瑰嚮"涓嬩竴棰?鎸夐挳 ===');
        
        const answerInput = document.getElementById('answerInput');
        const answer = answerInput.value.trim();
        
        console.log('1. 鍥炵瓟鍐呭:', answer || '(绌?');
        
        if (!answer) {
            let isLast = false;
            try {
                if (typeof window.currentQuestionIndex === 'number' && Array.isArray(window.questions)) {
                    isLast = window.questions.length > 0 && window.currentQuestionIndex === window.questions.length - 1;
                }
            } catch (e) {}
            if (isLast) {
                // On last question, require an answer to submit
                toast('请填写答案以提交报告');
                                const input = document.getElementById('answerInput');
                if (input) {
                    try { input.focus({ preventScroll: false }); } catch(e) { try { input.focus(); } catch(_e) {} }
                    try { input.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch(e) {}
                    const prevBorder = input.style.borderColor;
                    const prevShadow = input.style.boxShadow;
                    input.style.borderColor = '#e74c3c';
                    input.style.boxShadow = '0 0 0 3px rgba(231,76,60,0.2)';
                    setTimeout(() => { input.style.borderColor = prevBorder; input.style.boxShadow = prevShadow; }, 1200);
                }if (window.setActionsDisabled) window.setActionsDisabled(false);
                return;
            }
            // Otherwise, treat empty as skip
            const currentQuestion = document.getElementById('questionText').textContent;
            if (this.state && typeof this.state.addStep === 'function') {
                this.state.addStep(currentQuestion, '[跳过]', {}, 0);
            }
            if (typeof window.currentQuestionIndex !== 'undefined') {
                window.currentQuestionIndex++;
                if (typeof window.updateQuestionDisplay === 'function') {
                    window.updateQuestionDisplay();
                }
            }
            toast('未填写，已跳过下一题');
            console.log('2. 回答为空，按跳过处理');
            return;
        }

        // 鏀堕泦璇勫垎
        const scores = {};
        document.querySelectorAll('.score-slider').forEach(slider => {
            const dimension = slider.dataset.dimension;
            scores[dimension] = parseInt(slider.value);
        });        // 校验评分滑块已拖动（所有题目）
        let allValid = true;
        const sliders = document.querySelectorAll('.score-slider');
        sliders.forEach(slider => { if (parseInt(slider.value) <= 0) { allValid = false; } });
        if (!allValid) {\n            toast('请将所有评分滑块拖动到大于 0 的分值');\n            if (window.setActionsDisabled) window.setActionsDisabled(false);\n            try {\n                const first = Array.from(sliders).find(s => parseInt(s.value) <= 0) || sliders[0];\n                if (first) {\n                    first.focus();\n                    try { first.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch(e) {}\n                }\n            } catch (e) {}\n            return;\n        }
        console.log('3. 鏀堕泦鐨勮瘎鍒?', scores);

        // 淇濆瓨姝ラ
        const currentQuestion = document.getElementById('questionText').textContent;
        this.state.addStep(currentQuestion, answer, scores, 120); // 妯℃嫙鏃堕棿
        console.log('4. 宸蹭繚瀛樺埌state');

        // 绉诲姩鍒颁笅涓€棰?
        console.log('5. 妫€鏌?currentQuestionIndex:', typeof window.currentQuestionIndex);
        console.log('6. 妫€鏌?updateQuestionDisplay:', typeof window.updateQuestionDisplay);
        
        if (typeof window.currentQuestionIndex !== 'undefined') {
            window.currentQuestionIndex++;
            console.log('7. currentQuestionIndex 宸插鍔犲埌:', window.currentQuestionIndex);
            
            if (typeof window.updateQuestionDisplay === 'function') {
                console.log('8. 璋冪敤 updateQuestionDisplay()');
                window.updateQuestionDisplay();
            } else {
                console.error('鉂?updateQuestionDisplay 涓嶆槸鍑芥暟锛?);
                toast('鍒囨崲闂澶辫触锛岃鍒锋柊椤甸潰');
            }
        } else {
            console.error('鉂?currentQuestionIndex 鏈畾涔夛紒');
            toast('椤甸潰鐘舵€侀敊璇紝璇峰埛鏂伴〉闈?);
        }

        toast('鍥炵瓟宸蹭繚瀛橈紝鍒囨崲鍒颁笅涓€棰?);
        console.log('=== "涓嬩竴棰?澶勭悊瀹屾垚 ===');
    }

    // 璺宠繃闂
    'Sim.Skip'(event) {
        event.preventDefault();
        if (window.setActionsDisabled) window.setActionsDisabled(true);        // 校验评分滑块已拖动（跳过同样要求）
        let __allValid = true;
        const __sliders = document.querySelectorAll('.score-slider');
        __sliders.forEach(slider => { if (parseInt(slider.value) <= 0) { __allValid = false; } });
        if (!__allValid) {\n            toast('请将所有评分滑块拖动到大于 0 的分值后再跳过');\n            if (window.setActionsDisabled) window.setActionsDisabled(false);\n            try {\n                const __first = Array.from(__sliders).find(s => parseInt(s.value) <= 0) || __sliders[0];\n                if (__first) {\n                    __first.focus();\n                    try { __first.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch(e) {}\n                }\n            } catch (e) {}\n            return;\n        }
        
        console.log('=== 鐐瑰嚮"璺宠繃"鎸夐挳 ===');
        
        // 淇濆瓨璺宠繃璁板綍
        const currentQuestion = document.getElementById('questionText').textContent;
        console.log('1. 褰撳墠闂:', currentQuestion);
        
        this.state.addStep(currentQuestion, '[璺宠繃]', {}, 0);
        console.log('2. 宸蹭繚瀛樿烦杩囪褰?);

        // 绉诲姩鍒颁笅涓€棰?
        console.log('3. 妫€鏌?currentQuestionIndex:', typeof window.currentQuestionIndex);
        console.log('4. 妫€鏌?updateQuestionDisplay:', typeof window.updateQuestionDisplay);
        
        if (typeof window.currentQuestionIndex !== 'undefined') {
            window.currentQuestionIndex++;
            console.log('5. currentQuestionIndex 宸插鍔犲埌:', window.currentQuestionIndex);
            
            if (typeof window.updateQuestionDisplay === 'function') {
                console.log('6. 璋冪敤 updateQuestionDisplay()');
                window.updateQuestionDisplay();
            } else {
                console.error('鉂?updateQuestionDisplay 涓嶆槸鍑芥暟锛?);
                toast('鍒囨崲闂澶辫触锛岃鍒锋柊椤甸潰');
            }
        } else {
            console.error('鉂?currentQuestionIndex 鏈畾涔夛紒');
            toast('椤甸潰鐘舵€侀敊璇紝璇峰埛鏂伴〉闈?);
        }

        toast('闂宸茶烦杩囷紝鍒囨崲鍒颁笅涓€棰?);
        console.log('=== "璺宠繃"澶勭悊瀹屾垚 ===');
    }

    // 缁撴潫闈㈣瘯
    'Sim.End'(event) {
        event.preventDefault();
        let __msg = '确定要结束面试吗？将生成评估报告。';
        try {
            if (typeof window.currentQuestionIndex === 'number' && Array.isArray(window.questions)) {
                if (window.questions.length > 0 && window.currentQuestionIndex < window.questions.length - 1) {
                    __msg = `当前还未到最后一题（第 ${window.currentQuestionIndex + 1}/${window.questions.length} 题）。确认要提前结束并生成报告吗？`;
                }
            }
        } catch (e) {}
        if (confirm(__msg)) {
            if (typeof window.endInterview === 'function') {
                window.endInterview();
            }
            const reportData = this.generateReport();
            this.state.setReport(reportData);
            toast('面试结束，生成评估报告中...');
        }
    }

    // 淇濆瓨鎶ュ憡
    'Report.Save'(event) {
        event.preventDefault();
        toast('鎶ュ憡瀵煎嚭鍔熻兘寮€鍙戜腑...');
        // 瀹為檯搴旇鐢熸垚PDF骞朵笅杞?
    }

    // 閲嶆柊閫夋嫨闈㈣瘯瀹?
    'Report.Retry'(event) {
        event.preventDefault();
        toast('杩斿洖闈㈣瘯瀹橀€夋嫨');
        setTimeout(() => {
            window.location.href = '../pages/choose_interviewer.html';
        }, 1000);
    }

    // 閲嶆柊寮€濮?
    'Report.Restart'(event) {
        event.preventDefault();
        this.state.clear();
        toast('杩斿洖宀椾綅閫夋嫨');
        setTimeout(() => {
            window.location.href = '../pages/select_role.html';
        }, 1000);
    }

    // 楠岃瘉绠€鍘嗘枃浠?
    validateResumeFile(file) {
        const allowedTypes = ['application/pdf', 
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            'text/markdown'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|docx|md)$/i)) {
            toast('涓嶆敮鎸佺殑鏂囦欢鏍煎紡锛岃涓婁紶PDF銆丏OCX鎴朚D鏂囦欢');
            return false;
        }

        if (file.size > maxSize) {
            toast('鏂囦欢澶у皬涓嶈兘瓒呰繃10MB');
            return false;
        }

        return true;
    }

    // 鐢熸垚鎶ュ憡鏁版嵁
    generateReport() {
        const session = this.state.getCurrentState().session;
        const steps = session.steps;

        // 璁＄畻缁村害骞冲潎鍒?
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

        // 璁＄畻鎬讳綋璇勫垎
        const overall = Object.values(averages).reduce((sum, score) => sum + parseFloat(score), 0) / 
                       Object.values(averages).filter(score => score > 0).length;

        // 鐢熸垚寤鸿
        const advice = this.generateAdvice(averages);

        return {
            overall: overall.toFixed(1),
            dims: averages,
            advice: advice
        };
    }

    // 鐢熸垚鏀硅繘寤鸿
    generateAdvice(scores) {
        const advice = [];
        
        if (scores.Comm < 7) {
            advice.push('娌熼€氳〃杈撅細寤鸿澶氫娇鐢⊿TAR娉曞垯缁勭粐鍥炵瓟锛屾彁鍗囪〃杈炬潯鐞嗘€?);
        }
        if (scores.Tech < 7) {
            advice.push('鎶€鏈繁搴︼細鍦ㄩ」鐩弿杩颁腑鍙互鏇存繁鍏ヨ璁烘妧鏈€夊瀷鍜屾灦鏋勬€濊€?);
        }
        if (scores.Logic < 7) {
            advice.push('閫昏緫鎬濈淮锛氬洖绛旈棶棰樻椂鍙厛鏋勫缓妗嗘灦锛屽啀濉厖缁嗚妭');
        }
        if (scores.Stress < 7) {
            advice.push('鎶楀帇鑳藉姏锛氬湪鍘嬪姏闂闈㈠墠淇濇寔鍐烽潤锛屽灞曠ず瑙ｅ喅闂鐨勬€濊矾');
        }

        if (advice.length === 0) {
            advice.push('鏁翠綋琛ㄧ幇浼樼锛岀户缁繚鎸侊紒鍙湪鍏蜂綋妗堜緥涓鍔犻噺鍖栨垚鏋滃睍绀?);
        }

        return advice.join('\n\n');
    }
}

// 鍒濆鍖栧姩浣滃鐞嗗櫒
document.addEventListener('DOMContentLoaded', () => {
    window.candidateActions = new CandidateActions();
});










