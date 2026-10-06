const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('abre em PT-BR e cria uma experiência demonstrativa por Riot ID', async ({ page }) => {
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.getByRole('heading', { name: /Sua conta tem uma história/i })).toBeVisible();

  await page.locator('#game-name').fill('HelioConde');
  await page.locator('#tag-line').fill('BR1');
  await page.getByRole('button', { name: /Ver meu legado/i }).click();

  await expect(page.locator('#profile-view')).toBeVisible();
  await expect(page.locator('#profile-riot-id')).toContainText('HelioConde#BR1');
  await expect(page.locator('#demo-badge')).toBeVisible();
  await expect(page).toHaveURL(/riotId=HelioConde%23BR1/);
});

test('troca para inglês, persiste e mantém o perfil navegável', async ({ page }) => {
  await page.locator('[data-language="en"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { name: /Your account has a story/i })).toBeVisible();

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  await page.locator('#game-name').fill('LegacyPlayer');
  await page.locator('#tag-line').fill('NA1');
  await page.getByRole('button', { name: /View my legacy/i }).click();
  await page.getByRole('button', { name: 'TFT' }).click();
  await expect(page.locator('#panel-tft')).toBeVisible();
});

test('deep link restaura o perfil demonstrativo', async ({ page }) => {
  await page.goto('/?riotId=DeepLink%23BR1&region=americas');
  await expect(page.locator('#profile-view')).toBeVisible();
  await expect(page.locator('#profile-riot-id')).toContainText('DeepLink#BR1');
});

test('mobile não cria overflow horizontal crítico', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/');
  const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
  expect(bodyWidth).toBeLessThanOrEqual(361);
});
