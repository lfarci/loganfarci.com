import { matchRoutes } from "react-router";
import { describe, expect, it } from "vitest";

import { createRoutes, getStaticRoutes, markdownCalloutsShowcasePath } from "./routes";

describe("routes", () => {
    it("includes the Markdown callout showcase in development", () => {
        const developmentRoute = createRoutes(true).find((route) => route.path === markdownCalloutsShowcasePath);

        expect(developmentRoute).toBeTruthy();
    });

    it("routes the Markdown callout showcase to not found in production", () => {
        const matches = matchRoutes(createRoutes(false), markdownCalloutsShowcasePath);

        expect(matches?.at(-1)?.route.path).toBe("*");
    });

    it("excludes the Markdown callout showcase from static routes", () => {
        expect(getStaticRoutes()).not.toContain(markdownCalloutsShowcasePath);
    });
});
