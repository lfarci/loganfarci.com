import { expect, type Page } from "@playwright/test";

export type PageExpectation = { path: string; heading: string | RegExp };

export const HOME_PAGE: PageExpectation = { path: "/", heading: /Hi.*I'm Logan/u };
export const ABOUT_PAGE: PageExpectation = { path: "/about", heading: "About Me" };
export const RESUME_PAGE: PageExpectation = { path: "/resume", heading: "Résumé" };
export const ARTICLES_PAGE: PageExpectation = { path: "/articles", heading: "Articles" };

function pathPattern(path: string): RegExp {
    const escapedPath = path.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
    return new RegExp(`${escapedPath}/?(?:#.*)?$`, "u");
}

export async function expectPage(page: Page, expectedPage: PageExpectation) {
    await expect(page).toHaveURL(pathPattern(expectedPage.path));
    await expect(page.getByRole("heading", { level: 1, name: expectedPage.heading })).toBeVisible();
}

export async function markHydratedPage(page: Page) {
    await page.evaluate(() => Object.defineProperty(window, "__playwrightHydrationMarker", { value: true }));
}

export async function expectClientNavigation(page: Page) {
    expect(await page.evaluate(() => "__playwrightHydrationMarker" in window)).toBe(true);
}

export async function getFirstArticlePage(page: Page): Promise<PageExpectation> {
    const articleLink = page.getByRole("main").getByRole("article").first().getByRole("link");
    await expect(articleLink).toBeVisible();

    const heading = (await articleLink.innerText()).trim();
    const href = await articleLink.getAttribute("href");

    if (!href) {
        throw new Error("Expected the first article link to have an href.");
    }

    return { path: new URL(href, page.url()).pathname, heading };
}
