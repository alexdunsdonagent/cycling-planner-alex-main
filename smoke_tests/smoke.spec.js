import { test, expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.resolve(__dirname, "../dist/index.html");

// Simple smoke test - verify built app loads
test.describe("Cycling Planner Smoke Tests", () => {
  test("dist index.html exists and is valid", async () => {
    const fs = await import("fs");
    const html = fs.readFileSync(filePath, "utf8");
    expect(html).toContain("cycling");
  });
});
