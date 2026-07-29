import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const indexHtml = readFileSync(resolve(process.cwd(), "index.html"), "utf8");
const initializerMatch = indexHtml.match(/<script>\s*([\s\S]*?)\s*<\/script>/);

if (!initializerMatch?.[1]) {
    throw new Error("Theme initializer script is missing from index.html");
}

const themeInitializer = initializerMatch[1];

function runThemeInitializer(savedTheme: string | null, systemPrefersDark: boolean) {
    let darkClassEnabled = false;

    runInNewContext(themeInitializer, {
        window: { matchMedia: vi.fn(() => ({ matches: systemPrefersDark })) },
        localStorage: { getItem: vi.fn(() => savedTheme) },
        document: {
            documentElement: {
                classList: {
                    toggle: vi.fn((_className: string, enabled: boolean) => {
                        darkClassEnabled = enabled;
                    }),
                },
            },
        },
    });

    return darkClassEnabled;
}

describe("theme initializer", () => {
    it.each([
        { name: "system light with no saved preference", savedTheme: null, systemPrefersDark: false, expected: false },
        { name: "system dark with no saved preference", savedTheme: null, systemPrefersDark: true, expected: true },
        { name: "saved light with a dark system", savedTheme: "light", systemPrefersDark: true, expected: false },
        { name: "saved dark with a light system", savedTheme: "dark", systemPrefersDark: false, expected: true },
        {
            name: "invalid saved value with a dark system",
            savedTheme: "sepia",
            systemPrefersDark: true,
            expected: true,
        },
        {
            name: "invalid saved value with a light system",
            savedTheme: "sepia",
            systemPrefersDark: false,
            expected: false,
        },
    ])("resolves $name", ({ savedTheme, systemPrefersDark, expected }) => {
        expect(runThemeInitializer(savedTheme, systemPrefersDark)).toBe(expected);
    });

    it("runs before the document head closes", () => {
        const initializerPosition = indexHtml.indexOf(themeInitializer);
        const headEndPosition = indexHtml.indexOf("</head>");

        expect(initializerPosition).toBeLessThan(headEndPosition);
    });
});
