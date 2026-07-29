import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeProvider } from "@/contexts/ThemeContext";
import ThemeToggle from "./ThemeToggle";

describe("ThemeToggle", () => {
    let systemPrefersDark = false;
    let colorSchemeListeners: Set<(event: MediaQueryListEvent) => void>;

    beforeEach(() => {
        colorSchemeListeners = new Set();
        systemPrefersDark = false;

        vi.mocked(window.matchMedia).mockImplementation(
            (query: string) =>
                ({
                    get matches() {
                        return systemPrefersDark;
                    },
                    media: query,
                    onchange: null,
                    addListener: vi.fn(),
                    removeListener: vi.fn(),
                    addEventListener: vi.fn((_type: string, listener: (event: MediaQueryListEvent) => void) => {
                        colorSchemeListeners.add(listener);
                    }),
                    removeEventListener: vi.fn((_type: string, listener: (event: MediaQueryListEvent) => void) => {
                        colorSchemeListeners.delete(listener);
                    }),
                    dispatchEvent: vi.fn(),
                }) as MediaQueryList,
        );
    });

    function setSystemPreference(prefersDark: boolean) {
        systemPrefersDark = prefersDark;
        const event = { matches: prefersDark } as MediaQueryListEvent;
        colorSchemeListeners.forEach((listener) => listener(event));
    }

    it("renders the toggle button after mount and switches the theme", async () => {
        render(
            <ThemeProvider>
                <ThemeToggle />
            </ThemeProvider>,
        );

        const button = await screen.findByRole("button", { name: "Switch to dark mode" });
        fireEvent.click(button);

        expect(await screen.findByRole("button", { name: "Switch to light mode" })).toBeTruthy();
        expect(localStorage.getItem("theme")).toBe("dark");
        expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("uses the system color scheme without saving it as an explicit preference", async () => {
        systemPrefersDark = true;

        render(
            <ThemeProvider>
                <ThemeToggle />
            </ThemeProvider>,
        );

        expect(await screen.findByRole("button", { name: "Switch to light mode" })).toBeTruthy();
        expect(localStorage.getItem("theme")).toBeNull();
        expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("prefers a saved theme over the system color scheme", async () => {
        systemPrefersDark = true;
        localStorage.setItem("theme", "light");

        render(
            <ThemeProvider>
                <ThemeToggle />
            </ThemeProvider>,
        );

        expect(await screen.findByRole("button", { name: "Switch to dark mode" })).toBeTruthy();
        expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("follows system color scheme changes without an explicit preference", async () => {
        render(
            <ThemeProvider>
                <ThemeToggle />
            </ThemeProvider>,
        );
        await screen.findByRole("button", { name: "Switch to dark mode" });

        act(() => setSystemPreference(true));

        expect(await screen.findByRole("button", { name: "Switch to light mode" })).toBeTruthy();
        expect(localStorage.getItem("theme")).toBeNull();
    });

    it("stops following system changes after the visitor chooses a theme", async () => {
        render(
            <ThemeProvider>
                <ThemeToggle />
            </ThemeProvider>,
        );
        const button = await screen.findByRole("button", { name: "Switch to dark mode" });
        fireEvent.click(button);
        await waitFor(() => expect(localStorage.getItem("theme")).toBe("dark"));

        act(() => setSystemPreference(false));

        expect(await screen.findByRole("button", { name: "Switch to light mode" })).toBeTruthy();
    });
});
