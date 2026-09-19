import { expect, test } from "@/test/playwright/fixtures";
import { ABOUT_PAGE, ARTICLES_PAGE, expectPage, HOME_PAGE } from "@/test/playwright/pages";

test.describe("Home page", () => {
    test("presents the proposition, proof and primary actions in the opening", async ({ page }) => {
        await page.goto("/");
        await expectPage(page, HOME_PAGE);

        const main = page.getByRole("main");
        await expect(main.getByRole("heading", { level: 1 })).toHaveText("Hi, I'm Logan.Software Engineer");
        await expect(main.getByRole("link", { name: "View résumé" })).toHaveAttribute("download", "");
        await expect(main.getByRole("link", { name: "Contact me" })).toHaveAttribute(
            "href",
            "mailto:logan.farci@outlook.be",
        );
        await expect(main.getByRole("navigation", { name: "Profile highlights" }).getByRole("link")).toHaveCount(3);
        await expect(main.getByText("GitHub · Azure · Terraform · .NET", { exact: true })).toBeVisible();
    });

    test("fits the complete desktop opening within tall viewports", async ({ page }) => {
        for (const viewport of [
            { width: 1440, height: 900 },
            { width: 1920, height: 1080 },
        ]) {
            await page.setViewportSize(viewport);
            await page.goto("/");

            await expect
                .poll(() =>
                    page.evaluate(() => ({
                        clientHeight: document.documentElement.clientHeight,
                        scrollHeight: document.documentElement.scrollHeight,
                    })),
                )
                .toEqual({ clientHeight: viewport.height, scrollHeight: viewport.height });
        }
    });

    test("preserves hero breathing room on short desktop viewports", async ({ page }) => {
        for (const viewport of [
            { width: 1366, height: 768 },
            { width: 1362, height: 700 },
        ]) {
            await page.setViewportSize(viewport);
            await page.goto("/");

            const layout = await page.evaluate(() => {
                const box = (selector: string) => document.querySelector(selector)!.getBoundingClientRect();
                const role = box(".home-role");
                const stack = box(".home-stack");
                const resume = box(".home-cta-primary");
                const contacts = box(".home-contact-list");

                return {
                    roleToStack: stack.top - role.bottom,
                    stackToCtas: resume.top - stack.bottom,
                    ctasToSocial: contacts.top - resume.bottom,
                };
            });

            expect(layout.roleToStack).toBeGreaterThanOrEqual(24);
            expect(layout.roleToStack).toBeLessThanOrEqual(32);
            expect(layout.stackToCtas).toBeGreaterThanOrEqual(28);
            expect(layout.stackToCtas).toBeLessThanOrEqual(40);
            expect(layout.ctasToSocial).toBeGreaterThanOrEqual(16);
            expect(layout.ctasToSocial).toBeLessThanOrEqual(20);
        }
    });

    test("keeps the tablet hero content ahead of the portrait", async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 1100 });
        await page.goto("/");

        const heading = page.getByRole("heading", { level: 1 });
        const stack = page.getByText("GitHub · Azure · Terraform · .NET", { exact: true });
        const resume = page.getByRole("link", { name: "View résumé" });
        const contactList = page.locator('[aria-label="Other ways to connect"]');
        const portrait = page.getByRole("img", { name: "Picture of the author: Logan Farci" });
        const proof = page.getByRole("navigation", { name: "Profile highlights" });

        await expect(heading).toBeVisible();
        await expect(stack).toBeVisible();

        const [headingBox, stackBox, resumeBox, contactListBox, portraitBox, proofBox] = await Promise.all([
            heading.boundingBox(),
            stack.boundingBox(),
            resume.boundingBox(),
            contactList.boundingBox(),
            portrait.boundingBox(),
            proof.boundingBox(),
        ]);

        expect(headingBox!.y).toBeLessThan(stackBox!.y);
        expect(stackBox!.y).toBeLessThan(resumeBox!.y);
        expect(resumeBox!.y).toBeLessThan(contactListBox!.y);
        expect(contactListBox!.y).toBeLessThan(portraitBox!.y);
        expect(portraitBox!.y).toBeLessThan(proofBox!.y);
    });

    test("keeps the hero continuous at the responsive handoffs", async ({ page }) => {
        const handoffs: { headingTop: number }[] = [];

        for (const { width, stacked, ctasStacked } of [
            { width: 767, stacked: true, ctasStacked: true },
            { width: 768, stacked: true, ctasStacked: false },
            { width: 1199, stacked: true, ctasStacked: false },
            { width: 1200, stacked: false, ctasStacked: false },
        ]) {
            await page.setViewportSize({ width, height: 900 });
            await page.goto("/");

            const layout = await page.evaluate(() => {
                const box = (selector: string) => document.querySelector(selector)!.getBoundingClientRect();
                const socialLinks = [...document.querySelectorAll<HTMLElement>(".home-contact-link")].map((link) =>
                    link.getBoundingClientRect(),
                );
                const header = box(".field-shell-header");
                const heading = box(".home-heading");
                const actions = box(".home-actions");
                const portrait = box(".home-portrait");
                const resume = box(".home-cta-primary");
                const contact = box(".home-cta-secondary");

                return {
                    headerBottom: header.bottom,
                    headingTop: heading.top,
                    actionsBottom: actions.bottom,
                    portraitTop: portrait.top,
                    ctaOffset: Math.abs(resume.top - contact.top),
                    socialGaps: socialLinks.slice(1).map((link, index) => link.left - socialLinks[index].right),
                    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
                };
            });

            expect(layout.headingTop).toBeGreaterThanOrEqual(layout.headerBottom);
            expect(layout.overflow).toBe(0);
            expect(layout.socialGaps).toEqual([8, 8, 8]);
            expect(layout.ctaOffset === 0).toBe(!ctasStacked);

            handoffs.push({ headingTop: layout.headingTop });

            if (stacked) {
                expect(layout.actionsBottom).toBeLessThanOrEqual(layout.portraitTop);
            }
        }

        expect(Math.abs(handoffs[0].headingTop - handoffs[1].headingTop)).toBeLessThanOrEqual(4);
        expect(Math.abs(handoffs[2].headingTop - handoffs[3].headingTop)).toBeLessThanOrEqual(16);
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
