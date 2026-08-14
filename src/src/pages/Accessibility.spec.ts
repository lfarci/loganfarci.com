import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";

import { expect, test } from "@/test/playwright/fixtures";
import { ABOUT_PAGE, ARTICLES_PAGE, expectPage, getFirstArticlePage, HOME_PAGE } from "@/test/playwright/pages";

async function expectNoSeriousOrCriticalAxeViolations(page: Page) {
    const { violations } = await new AxeBuilder({ page }).analyze();
    const blockingViolations = violations.filter(({ impact }) => impact === "serious" || impact === "critical");

    expect(blockingViolations, "Expected no serious or critical axe violations").toEqual([]);
}

test.describe("Axe accessibility", () => {
    test("has no serious or critical violations on the home page", async ({ page }) => {
        await page.goto(HOME_PAGE.path);
        await expectPage(page, HOME_PAGE);

        await expectNoSeriousOrCriticalAxeViolations(page);
    });

    test("has no serious or critical violations on the about page", async ({ page }) => {
        await page.goto(ABOUT_PAGE.path);
        await expectPage(page, ABOUT_PAGE);

        await expectNoSeriousOrCriticalAxeViolations(page);
    });

    test("has no serious or critical violations on the articles page", async ({ page }) => {
        await page.goto(ARTICLES_PAGE.path);
        await expectPage(page, ARTICLES_PAGE);

        await expectNoSeriousOrCriticalAxeViolations(page);
    });

    test("has no serious or critical violations on a representative article page", async ({ page }) => {
        await page.goto(ARTICLES_PAGE.path);
        const articlePage = await getFirstArticlePage(page);
        await page.goto(articlePage.path);
        await expectPage(page, articlePage);

        await expectNoSeriousOrCriticalAxeViolations(page);
    });
});
