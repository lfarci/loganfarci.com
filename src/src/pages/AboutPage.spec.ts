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
});
