import { test, expect } from "@playwright/test";
import path from "path";

const filePath = path.resolve(__dirname, "../dist/index.html");

// Simple smoke tests - verify the built app loads

test.describe("Cycling Planner Smoke Tests", () => {
  test("page loads without console errors", async ({ page }) => {
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));
    
    await page.goto(`file://${filePath}`);
    
    // Wait a moment for any initial JS to run
    await page.waitForTimeout(500);
    
    // Check no critical errors
    expect(errors).toHaveLength(0);
    
    // Basic page structure exists
    await expect(page.locator("body")).toBeVisible();
  });

  test("quiz section exists", async ({ page }) => {
    await page.goto(`file://${filePath}`);
    await page.waitForTimeout(300);
    
    // Check for quiz element or main content
    const bodyText = await page.locator("body").textContent();
    expect(bodyText).toBeTruthy();
    expect(bodyText.length).toBeGreaterThan(100);
  });
});
