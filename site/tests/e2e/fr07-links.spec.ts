import { expect, test } from "@playwright/test";

test("FR-07 project page links to related writing", async ({ page }) => {
  await page.goto("/projects/proof-of-work-hub");
  await expect(page.getByRole("heading", { name: /related writing/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /proof before promise/i })).toBeVisible();
});

test("FR-07 writing page links to related project", async ({ page }) => {
  await page.goto("/writing/proof-before-promise");
  await expect(page.getByRole("heading", { name: /related projects/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /proof of work hub/i })).toBeVisible();
});
