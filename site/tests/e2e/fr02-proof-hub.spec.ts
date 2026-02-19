import { expect, test } from "@playwright/test";

test("FR-02 renders at least six flagship case cards", async ({ page }) => {
  await page.goto("/projects");
  await expect(page.locator(".project-card")).toHaveCount(6);
});

test("FR-02 role hat filter narrows card set", async ({ page }) => {
  await page.goto("/projects");
  await page.getByRole("button", { name: "Operator" }).click();
  const visibleCards = page.locator(".project-card:visible");
  await expect(visibleCards).toHaveCount(2);
});
