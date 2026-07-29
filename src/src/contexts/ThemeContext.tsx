import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { colorSchemeQuery, resolveThemePreference, themeStorageKey, type Theme } from "@/core/themeInitialization";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    readonly children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>("light");
    const [hasExplicitPreference, setHasExplicitPreference] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const preference = resolveThemePreference(
            localStorage.getItem(themeStorageKey),
            window.matchMedia(colorSchemeQuery).matches,
        );

        setTheme(preference.theme);
        setHasExplicitPreference(preference.hasExplicitPreference);
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        root.classList.toggle("dark", theme === "dark");

        if (hasExplicitPreference) {
            localStorage.setItem(themeStorageKey, theme);
        }
    }, [theme, hasExplicitPreference, mounted]);

    useEffect(() => {
        if (!mounted || hasExplicitPreference) return;

        const mediaQuery = window.matchMedia(colorSchemeQuery);
        const syncSystemTheme = (event: MediaQueryListEvent) => {
            setTheme(event.matches ? "dark" : "light");
        };

        mediaQuery.addEventListener("change", syncSystemTheme);
        return () => mediaQuery.removeEventListener("change", syncSystemTheme);
    }, [hasExplicitPreference, mounted]);

    const toggleTheme = () => {
        setHasExplicitPreference(true);
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

    if (!mounted) {
        return <>{children}</>;
    }

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        // During SSR or if used outside provider, return default values
        if (typeof window === "undefined") {
            return { theme: "light" as Theme, toggleTheme: () => {} };
        }
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
