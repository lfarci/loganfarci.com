import { describe, expect, it } from "vitest";

import { siteOgImage, siteUrl } from "./site";

describe("site", () => {
    it("uses the production site URL by default", () => {
        expect(siteUrl).toBe("https://loganfarci.com");
    });

    it("derives the Open Graph image URL from the site URL", () => {
        expect(siteOgImage).toBe(`${siteUrl}/images/avatar.png`);
    });
});
