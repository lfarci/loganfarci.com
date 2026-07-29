import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";
const colorSchemeQuery = "(prefers-color-scheme: dark)";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    readonly children: React.ReactNode;
}

function getSavedTheme(): Theme | null {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "light" || savedTheme === "dark" ? savedTheme : null;
}

function getSystemTheme(mediaQuery: MediaQueryList): Theme {
    return mediaQuery.matches ? "dark" : "light";
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>("light");
    const [hasExplicitPreference, setHasExplicitPreference] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedTheme = getSavedTheme();
        const systemTheme = getSystemTheme(window.matchMedia(colorSchemeQuery));

        setTheme(savedTheme ?? systemTheme);
        setHasExplicitPreference(savedTheme !== null);
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        root.classList.toggle("dark", theme === "dark");

        if (hasExplicitPreference) {
            localStorage.setItem("theme", theme);
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
