import { expect, test } from "@/test/playwright/fixtures";
import { ARTICLES_PAGE, expectPage, getFirstArticlePage } from "@/test/playwright/pages";

test.describe("Articles", () => {
    test("lists published articles", async ({ page }) => {
        await page.goto("/articles");
        await expectPage(page, ARTICLES_PAGE);

        await expect(page.getByRole("main").getByRole("article").first()).toBeVisible();
    });

    test("gives every article card a titled link and publication date", async ({ page }) => {
        await page.goto("/articles");
        const articleCards = page.getByRole("main").getByRole("article");
        await expect(articleCards.first()).toBeVisible();
        const articleCount = await articleCards.count();

        await expect(articleCards.getByRole("link")).toHaveCount(articleCount);
        await expect(articleCards.locator("time[datetime]")).toHaveCount(articleCount);
    });

    test("opens a rendered article from the listing", async ({ page }) => {
        await page.goto("/articles");
        const articlePage = await getFirstArticlePage(page);

        await page.getByRole("main").getByRole("article").first().getByRole("link").click();

        await expectPage(page, articlePage);
        await expect(page.getByRole("main").getByRole("article")).toBeVisible();
    });

    test("serves a clean article deep link", async ({ page }) => {
        await page.goto("/articles");
        const articlePage = await getFirstArticlePage(page);

        await page.goto(articlePage.path);

        await expectPage(page, articlePage);
    });

    test("navigates to an article section from its table of contents", async ({ page }) => {
        await page.goto("/articles");
        const articlePage = await getFirstArticlePage(page);
        await page.getByRole("main").getByRole("article").first().getByRole("link").click();
        await expectPage(page, articlePage);
        const tableOfContents = page.getByRole("navigation", { name: "In this article" });
        const sectionLink = tableOfContents.getByRole("link").first();
        const sectionName = (await sectionLink.innerText()).trim();
        const sectionHash = await sectionLink.getAttribute("href");

        if (!sectionHash) {
            throw new Error("Expected the first table-of-contents link to have an href.");
        }

        await sectionLink.click();

        await expect(page).toHaveURL(new RegExp(`${sectionHash}$`, "u"));
        await expect(page.getByRole("heading", { name: sectionName, exact: true })).toBeVisible();
    });

    test("preserves the article browser-history entry", async ({ page }) => {
        await page.goto("/articles");
        const articlePage = await getFirstArticlePage(page);

        await page.getByRole("main").getByRole("article").first().getByRole("link").click();
        await expectPage(page, articlePage);
        await page.goBack();
        await expectPage(page, ARTICLES_PAGE);
        await page.goForward();

        await expectPage(page, articlePage);
    });
});

test.describe("Mobile article navigation", () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("returns keyboard focus to the page top", async ({ page }) => {
        await page.goto("/articles");
        await page.getByRole("main").getByRole("article").first().getByRole("link").click();
        await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
        const backToTop = page.getByRole("link", { name: "Back to top" });
        await expect(backToTop).toBeVisible();

        await backToTop.click();

        await expect(page).toHaveURL(/#main-content$/u);
        await expect(page.getByRole("main")).toBeFocused();
    });
});
