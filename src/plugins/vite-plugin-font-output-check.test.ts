import type { OutputAsset, OutputBundle } from "rollup";
import { describe, expect, it } from "vitest";

import { verifyFontOutput } from "./vite-plugin-font-output-check";

const fontAsset = (fileName: string, source: string): OutputAsset => ({
    fileName,
    name: fileName,
    names: [fileName],
    needsCodeReference: false,
    originalFileName: null,
    originalFileNames: [],
    source,
    type: "asset",
});

const createBundle = (display: "swap" | "optional", includeNotoSansAsset = true): OutputBundle => {
    const bundle: OutputBundle = {
        "assets/index.css": fontAsset(
            "assets/index.css",
            [
                `@font-face { font-family: "Manrope Variable"; font-display: ${display}; src: url(/assets/manrope.woff2); }`,
                `@font-face { font-family: "Noto Sans"; font-display: ${display}; src: url(/assets/noto-sans.woff2); }`,
                `@font-face { font-family: "Reddit Mono"; font-display: ${display}; src: url(/assets/reddit-mono.woff2); }`,
            ].join("\n"),
        ),
        "assets/manrope.woff2": fontAsset("assets/manrope.woff2", "manrope"),
        "assets/reddit-mono.woff2": fontAsset("assets/reddit-mono.woff2", "reddit mono"),
    };

    if (includeNotoSansAsset) {
        bundle["assets/noto-sans.woff2"] = fontAsset("assets/noto-sans.woff2", "noto sans");
    }

    return bundle;
};

describe("fontOutputCheckPlugin", () => {
    it("accepts required font faces that swap to emitted assets", () => {
        expect(() => verifyFontOutput(createBundle("swap"))).not.toThrow();
    });

    it("rejects required font faces that can remain on fallbacks", () => {
        expect(() => verifyFontOutput(createBundle("optional"))).toThrow("must use font-display: swap");
    });

    it("rejects required font faces whose emitted asset is missing", () => {
        expect(() => verifyFontOutput(createBundle("swap", false))).toThrow("missing font asset");
    });
});
