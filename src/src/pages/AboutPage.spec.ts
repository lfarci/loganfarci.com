import { expect, test } from "@/test/playwright/fixtures";
import { ABOUT_PAGE, expectPage } from "@/test/playwright/pages";

test.describe("About page", () => {
    test("presents the professional profile sections", async ({ page }) => {
        await page.goto("/about");
        await expectPage(page, ABOUT_PAGE);

        await expect(page.getByRole("main").getByRole("heading", { level: 2 })).toHaveText([
            "Experience",
            "Education",
            "Certifications",
            "Skills",
        ]);
    });

    test("shows the author portrait with an accessible description", async ({ page }) => {
        await page.goto("/about");

        await expect(page.getByRole("img", { name: "Picture of the author: Logan Farci" })).toBeVisible();
    });

    test("populates every professional profile section", async ({ page }) => {
        await page.goto("/about");
        const main = page.getByRole("main");

        for (const representativeContent of [
            "Consultant, Full-Stack Developer",
            "Bachelor in Computer Science",
            "Azure Developer Associate",
            "Software Engineering",
        ]) {
            await expect(
                main.getByRole("heading", { level: 3, name: representativeContent, exact: true }),
            ).toBeVisible();
        }
    });

    test("loads a direct link to the Skills section", async ({ page }) => {
        await page.goto("/about#skills");

        await expectPage(page, ABOUT_PAGE);
        await expect(page).toHaveURL(/\/about\/?#skills$/u);
        await expect(page.getByRole("heading", { level: 2, name: "Skills" })).toBeVisible();
    });

    test("keeps anchored sections clear of the sticky header", async ({ page }) => {
        await page.goto("/about#about-me");

        const offsetStyles = await page.evaluate(() => {
            const header = document.querySelector(".field-page-header");
            const experience = document.getElementById("experience");
            const certifications = document.getElementById("certifications");

            return {
                header: header ? Number.parseFloat(getComputedStyle(header).scrollMarginTop || "0") : 0,
                experience: experience ? Number.parseFloat(getComputedStyle(experience).scrollMarginTop || "0") : 0,
                certifications: certifications
                    ? Number.parseFloat(getComputedStyle(certifications).scrollMarginTop || "0")
                    : 0,
            };
        });

        expect(offsetStyles.header).toBeGreaterThan(0);
        expect(offsetStyles.experience).toBeGreaterThan(0);
        expect(offsetStyles.certifications).toBeGreaterThan(0);
    });

    test("keeps every disclosure closed while leaving the education preview visible", async ({ page }) => {
        await page.goto("/about");
        const disclosures = page.locator("details.field-disclosure");
        const disclosureCount = await disclosures.count();

        for (let index = 0; index < disclosureCount; index++) {
            await expect(disclosures.nth(index)).not.toHaveAttribute("open", "");
        }

        const education = page.locator("#education details");
        await expect(education.getByRole("heading", { level: 3, name: "Bachelor in Computer Science" })).toBeVisible();
        await expect(education.getByRole("img", { name: "ESI Logo" })).toBeVisible();

        await education.locator("summary").click();
        await expect(education).toHaveAttribute("open", "");
    });
});
