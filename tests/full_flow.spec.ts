import { test, expect } from '@playwright/test';

const base = process.env.SUT_URL || 'http://localhost:8080';

async function setAllSliders(page, val: number) {
  const sliders = page.locator('.score-slider');
  const n = await sliders.count();
  for (let i = 0; i < n; i++) {
    const s = sliders.nth(i);
    await s.evaluate((el, v) => {
      (el as HTMLInputElement).value = String(v);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }, val);
  }
}

test('Full flow: select role -> upload resume -> choose interviewers -> simulate', async ({ page }) => {
  // 1. 选择岗位
  await page.goto(base + '/pages/select_role.html');
  await page.waitForSelector('#rolesContainer');
  // 选择第一张岗位卡片的选择按钮（动态生成，模拟点击卡片）
  const firstRole = page.locator('.role-card').first();
  await firstRole.click();
  // 页面通过 delegate + actions.js 会跳转到 upload_resume.html
  await page.waitForURL(/upload_resume\.html/);

  // 2. 上传简历
  const fileInput = page.locator('#fileInput');
  await fileInput.setInputFiles('tests/fixtures/resume.md');
  // next 按钮应可用
  const nextResume = page.locator('[data-action="Resume.Upload.Next"]');
  await expect(nextResume).toBeEnabled();
  await nextResume.click();
  await page.waitForURL(/choose_interviewer\.html/);

  // 3. 选择面试官（选两个）
  const cards = page.locator('.interviewer-card');
  await cards.nth(0).click();
  await cards.nth(1).click();
  // 开始模拟
  const startBtn = page.locator('[data-action="Sim.Start"]');
  await expect(startBtn).toBeEnabled();
  await startBtn.click();
  await page.waitForURL(/simulate_training\.html/);

  // 4. 模拟训练：评分>0 且空答案推进两题，然后最后一题提交
  await setAllSliders(page, 5);
  await page.locator('[data-action="Sim.Answer.Next"]').click();
  await page.waitForTimeout(200);
  await setAllSliders(page, 6);
  await page.locator('[data-action="Sim.Answer.Next"]').click();

  // 到最后一题：按钮文案变化
  const nextBtn = page.locator('[data-action="Sim.Answer.Next"]');
  await expect(nextBtn).toHaveText(/提交并生成报告/);
  // 填答案并提交
  await setAllSliders(page, 7);
  await page.locator('#answerInput').fill('综合能力回答');
  await nextBtn.click();
  await page.waitForTimeout(400);
  await expect(page.locator('#reportSection')).toBeVisible();
});
