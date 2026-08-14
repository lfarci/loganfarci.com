import { test } from "@/test/playwright/fixtures";
import { expectNoSeriousOrCriticalViolations } from "@/test/playwright/axe";
import {
    ABOUT_PAGE,
    ARTICLES_PAGE,
    expectPage,
    getAllArticlePages,
    HOME_PAGE,
    markHydratedPage,
} from "@/test/playwright/pages";

test.describe("axe automated accessibility checks", () => {
    test("home page has no serious or critical violations", async ({ page }) => {
        await page.goto("/");
        await expectPage(page, HOME_PAGE);
        await markHydratedPage(page);

        await expectNoSeriousOrCriticalViolations(page);
    });

    test("about page has no serious or critical violations", async ({ page }) => {
        await page.goto("/about");
        await expectPage(page, ABOUT_PAGE);
        await markHydratedPage(page);

        await expectNoSeriousOrCriticalViolations(page);
    });

    test("articles listing has no serious or critical violations", async ({ page }) => {
        await page.goto("/articles");
        await expectPage(page, ARTICLES_PAGE);
        await markHydratedPage(page);

        await expectNoSeriousOrCriticalViolations(page);
    });

    test("every article has no serious or critical violations", async ({ page }) => {
        await page.goto("/articles");
        await expectPage(page, ARTICLES_PAGE);
        const articlePages = await getAllArticlePages(page);

        for (const articlePage of articlePages) {
            await page.goto(articlePage.path);
            await expectPage(page, articlePage);
            await markHydratedPage(page);

            await expectNoSeriousOrCriticalViolations(page);
        }
    });
});
