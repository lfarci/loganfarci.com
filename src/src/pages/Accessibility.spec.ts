import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect, test } from "@/test/playwright/fixtures";
import {
    ABOUT_PAGE,
    ARTICLES_PAGE,
    expectPage,
    getFirstArticlePage,
    HOME_PAGE,
    type PageExpectation,
} from "@/test/playwright/pages";

const corePages: readonly PageExpectation[] = [HOME_PAGE, ABOUT_PAGE, ARTICLES_PAGE];

async function expectNoSeriousOrCriticalAxeViolations(page: Page) {
    const results = await new AxeBuilder({ page }).analyze();
    const violations = results.violations.filter(({ impact }) => impact === "serious" || impact === "critical");

    expect(violations).toEqual([]);
}

test.describe("Accessibility", () => {
    for (const pageExpectation of corePages) {
        test(`has no serious or critical axe violations on ${pageExpectation.path}`, async ({ page }) => {
            await page.goto(pageExpectation.path);
            await expectPage(page, pageExpectation);

            await expectNoSeriousOrCriticalAxeViolations(page);
        });
    }

    test("has no serious or critical axe violations on a representative article", async ({ page }) => {
        await page.goto("/articles");
        const articlePage = await getFirstArticlePage(page);
        await page.goto(articlePage.path);
        await expectPage(page, articlePage);

        await expectNoSeriousOrCriticalAxeViolations(page);
    });
});
