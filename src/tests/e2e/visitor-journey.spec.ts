import { expect, test as base } from "@playwright/test";

type RuntimeErrorFixtures = { runtimeErrors: string[] };

const test = base.extend<RuntimeErrorFixtures>({
    runtimeErrors: [
        async ({ page }, use) => {
            const errors: string[] = [];
            page.on("pageerror", (error) => errors.push(error.message));

            await use(errors);

            expect(errors, "Expected the hydrated app to run without uncaught page errors").toEqual([]);
        },
        { auto: true },
    ],
});

test.beforeEach(async ({ baseURL, page }) => {
    if (!baseURL) {
        throw new Error("The Playwright base URL is required.");
    }

    const targetOrigin = new URL(baseURL).origin;

    await page.route("**/*", async (route) => {
        const requestUrl = new URL(route.request().url());
        const isLocalResource = requestUrl.origin === targetOrigin || ["blob:", "data:"].includes(requestUrl.protocol);

        if (isLocalResource) {
            await route.continue();
            return;
        }

        await route.abort("blockedbyclient");
    });
});

test("navigates from home to an article and preserves browser history", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: /Hi.*I'm Logan/u })).toBeVisible();

    await page.evaluate(() => Object.defineProperty(window, "__playwrightHydrationMarker", { value: true }));
    await page.getByRole("link", { name: "Articles", exact: true }).click();

    await expect(page).toHaveURL(/\/articles\/?$/u);
    await expect(page.getByRole("heading", { level: 1, name: "Articles" })).toBeVisible();
    expect(await page.evaluate(() => "__playwrightHydrationMarker" in window)).toBe(true);

    await page.getByRole("link", { name: "Customizing GitHub Copilot for Technical Writing" }).click();
    await expect(
        page.getByRole("heading", { level: 1, name: "Customizing GitHub Copilot for Technical Writing" }),
    ).toBeVisible();

    await page.goBack();
    await expect(page.getByRole("heading", { level: 1, name: "Articles" })).toBeVisible();

    await page.goForward();
    await expect(
        page.getByRole("heading", { level: 1, name: "Customizing GitHub Copilot for Technical Writing" }),
    ).toBeVisible();
});

test("keeps an explicit theme choice after reload", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Switch to dark mode" }).click();
    await expect(page.getByRole("button", { name: "Switch to light mode" })).toBeVisible();

    await page.reload();

    await expect(page.getByRole("button", { name: "Switch to light mode" })).toBeVisible();
});

test.describe("mobile navigation", () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("opens the menu and navigates to Articles", async ({ page }) => {
        await page.goto("/");

        await page.getByRole("button", { name: "Open menu" }).click();
        await page.getByRole("link", { name: "Articles", exact: true }).click();

        await expect(page.getByRole("heading", { level: 1, name: "Articles" })).toBeVisible();
        await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
    });
});
