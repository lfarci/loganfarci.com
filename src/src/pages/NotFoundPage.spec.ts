import { expect, test } from "@/test/playwright/fixtures";

test.describe("Not found page", () => {
    test("keeps the recovery copy clear of the decorative code at intermediate widths", async ({ page }) => {
        await page.setViewportSize({ width: 820, height: 1180 });
        await page.goto("/404");

        const layout = await page.evaluate(() => {
            const code = document.querySelector(".field-error-code")!.getBoundingClientRect();
            const copy = document.querySelector(".field-error-copy")!.getBoundingClientRect();

            return {
                codeBottom: code.bottom,
                copyTop: copy.top,
                overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            };
        });

        expect(layout.codeBottom).toBeLessThanOrEqual(layout.copyTop);
        expect(layout.overflow).toBe(0);
        await expect(page.getByRole("link", { name: "Back to home" })).toBeVisible();
        await expect(page.getByRole("link", { name: "Browse articles" })).toBeVisible();
    });
});
