import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

import { resolveThemePreference, themeInitializationScript } from "./themeInitialization";

const themeScenarios = [
    {
        name: "system light with no saved preference",
        savedTheme: null,
        systemPrefersDark: false,
        expectedTheme: "light",
        expectedExplicit: false,
    },
    {
        name: "system dark with no saved preference",
        savedTheme: null,
        systemPrefersDark: true,
        expectedTheme: "dark",
        expectedExplicit: false,
    },
    {
        name: "saved light with a dark system",
        savedTheme: "light",
        systemPrefersDark: true,
        expectedTheme: "light",
        expectedExplicit: true,
    },
    {
        name: "saved dark with a light system",
        savedTheme: "dark",
        systemPrefersDark: false,
        expectedTheme: "dark",
        expectedExplicit: true,
    },
    {
        name: "invalid saved value with a dark system",
        savedTheme: "sepia",
        systemPrefersDark: true,
        expectedTheme: "dark",
        expectedExplicit: false,
    },
    {
        name: "invalid saved value with a light system",
        savedTheme: "sepia",
        systemPrefersDark: false,
        expectedTheme: "light",
        expectedExplicit: false,
    },
] as const;

function runThemeInitializer(savedTheme: string | null, systemPrefersDark: boolean) {
    let darkClassEnabled = false;

    runInNewContext(themeInitializationScript, {
        window: { matchMedia: vi.fn(() => ({ matches: systemPrefersDark })) },
        localStorage: { getItem: vi.fn(() => savedTheme) },
        document: {
            documentElement: {
                classList: {
                    toggle: vi.fn((className: string, enabled: boolean) => {
                        if (className === "dark") {
                            darkClassEnabled = enabled;
                        }
                    }),
                },
            },
        },
    });

    return darkClassEnabled;
}

describe("resolveThemePreference", () => {
    it.each(themeScenarios)("resolves $name", ({ savedTheme, systemPrefersDark, expectedTheme, expectedExplicit }) => {
        expect(resolveThemePreference(savedTheme, systemPrefersDark)).toEqual({
            theme: expectedTheme,
            hasExplicitPreference: expectedExplicit,
        });
    });
});

describe("themeInitializationScript", () => {
    it.each(themeScenarios)("applies $name", ({ savedTheme, systemPrefersDark, expectedTheme }) => {
        expect(runThemeInitializer(savedTheme, systemPrefersDark)).toBe(expectedTheme === "dark");
    });
});
