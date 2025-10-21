import { test, expect, Page } from "@playwright/test";

async function addTab(page: Page, title: string, content: string) {
  await page.getByRole("button", { name: /Add Tab/i }).click();
  await page.getByPlaceholder(/Tab title/i).fill(title);
  await page.getByPlaceholder(/Tab content/i).fill(content);
}

test("Generate with 3 examples and verify output", async ({ page }) => {
  await page.goto("/tabs");

  await addTab(page, "Intro", "Hello class!");
  await addTab(page, "About", "This is about section.");
  await addTab(page, "FAQ", "Q: Why? A: Because.");

  await page.getByRole("button", { name: /Generate/i }).click();

  // Lấy text từ vùng output (textarea/ pre/ #output/ #output-area)
  const out = await page.locator("textarea, pre, #output, #output-area").textContent();

  expect(out || "").toContain("<!DOCTYPE html>");
  expect(out || "").toContain("Intro");
  expect(out || "").toContain("About");
  expect(out || "").toContain("FAQ");
});
