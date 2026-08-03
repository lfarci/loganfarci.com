import type { OutputBundle } from "rollup";
import type { Plugin, ResolvedConfig } from "vite";

const requiredFontFamilies = ["Manrope Variable", "Noto Sans", "Reddit Mono"];

const getFontFaceBlocks = (css: string) => css.match(/@font-face\s*\{[^}]*\}/g) ?? [];

const getFontFamily = (fontFace: string) => fontFace.match(/font-family:\s*["']?([^;"']+)["']?\s*;/)?.[1]?.trim();

const getFontAssetReferences = (fontFace: string) =>
    [...fontFace.matchAll(/url\(["']?(\/assets\/[^)"']+\.woff2?)["']?\)/g)].map((match) => match[1].slice(1));

export function verifyFontOutput(bundle: OutputBundle) {
    const emittedAssets = new Set(Object.values(bundle).map((entry) => entry.fileName));
    const css = Object.values(bundle)
        .flatMap((entry) => (entry.type === "asset" && entry.fileName.endsWith(".css") ? [String(entry.source)] : []))
        .join("\n");
    const fontFaces = getFontFaceBlocks(css);

    for (const family of requiredFontFamilies) {
        const familyFaces = fontFaces.filter((fontFace) => getFontFamily(fontFace) === family);

        if (familyFaces.length === 0) {
            throw new Error(`Production CSS does not contain an @font-face rule for ${family}.`);
        }

        if (familyFaces.some((fontFace) => !/font-display:\s*swap\s*;/.test(fontFace))) {
            throw new Error(`Every ${family} @font-face rule must use font-display: swap.`);
        }

        const referencedAssets = familyFaces.flatMap(getFontAssetReferences);
        if (referencedAssets.length === 0) {
            throw new Error(`Production CSS does not reference an emitted font asset for ${family}.`);
        }

        for (const asset of referencedAssets) {
            if (!emittedAssets.has(asset)) {
                throw new Error(`Production CSS references missing font asset ${asset}.`);
            }
        }
    }
}

export default function fontOutputCheckPlugin(): Plugin {
    let config: ResolvedConfig;

    return {
        name: "font-output-check",
        apply: "build",
        configResolved(resolvedConfig) {
            config = resolvedConfig;
        },
        generateBundle(_options, bundle) {
            if (!config.build.ssr) {
                verifyFontOutput(bundle);
            }
        },
    };
}
