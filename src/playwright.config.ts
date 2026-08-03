import { defineConfig, devices } from "@playwright/test";

const configuredBaseUrl = process.env.PLAYWRIGHT_BASE_URL;

if (!configuredBaseUrl) {
    throw new Error("PLAYWRIGHT_BASE_URL must point to a local preview or deployed environment.");
}

const baseURL = /^https?:\/\//u.test(configuredBaseUrl) ? configuredBaseUrl : `https://${configuredBaseUrl}`;

export default defineConfig({
    testDir: "./tests/e2e",
    outputDir: "test-results",
    timeout: 30_000,
    expect: { timeout: 5_000 },
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
    use: { baseURL, colorScheme: "light", trace: "retain-on-failure" },
    projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
