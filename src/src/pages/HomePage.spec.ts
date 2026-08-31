import { expect, test } from "@/test/playwright/fixtures";
import { ABOUT_PAGE, ARTICLES_PAGE, expectPage, HOME_PAGE } from "@/test/playwright/pages";

test.describe("Home page", () => {
    test("presents the proposition, proof and primary actions in the opening", async ({ page }) => {
        await page.goto("/");
        await expectPage(page, HOME_PAGE);

        const main = page.getByRole("main");
        await expect(main.getByRole("heading", { level: 1 })).toHaveText("Hi, I'm Logan.Software Engineer");
        await expect(main.getByRole("link", { name: "Download résumé" })).toHaveAttribute("download", "");
        await expect(main.getByRole("link", { name: "Contact me" })).toHaveAttribute(
            "href",
            "mailto:logan.farci@outlook.be",
        );
        await expect(main.getByRole("navigation", { name: "Profile highlights" }).getByRole("link")).toHaveCount(3);
        await expect(main.getByText("GitHub Copilot · GitHub Actions · .NET · Azure", { exact: true })).toBeVisible();
    });

    test("fits the complete desktop opening within its viewport", async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto("/");

        await expect
            .poll(() =>
                page.evaluate(() => ({
                    clientHeight: document.documentElement.clientHeight,
                    scrollHeight: document.documentElement.scrollHeight,
                })),
            )
            .toEqual({ clientHeight: 900, scrollHeight: 900 });
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

    test("opens the article catalog from the Articles proof", async ({ page }) => {
        await page.goto("/");
        await page
            .getByRole("navigation", { name: "Profile highlights" })
            .getByRole("link", { name: /Articles/ })
            .click();

        await expectPage(page, ARTICLES_PAGE);
    });

    for (const destination of [
        { link: "Experience", hash: "experience", targetHeading: "Experience" },
        { link: "Certifications", hash: "certifications", targetHeading: "Certifications" },
    ]) {
        test(`opens the ${destination.targetHeading} details from ${destination.link}`, async ({ page }) => {
            await page.goto("/");
            await page
                .getByRole("navigation", { name: "Profile highlights" })
                .getByRole("link", { name: new RegExp(destination.link, "u") })
                .click();

            await expectPage(page, ABOUT_PAGE);
            await expect(page).toHaveURL(new RegExp(`/about#${destination.hash}$`, "u"));
            await expect(page.getByRole("heading", { name: destination.targetHeading, exact: true })).toBeVisible();
        });
    }

    test("uses the shared compact navigation on mobile", async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto("/");

        await expect(
            page.getByRole("navigation", { name: "Primary" }).getByRole("button", { name: "Open menu" }),
        ).toBeVisible();
    });
});
