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

test.describe("Desktop primary navigation", () => {
    for (const destination of [
        { label: "Home", page: HOME_PAGE, startingPath: "/about" },
        { label: "About", page: ABOUT_PAGE, startingPath: "/" },
        { label: "Articles", page: ARTICLES_PAGE, startingPath: "/" },
    ]) {
        test(`navigates to ${destination.label} without reloading the document`, async ({ page }) => {
            await page.goto(destination.startingPath);
            await markHydratedPage(page);

            await page.getByRole("navigation").getByRole("link", { name: destination.label, exact: true }).click();

            await expectPage(page, destination.page);
            await expectClientNavigation(page);
        });
    }

    test("returns Home through the site-title link", async ({ page }) => {
        await page.goto("/about");
        await markHydratedPage(page);

        await page.getByRole("navigation").getByRole("link", { name: "Logan Farci", exact: true }).click();

        await expectPage(page, HOME_PAGE);
        await expectClientNavigation(page);
    });

    test("offers the résumé as a direct download", async ({ page }) => {
        await page.goto("/");

        const downloadLink = page.getByRole("navigation").getByRole("link", { name: "Résumé", exact: true });
        await expect(downloadLink).toBeVisible();
        await expect(downloadLink).toHaveAttribute("href", "/resume.pdf");
        await expect(downloadLink).toHaveAttribute("download", "");
    });

    test("navigates from an article to a primary page without reloading", async ({ page }) => {
        await page.goto("/articles");
        const articlePage = await getFirstArticlePage(page);
        await page.goto(articlePage.path);
        await markHydratedPage(page);

        await page.getByRole("navigation").getByRole("link", { name: "About", exact: true }).click();

        await expectPage(page, ABOUT_PAGE);
        await expectClientNavigation(page);
    });

    test("preserves Back and Forward history across primary pages", async ({ page }) => {
        await page.goto("/");
        const navigation = page.getByRole("navigation");

        await navigation.getByRole("link", { name: "About", exact: true }).click();
        await expectPage(page, ABOUT_PAGE);
        await navigation.getByRole("link", { name: "Articles", exact: true }).click();
        await expectPage(page, ARTICLES_PAGE);
        await page.goBack();
        await expectPage(page, ABOUT_PAGE);
        await page.goBack();
        await expectPage(page, HOME_PAGE);
        await page.goForward();
        await expectPage(page, ABOUT_PAGE);
        await page.goForward();

        await expectPage(page, ARTICLES_PAGE);
    });
});

test.describe("Shared navigation behavior", () => {
    test("moves keyboard focus to the main content through the skip link", async ({ page }) => {
        await page.goto("/");

        await page.keyboard.press("Tab");
        const skipLink = page.getByRole("link", { name: "Skip to content" });
        await expect(skipLink).toBeFocused();
        await page.keyboard.press("Enter");

        await expect(page).toHaveURL(/#main-content$/u);
        await expect(page.getByRole("main")).toBeFocused();
    });

    test("keeps an explicit theme choice through navigation and reload", async ({ page }) => {
        await page.goto("/");

        await page.getByRole("button", { name: "Switch to dark mode" }).click();
        await page.getByRole("navigation").getByRole("link", { name: "About", exact: true }).click();
        await expect(page.getByRole("button", { name: "Switch to light mode" })).toBeVisible();
        await page.reload();
        await expect(page.getByRole("button", { name: "Switch to light mode" })).toBeVisible();

        await page.getByRole("button", { name: "Switch to light mode" }).click();
        await page.reload();

        await expect(page.getByRole("button", { name: "Switch to dark mode" })).toBeVisible();
    });
});

test.describe("Mobile navigation", () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("opens and closes the menu through the toggle button", async ({ page }) => {
        await page.goto("/");
        const navigation = page.getByRole("navigation");

        await navigation.getByRole("button", { name: "Open menu" }).click();
        await expect(navigation.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
        await navigation.getByRole("button", { name: "Close menu" }).click();

        await expect(navigation.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
        await expect(navigation.getByRole("link", { name: "About", exact: true })).toHaveCount(0);
    });

    test("closes the menu with Escape", async ({ page }) => {
        await page.goto("/");
        const navigation = page.getByRole("navigation");

        await navigation.getByRole("button", { name: "Open menu" }).click();
        await page.keyboard.press("Escape");

        await expect(navigation.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
        await expect(navigation.getByRole("link", { name: "About", exact: true })).toHaveCount(0);
    });

    test("offers the résumé as a direct download in the open menu", async ({ page }) => {
        await page.goto("/");
        const navigation = page.getByRole("navigation");

        await navigation.getByRole("button", { name: "Open menu" }).click();
        const downloadLink = navigation.getByRole("link", { name: "Résumé", exact: true });

        await expect(downloadLink).toBeVisible();
        await expect(downloadLink).toHaveAttribute("href", "/resume.pdf");
        await expect(downloadLink).toHaveAttribute("download", "");
    });

    for (const destination of [
        { label: "Home", page: HOME_PAGE, startingPath: "/about" },
        { label: "About", page: ABOUT_PAGE, startingPath: "/" },
        { label: "Articles", page: ARTICLES_PAGE, startingPath: "/" },
    ]) {
        test(`navigates to ${destination.label} and dismisses the menu`, async ({ page }) => {
            await page.goto(destination.startingPath);
            const navigation = page.getByRole("navigation");

            await navigation.getByRole("button", { name: "Open menu" }).click();
            await navigation.getByRole("link", { name: destination.label, exact: true }).click();

            await expectPage(page, destination.page);
            await expect(navigation.getByRole("button", { name: "Open menu" })).toHaveAttribute(
                "aria-expanded",
                "false",
            );
        });
    }

    test("closes an open menu when resizing to desktop navigation", async ({ page }) => {
        await page.goto("/");
        const navigation = page.getByRole("navigation");

        await navigation.getByRole("button", { name: "Open menu" }).click();
        await page.setViewportSize({ width: 1024, height: 768 });
        await expect(navigation.getByRole("link", { name: "About", exact: true })).toBeVisible();
        await expect(navigation.getByLabel("Open menu", { exact: true })).toHaveAttribute("aria-expanded", "false");
        await page.setViewportSize({ width: 390, height: 844 });

        await expect(navigation.getByRole("button", { name: "Open menu" })).toBeVisible();
    });
});
