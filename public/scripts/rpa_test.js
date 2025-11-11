(function(){
  async function runRpa(){
    function createLog(){
      var host = document.createElement('div');
      host.style.cssText = 'position:fixed;right:12px;bottom:12px;width:360px;max-height:60vh;overflow:auto;background:#fff;border:1px solid #e1e4e8;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,0.15);font:14px/1.4 system-ui,Segoe UI,Arial;padding:10px;z-index:99999;';
      host.innerHTML = '<div style="font-weight:700;margin-bottom:6px;">RPA 自动化测试</div><div id="rpa-log"></div>';
      document.body.appendChild(host);
      return host.querySelector('#rpa-log');
    }
    function sleep(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }
    var logBox = createLog(); var pass=0, fail=0;
    function log(ok, msg){ var row=document.createElement('div'); row.style.color = ok? '#2e7d32':'#c62828'; row.textContent = (ok? '[PASS] ':'[FAIL] ') + msg; logBox.appendChild(row); if(ok) pass++; else fail++; }
    function getIdx(){ return window.currentQuestionIndex; }
    function getLen(){ return Array.isArray(window.questions)? window.questions.length : 0; }
    function clickAction(a){ var el=document.querySelector('[data-action="'+a+'"]'); if(el){ el.click(); return true } return false }
    async function setAllSliders(val){ var list=document.querySelectorAll('.score-slider'); for(var i=0;i<list.length;i++){ var s=list[i]; s.value=val; s.dispatchEvent(new Event('input', {bubbles:true})); } await sleep(60); }
    async function setAnswer(txt){ var inp=document.getElementById('answerInput'); if(inp){ inp.value=txt; inp.dispatchEvent(new Event('input', {bubbles:true})); } await sleep(60); }

    for(var t=0;t<50;t++){ if(getLen()>0) break; await sleep(100); }
    log(getLen()>0, '初始化题目数: '+getLen());

    await setAllSliders(0); var i1=getIdx(); clickAction('Sim.Answer.Next'); await sleep(300);
    log(getIdx()===i1, '评分为0时，下一题被阻止');

    await setAllSliders(3); var i2=getIdx(); await setAnswer(''); clickAction('Sim.Answer.Next'); await sleep(300);
    log(getIdx()===i2+1, '评分>0且答案为空：前进到下一题');

    await setAllSliders(0); var i3=getIdx(); clickAction('Sim.Skip'); await sleep(300);
    log(getIdx()===i3, '评分为0时，跳过被阻止');
    await setAllSliders(4); clickAction('Sim.Skip'); await sleep(300);
    log(getIdx()===i3+1, '评分>0时，跳过推进');

    while(getIdx() < getLen()-1){ await setAllSliders(5); await setAnswer(''); clickAction('Sim.Answer.Next'); await sleep(220); }
    var skipBtn=document.querySelector('[data-action="Sim.Skip"]');
    var endBtn=document.querySelector('[data-action="Sim.End"]');
    var nextBtn=document.querySelector('[data-action="Sim.Answer.Next"]');
    log(skipBtn && skipBtn.style.display==='none', '最后一题：跳过隐藏');
    log(endBtn && endBtn.style.display==='none', '最后一题：结束面试隐藏');
    log(nextBtn && /提交并生成报告/.test(nextBtn.textContent), '最后一题：下一题按钮改为提交并生成报告');

    await setAllSliders(6); await setAnswer(''); var iLast=getIdx(); clickAction('Sim.Answer.Next'); await sleep(400);
    var reportVisible1 = document.getElementById('reportSection').style.display==='block';
    log(!reportVisible1 && getIdx()===iLast, '最后一题：未填答案不提交，不进入报告');

    await setAnswer('我的回答'); clickAction('Sim.Answer.Next'); await sleep(400);
    var reportVisible2 = document.getElementById('reportSection').style.display==='block';
    log(reportVisible2, '最后一题：填写答案并提交后进入报告');

    var summary=document.createElement('div'); summary.style.cssText='margin-top:8px;border-top:1px solid #eee;padding-top:6px;';
    summary.textContent = '完成：通过 '+pass+' 项，失败 '+fail+' 项';
    logBox.appendChild(summary);
  }
  if (new URLSearchParams(window.location.search).get('rpa')==='1'){
    window.addEventListener('DOMContentLoaded', function(){ setTimeout(runRpa, 400); });
  }
})();
