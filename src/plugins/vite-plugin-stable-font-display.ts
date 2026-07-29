import type { Plugin } from "vite";

const layoutCriticalFontPackages = ["/@fontsource-variable/manrope/", "/@fontsource/noto-sans/"];

export function stabilizeFontDisplay(code: string, id: string) {
    const normalizedId = id.replaceAll("\\", "/");

    if (!layoutCriticalFontPackages.some((fontPackage) => normalizedId.includes(fontPackage))) {
        return null;
    }

    return { code: code.replaceAll("font-display: swap;", "font-display: optional;"), map: null };
}

export default function stableFontDisplayPlugin(): Plugin {
    return { name: "stable-font-display", enforce: "pre", transform: stabilizeFontDisplay };
}
