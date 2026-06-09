import { describe, expect, it } from "vitest";
import { extractHeadTags } from "./headTags";

describe("extractHeadTags", () => {
    it("moves document metadata and JSON-LD scripts out of body markup", () => {
        const source = [
            "<div>",
            "<title>Example</title>",
            '<meta name="description" content="Description">',
            '<link rel="canonical" href="https://example.com/">',
            '<script type="application/ld+json">{"@type":"WebSite"}</script>',
            "<main>Content</main>",
            "</div>",
        ].join("");

        const result = extractHeadTags(source);

        expect(result.html).toBe("<div><main>Content</main></div>");
        expect(result.headTags).toBe(
            [
                "<title>Example</title>",
                '<meta name="description" content="Description">',
                '<link rel="canonical" href="https://example.com/">',
                '<script type="application/ld+json">{"@type":"WebSite"}</script>',
            ].join("\n")
        );
    });

    it("leaves executable scripts in the body markup", () => {
        const source = '<div><script src="/app.js"></script><main>Content</main></div>';

        const result = extractHeadTags(source);

        expect(result.html).toBe(source);
        expect(result.headTags).toBe("");
    });
});
