import { expect, test } from "@playwright/test";

test("FR-03 writing stream is available", async ({ page }) => {
  await page.goto("/writing");
  await expect(page.getByRole("heading", { name: /point-of-view writing stream/i })).toBeVisible();
});

test("FR-03 tag filter updates visible writing cards", async ({ page }) => {
  await page.goto("/writing");
  await page.getByRole("button", { name: "#ai" }).click();
  await expect(page.locator(".writing-card:visible")).toHaveCount(2);
});
