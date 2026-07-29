export type Theme = "light" | "dark";

export const colorSchemeQuery = "(prefers-color-scheme: dark)";
export const themeStorageKey = "theme";

interface ThemePreference {
    theme: Theme;
    hasExplicitPreference: boolean;
}

export function resolveThemePreference(savedTheme: string | null, systemPrefersDark: boolean): ThemePreference {
    const hasExplicitPreference = savedTheme === "light" || savedTheme === "dark";

    return { theme: hasExplicitPreference ? savedTheme : systemPrefersDark ? "dark" : "light", hasExplicitPreference };
}

function initializeTheme(storageKey: string, mediaQuery: string, resolvePreference: typeof resolveThemePreference) {
    const preference = resolvePreference(localStorage.getItem(storageKey), window.matchMedia(mediaQuery).matches);

    document.documentElement.classList.toggle("dark", preference.theme === "dark");
}

// Serialize the shared resolver into a blocking head script so pre-paint and hydrated behavior cannot drift.
export const themeInitializationScript =
    `(${initializeTheme.toString()})(${JSON.stringify(themeStorageKey)},` +
    `${JSON.stringify(colorSchemeQuery)},${resolveThemePreference.toString()});`;
