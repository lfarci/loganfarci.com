import { describe, expect, it } from "vitest";

import { stabilizeFontDisplay } from "./vite-plugin-stable-font-display";

describe("stableFontDisplayPlugin", () => {
    it("uses optional display for layout-critical web fonts", () => {
        const code = "@font-face { font-display: swap; }";

        const result = stabilizeFontDisplay(code, "/node_modules/@fontsource-variable/manrope/index.css");

        expect(result?.code).toBe("@font-face { font-display: optional; }");
    });

    it("leaves unrelated stylesheets unchanged", () => {
        const result = stabilizeFontDisplay(
            "@font-face { font-display: swap; }",
            "/node_modules/@fontsource/reddit-mono/index.css",
        );

        expect(result).toBeNull();
    });
});
