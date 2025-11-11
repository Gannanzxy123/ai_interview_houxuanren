import { test, expect } from '@playwright/test';

const base = process.env.SUT_URL || 'http://localhost:8080';
const pageUrl = base + '/pages/simulate_training.html';

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

test.describe('Simulated interview flow', () => {
  test('rating/skip/next/report rules', async ({ page }) => {
    await page.goto(pageUrl);

    const nextBtn = page.locator('[data-action="Sim.Answer.Next"]');
    const skipBtn = page.locator('[data-action="Sim.Skip"]');
    const endBtn  = page.locator('[data-action="Sim.End"]');
    const answer  = page.locator('#answerInput');
    const report  = page.locator('#reportSection');
    const progress = page.locator('#progressText');

    // init visible
    await expect(progress).toBeVisible();

    // Case 1: 评分=0 时下一题被阻止
    await setAllSliders(page, 0);
    const p1 = await progress.textContent();
    await nextBtn.click();
    await page.waitForTimeout(300);
    await expect(progress).toHaveText(p1!);

    // Case 2: 评分>0 且答案为空 -> 下一题推进
    await setAllSliders(page, 3);
    const p2a = await progress.textContent();
    await answer.fill('');
    await nextBtn.click();
    await page.waitForTimeout(300);
    const p2b = await progress.textContent();
    expect(p2b).not.toEqual(p2a);

    // Case 3: 跳过需评分>0，否则阻止
    await setAllSliders(page, 0);
    const p3 = await progress.textContent();
    await skipBtn.click();
    await page.waitForTimeout(300);
    await expect(progress).toHaveText(p3!);
    await setAllSliders(page, 4);
    await skipBtn.click();
    await page.waitForTimeout(300);
    const p3b = await progress.textContent();
    expect(p3b).not.toEqual(p3);

    // 快速推进到最后一题
    for (let i = 0; i < 10; i++) {
      if (await report.isVisible()) break;
      const skipVisible = await skipBtn.isVisible().catch(() => false);
      if (!skipVisible) break;
      await setAllSliders(page, 5);
      await answer.fill('');
      await nextBtn.click();
      await page.waitForTimeout(200);
    }

    // Case 4: 最后一题按钮/隐藏状态
    await expect(skipBtn).toBeHidden();
    await expect(endBtn).toBeHidden();
    await expect(nextBtn).toHaveText(/提交并生成报告/);

    // Case 5: 最后一题答案必填
    await setAllSliders(page, 6);
    await answer.fill('');
    await nextBtn.click();
    await page.waitForTimeout(400);
    await expect(report).toBeHidden();

    await answer.fill('我的回答');
    await nextBtn.click();
    await page.waitForTimeout(600);
    await expect(report).toBeVisible();
  });
});


