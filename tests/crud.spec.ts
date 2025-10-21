import { test, expect } from "@playwright/test";

test("Save generated output to DB then appears in /outputs", async ({ page }) => {
  await page.goto("/tabs");

  // Create 1 tab & Generate
  await page.getByRole("button", { name: /Add Tab/i }).click();
  await page.getByPlaceholder(/Tab title/i).fill("Result A");
  await page.getByPlaceholder(/Tab content/i).fill("Body A");
  await page.getByRole("button", { name: /Generate/i }).click();

  // Process prompt (title) before click Save
  page.on("dialog", async (dialog) => {
    await dialog.accept("E2E Sample Title");
  });

  await page.getByRole("button", { name: /Save to DB/i }).click();

  // Open list and check recored
  await page.goto("/outputs");
  await expect(page.getByText(/E2E Sample Title/i)).toBeVisible();
});
