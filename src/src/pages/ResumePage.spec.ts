import { expect, test } from "@/test/playwright/fixtures";
import { expectPage, RESUME_PAGE } from "@/test/playwright/pages";

test.describe("Resume page", () => {
    test("presents the résumé sections", async ({ page }) => {
        await page.goto("/resume");
        await expectPage(page, RESUME_PAGE);

        await expect(page.getByRole("main").getByRole("heading", { level: 2 })).toHaveText([
            "Experience",
            "Education",
            "Certifications",
            "Skills",
        ]);
    });

    test("shows the author portrait with an accessible description", async ({ page }) => {
        await page.goto("/resume");

        await expect(page.getByRole("img", { name: "Picture of the author: Logan Farci" })).toBeVisible();
    });

    test("populates every résumé section", async ({ page }) => {
        await page.goto("/resume");
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
        await page.goto("/resume#skills");

        await expectPage(page, RESUME_PAGE);
        await expect(page).toHaveURL(/\/resume\/?#skills$/u);
        await expect(page.getByRole("heading", { level: 2, name: "Skills" })).toBeVisible();
    });
});
