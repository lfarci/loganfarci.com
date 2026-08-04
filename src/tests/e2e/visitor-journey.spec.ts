import { expect, test as base, type Page } from "@playwright/test";

type RuntimeErrorFixtures = { runtimeErrors: string[] };
type PageExpectation = { path: string; heading: string | RegExp };

const HOME_PAGE: PageExpectation = { path: "/", heading: /Hi.*I'm Logan/u };
const ABOUT_PAGE: PageExpectation = { path: "/about", heading: "About Me" };
const ARTICLES_PAGE: PageExpectation = { path: "/articles", heading: "Articles" };

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

function pathPattern(path: string): RegExp {
    const escapedPath = path.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
    return new RegExp(`${escapedPath}/?(?:#.*)?$`, "u");
}

async function expectPage(page: Page, expectedPage: PageExpectation) {
    await expect(page).toHaveURL(pathPattern(expectedPage.path));
    await expect(page.getByRole("heading", { level: 1, name: expectedPage.heading })).toBeVisible();
}

async function markHydratedPage(page: Page) {
    await page.evaluate(() => Object.defineProperty(window, "__playwrightHydrationMarker", { value: true }));
}

async function expectClientNavigation(page: Page) {
    expect(await page.evaluate(() => "__playwrightHydrationMarker" in window)).toBe(true);
}

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

test.describe("desktop primary navigation", () => {
    test("navigates from Home to About without reloading the document", async ({ page }) => {
        await page.goto("/");
        await markHydratedPage(page);

        await page.getByRole("navigation").getByRole("link", { name: "About", exact: true }).click();

        await expectPage(page, ABOUT_PAGE);
        await expectClientNavigation(page);
    });

    test("navigates from Home to Articles without reloading the document", async ({ page }) => {
        await page.goto("/");
        await markHydratedPage(page);

        await page.getByRole("navigation").getByRole("link", { name: "Articles", exact: true }).click();

        await expectPage(page, ARTICLES_PAGE);
        await expectClientNavigation(page);
    });

    test("returns Home through the site-title link", async ({ page }) => {
        await page.goto("/about");
        await markHydratedPage(page);

        await page.getByRole("navigation").getByRole("link", { name: "Logan Farci", exact: true }).click();

        await expectPage(page, HOME_PAGE);
        await expectClientNavigation(page);
    });

    test("preserves the complete Back and Forward history across primary pages", async ({ page }) => {
        await page.goto("/");
        const navigation = page.getByRole("navigation");

        await navigation.getByRole("link", { name: "About", exact: true }).click();
        await expectPage(page, ABOUT_PAGE);
        await navigation.getByRole("link", { name: "Articles", exact: true }).click();
        await expectPage(page, ARTICLES_PAGE);

        await page.goBack();
        await expectPage(page, ABOUT_PAGE);
        await page.goBack();
        await expectPage(page, HOME_PAGE);
        await page.goForward();
        await expectPage(page, ABOUT_PAGE);
        await page.goForward();
        await expectPage(page, ARTICLES_PAGE);
    });
});

test.describe("article navigation", () => {
    test("opens a rendered article and preserves its browser-history entry", async ({ page }) => {
        await page.goto("/articles");
        const articleLink = page.getByRole("main").getByRole("link").first();
        await expect(articleLink).toBeVisible();
        const articleTitle = (await articleLink.innerText()).trim();
        const articlePath = new URL((await articleLink.getAttribute("href")) ?? "", page.url()).pathname;

        await articleLink.click();
        await expectPage(page, { path: articlePath, heading: articleTitle });

        await page.goBack();
        await expectPage(page, ARTICLES_PAGE);
        await page.goForward();
        await expectPage(page, { path: articlePath, heading: articleTitle });
    });

    test("navigates from an article to another primary page without reloading", async ({ page }) => {
        await page.goto("/articles");
        await page.getByRole("main").getByRole("link").first().click();
        await markHydratedPage(page);

        await page.getByRole("navigation").getByRole("link", { name: "About", exact: true }).click();

        await expectPage(page, ABOUT_PAGE);
        await expectClientNavigation(page);
    });
});

test("moves keyboard focus to the main content through the skip link", async ({ page }) => {
    await page.goto("/");

    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: "Skip to content" });
    await expect(skipLink).toBeFocused();
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL(/#main-content$/u);
    await expect(page.getByRole("main")).toBeFocused();
});

test("keeps an explicit theme choice through navigation and reload", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Switch to dark mode" }).click();
    await page.getByRole("navigation").getByRole("link", { name: "About", exact: true }).click();
    await expect(page.getByRole("button", { name: "Switch to light mode" })).toBeVisible();

    await page.reload();

    await expect(page.getByRole("button", { name: "Switch to light mode" })).toBeVisible();
});

test.describe("mobile navigation", () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("opens and closes the menu through the toggle button", async ({ page }) => {
        await page.goto("/");
        const navigation = page.getByRole("navigation");

        await navigation.getByRole("button", { name: "Open menu" }).click();
        await expect(navigation.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
        await navigation.getByRole("button", { name: "Close menu" }).click();

        await expect(navigation.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
        await expect(navigation.getByRole("link", { name: "About", exact: true })).toHaveCount(0);
    });

    test("closes the menu with Escape", async ({ page }) => {
        await page.goto("/");
        const navigation = page.getByRole("navigation");

        await navigation.getByRole("button", { name: "Open menu" }).click();
        await page.keyboard.press("Escape");

        await expect(navigation.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
        await expect(navigation.getByRole("link", { name: "About", exact: true })).toHaveCount(0);
    });

    for (const destination of [HOME_PAGE, ABOUT_PAGE, ARTICLES_PAGE]) {
        const label = destination === HOME_PAGE ? "Home" : destination === ABOUT_PAGE ? "About" : "Articles";
        const startingPath = destination === HOME_PAGE ? "/about" : "/";

        test(`navigates to ${label} and dismisses the menu`, async ({ page }) => {
            await page.goto(startingPath);
            const navigation = page.getByRole("navigation");

            await navigation.getByRole("button", { name: "Open menu" }).click();
            await navigation.getByRole("link", { name: label, exact: true }).click();

            await expectPage(page, destination);
            await expect(navigation.getByRole("button", { name: "Open menu" })).toHaveAttribute(
                "aria-expanded",
                "false",
            );
        });
    }

    test("closes an open menu when resizing to desktop navigation", async ({ page }) => {
        await page.goto("/");
        const navigation = page.getByRole("navigation");

        await navigation.getByRole("button", { name: "Open menu" }).click();
        await page.setViewportSize({ width: 1024, height: 768 });
        await expect(navigation.getByRole("link", { name: "About", exact: true })).toBeVisible();

        await page.setViewportSize({ width: 390, height: 844 });

        await expect(navigation.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
    });
});
