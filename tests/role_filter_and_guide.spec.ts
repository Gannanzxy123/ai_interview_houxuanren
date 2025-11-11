import { test, expect } from '@playwright/test';

const base = process.env.SUT_URL || 'http://localhost:8080';

test('Role search and filter affect results', async ({ page }) => {
  await page.goto(base + '/pages/select_role.html');
  await page.waitForSelector('#rolesContainer');

  const cards = page.locator('.role-card');
  const initial = await cards.count();
  expect(initial).toBeGreaterThan(0);

  // 点击“技术”筛选
  await page.locator('.filter-btn[data-filter="tech"]').click();
  await page.waitForTimeout(200);
  const afterTech = await cards.count();
  expect(afterTech).toBeGreaterThan(0);

  // 搜索关键字：前端
  const search = page.locator('[data-test="role-search-input"]');
  await search.fill('前端');
  await page.waitForTimeout(200);
  const afterSearch = await cards.count();
  expect(afterSearch).toBeGreaterThan(0);
});

test('Guide toast appears with ?guide=1', async ({ page }) => {
  await page.goto(base + '/pages/simulate_training.html?guide=1');
  // 等待 toast 出现
  const toast = page.locator('.toast-message');
  await toast.waitFor({ state: 'visible', timeout: 3000 });
  await expect(toast).toBeVisible();
});

test('Start blocked when preconditions not met', async ({ page }) => {
  await page.goto(base + '/pages/choose_interviewer.html');
  // 未选择任何面试官直接点击开始
  const startBtn = page.locator('[data-action="Sim.Start"]');
  await startBtn.click();
  // 应显示错误提示 toast
  const toast = page.locator('.toast-message');
  await toast.waitFor({ state: 'visible', timeout: 2000 });
  await expect(toast).toBeVisible();
});
