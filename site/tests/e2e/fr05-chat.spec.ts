import { expect, test } from "@playwright/test";

test("FR-05 chat orb opens panel", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /terence ai/i }).click();
  await expect(page.getByRole("heading", { name: "Terence AI" })).toBeVisible();
});

test("FR-05 chat sends request and renders answer", async ({ page }) => {
  await page.route("**/api/chat.json", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        answer: "Grounded response",
        links: [{ href: "/projects/start-here-router", label: "Start Here Router" }],
      }),
    });
  });

  await page.goto("/");
  await page.getByRole("button", { name: /terence ai/i }).click();
  await page.getByLabel("Ask Terence AI").fill("What is the routing model?");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByText("Grounded response")).toBeVisible();
});
