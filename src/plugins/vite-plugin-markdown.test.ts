import { describe, expect, it } from "vitest";

import { transformMarkdown } from "./vite-plugin-markdown";

describe("markdownPlugin", () => {
    it("ignores files that are not Markdown", () => {
        const result = transformMarkdown("export default {}", "/src/module.ts");

        expect(result).toBeNull();
    });

    it("exports parsed front matter and Markdown content", () => {
        const source = "---\ntitle: Test article\ndraft: false\n---\n\n## Introduction\n";

        const result = transformMarkdown(source, "/content/article.md");

        expect(result).toEqual({
            code: [
                'export const frontmatter = {"title":"Test article","draft":false};',
                'export const content = "\\n## Introduction\\n";',
            ].join("\n"),
            map: null,
        });
    });
});
