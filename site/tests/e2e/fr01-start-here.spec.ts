import { expect, test } from "@playwright/test";

test("FR-01 shows four intent cards", async ({ page }) => {
  await page.goto("/start-here");
  const cards = page.locator(".intent-card");
  await expect(cards).toHaveCount(4);
});

test("FR-01 intent card routes to filtered proof hub", async ({ page }) => {
  await page.goto("/start-here");
  await page.getByRole("link", { name: /hire terence to build/i }).click();
  await expect(page).toHaveURL(/\/projects\?hat=Builder/);
});
