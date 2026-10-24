import { describe, expect, it } from "vitest";

import { createSocialImageUrl, siteOgImage, siteUrl } from "./site";

describe("site", () => {
    it("uses the production site URL by default", () => {
        expect(siteUrl).toBe("https://www.loganfarci.com");
    });

    it("derives the production Open Graph image URL from the site URL", () => {
        expect(siteOgImage).toBe(`${siteUrl}/images/social-preview.png`);
    });

    it("normalizes trailing slashes when constructing absolute Open Graph image URLs", () => {
        expect(createSocialImageUrl("https://example-497.westeurope.azurestaticapps.net/")).toBe(
            "https://example-497.westeurope.azurestaticapps.net/images/social-preview.png",
        );
    });

    it("supports a preview image origin without changing the production canonical URL", () => {
        expect(createSocialImageUrl("https://example-497.westeurope.azurestaticapps.net")).toBe(
            "https://example-497.westeurope.azurestaticapps.net/images/social-preview.png",
        );
        expect(siteUrl).toBe("https://www.loganfarci.com");
    });
});
