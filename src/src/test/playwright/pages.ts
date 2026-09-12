import { expect, type Page } from "@playwright/test";

export type PageExpectation = { path: string; heading: string | RegExp };

export const HOME_PAGE: PageExpectation = { path: "/", heading: /Hi.*I'm Logan/u };
export const ABOUT_PAGE: PageExpectation = { path: "/about", heading: "About Me" };
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

    const heading = (await articleLink.locator(".field-article-title").innerText()).trim();
    const href = await articleLink.getAttribute("href");

    if (!href) {
        throw new Error("Expected the first article link to have an href.");
    }

    return { path: new URL(href, page.url()).pathname, heading };
}

export async function getAllArticlePages(page: Page): Promise<PageExpectation[]> {
    const articleLinks = page.getByRole("main").getByRole("article").getByRole("link");
    const count = await articleLinks.count();
    if (count === 0) {
        throw new Error("Expected at least one article link on the articles page.");
    }

    const pages: PageExpectation[] = [];
    for (let i = 0; i < count; i++) {
        const link = articleLinks.nth(i);
        const heading = (await link.locator(".field-article-title").innerText()).trim();
        const href = await link.getAttribute("href");
        if (!href) {
            throw new Error(`Expected article link ${i} to have an href.`);
        }
        pages.push({ path: new URL(href, page.url()).pathname, heading });
    }
    return pages;
}
