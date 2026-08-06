import { expect, test as base } from "@playwright/test";

type AcceptanceFixtures = { externalRequestsBlocked: void; runtimeErrors: string[] };

export const test = base.extend<AcceptanceFixtures>({
    externalRequestsBlocked: [
        async ({ baseURL, page }, use) => {
            if (!baseURL) {
                throw new Error("The Playwright base URL is required.");
            }

            const targetOrigin = new URL(baseURL).origin;

            await page.route("**/*", async (route) => {
                const requestUrl = new URL(route.request().url());
                const isLocalResource =
                    requestUrl.origin === targetOrigin || ["blob:", "data:"].includes(requestUrl.protocol);

                if (isLocalResource) {
                    await route.continue();
                    return;
                }

                await route.abort("blockedbyclient");
            });

            await use();
        },
        { auto: true },
    ],
    runtimeErrors: [
        async ({ page }, use) => {
            const errors: string[] = [];
            page.on("pageerror", (error) => errors.push(error.message));

            await use(errors);

            expect(errors, "Expected the hydrated app to run without uncaught page errors").toEqual([]);
        },
        { auto: true },
    ],
});

export { expect };
