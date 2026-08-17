import { expect, test } from "@/test/playwright/fixtures";
import {
    ABOUT_PAGE,
    ARTICLES_PAGE,
    expectClientNavigation,
    expectPage,
    getFirstArticlePage,
    HOME_PAGE,
    markHydratedPage,
} from "@/test/playwright/pages";

test.describe("Home page", () => {
    test("presents the profile and discovery sections", async ({ page }) => {
        await page.goto("/");
        await expectPage(page, HOME_PAGE);

        await expect(page.getByRole("main").getByRole("heading", { level: 2 })).toHaveText([
            "About Me",
            "What I Do",
            "My Certifications",
            "Featured Articles",
        ]);
    });

    test("exposes the complete set of accessible contact actions", async ({ page }) => {
        await page.goto("/");
        const main = page.getByRole("main");
        const contacts = [
            { name: "Let's connect on LinkedIn", href: "https://www.linkedin.com/in/lfarci/" },
            { name: "Explore my GitHub", href: "https://github.com/lfarci" },
            { name: "Follow me on Bluesky", href: "https://bsky.app/profile/lfarci.bsky.social" },
            { name: "Send me an email", href: "mailto:logan.farci@outlook.be" },
        ];

        for (const contact of contacts) {
            const link = main.getByRole("link", { name: contact.name, exact: true });
            await expect(link).toHaveAttribute("href", contact.href);
            await expect(link).toHaveAttribute("target", "_blank");
            await expect(link).toHaveAttribute("rel", "noopener noreferrer");
        }
    });

    test("opens the complete article catalog from Featured Articles", async ({ page }) => {
        await page.goto("/");

        await page.getByRole("main").getByRole("link", { name: "Featured Articles", exact: true }).click();

        await expectPage(page, ARTICLES_PAGE);
    });

    test("opens a featured article without reloading the document", async ({ page }) => {
        await page.goto("/");
        const articlePage = await getFirstArticlePage(page);
        await markHydratedPage(page);

        await page.getByRole("main").getByRole("article").first().getByRole("link").click();

        await expectPage(page, articlePage);
        await expectClientNavigation(page);
    });

    for (const destination of [
        { link: "About Me", hash: "about-me", targetHeading: "About Me" },
        { link: "What I Do", hash: "skills", targetHeading: "Skills" },
        { link: "My Certifications", hash: "certifications", targetHeading: "Certifications" },
    ]) {
        test(`opens the ${destination.targetHeading} details from ${destination.link}`, async ({ page }) => {
            await page.goto("/");

            await page.getByRole("main").getByRole("link", { name: destination.link, exact: true }).click();

            await expectPage(page, ABOUT_PAGE);
            await expect(page).toHaveURL(new RegExp(`/about#${destination.hash}$`, "u"));
            await expect(page.getByRole("heading", { name: destination.targetHeading, exact: true })).toBeVisible();
        });
    }
});
