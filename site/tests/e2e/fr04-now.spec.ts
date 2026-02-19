import { expect, test } from "@playwright/test";

test("FR-04 now page is live markdown", async ({ page }) => {
  await page.goto("/now");
  await expect(page.getByRole("heading", { name: "Now" })).toBeVisible();
});

test("FR-04 now page includes current section", async ({ page }) => {
  await page.goto("/now");
  await expect(page.getByRole("heading", { name: /what i am building/i })).toBeVisible();
});
