import { fireEvent, render, screen, within } from "@testing-library/react";
import { Link, MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import NavigationBar from "./NavigationBar";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MD_BREAKPOINT_WIDTH } from "@/core/breakpoints";

const MOBILE_VIEWPORT_WIDTH = MD_BREAKPOINT_WIDTH - 1;

function calculateMinWidthThreshold(query: string, rootFontSize: number): number | null {
    // Test helper supports the min-width queries used by NavigationBar: (min-width: <value>rem|px).
    const minWidthMatch = query.match(/\(min-width:\s*([0-9.]+)(rem|px)\)/i);
    if (minWidthMatch === null) {
        return null;
    }

    const unitMultiplier = minWidthMatch[2].toLowerCase() === "rem" ? rootFontSize : 1;
    return Number.parseFloat(minWidthMatch[1]) * unitMultiplier;
}

function renderNavigationBarWithProviders() {
    return render(
        <ThemeProvider>
            <MemoryRouter initialEntries={["/"]}>
                <NavigationBar title="Logan Farci" />
            </MemoryRouter>
        </ThemeProvider>
    );
}

function setViewportWidth(width: number, triggerResize = false) {
    Object.defineProperty(window, "innerWidth", {
        configurable: true,
        writable: true,
        value: width,
    });
    Object.defineProperty(window, "matchMedia", {
        configurable: true,
        writable: true,
        value: (query: string) => {
            const rootFontSize = Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16;
            const minWidthThreshold = calculateMinWidthThreshold(query, rootFontSize);
            const matches = minWidthThreshold === null ? false : width >= minWidthThreshold;

            return {
                matches,
                media: query,
                onchange: null,
                addListener: () => {},
                removeListener: () => {},
                addEventListener: () => {},
                removeEventListener: () => {},
                dispatchEvent: () => false,
            };
        },
    });

    if (triggerResize) {
        fireEvent(window, new Event("resize"));
    }
}

function setRootFontSize(fontSizePx: number) {
    document.documentElement.style.fontSize = `${fontSizePx}px`;
}

function getMenuElement(): HTMLElement {
    const toggleButton = screen.getByRole("button", { name: /open menu|close menu/i });
    const menuId = toggleButton.getAttribute("aria-controls");
    if (!menuId) {
        throw new Error("Expected toggle button to reference a menu element");
    }

    const menu = document.getElementById(menuId);
    if (!(menu instanceof HTMLElement)) {
        throw new Error("Expected referenced mobile menu element to exist");
    }

    return menu;
}

function NavigationTestWrapper() {
    return (
        <>
            <Link to="/about">Go to About</Link>
            <NavigationBar title="Logan Farci" />
        </>
    );
}

describe("NavigationBar", () => {
    beforeEach(() => {
        setRootFontSize(16);
    });

    afterEach(() => {
        setViewportWidth(1024);
        document.documentElement.style.fontSize = "";
    });

    it("starts with the mobile menu toggle collapsed", () => {
        renderNavigationBarWithProviders();

        const toggleButton = screen.getByRole("button", { name: /open menu/i });
        expect(toggleButton.getAttribute("aria-expanded")).toBe("false");
    });

    it("starts with the mobile menu hidden", () => {
        renderNavigationBarWithProviders();

        const menu = getMenuElement();
        expect(menu.getAttribute("aria-hidden")).toBe("true");
    });

    it("opens the mobile menu when the toggle button is clicked", () => {
        renderNavigationBarWithProviders();

        fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
        expect(screen.getByRole("button", { name: /close menu/i }).getAttribute("aria-expanded")).toBe("true");
    });

    it("reveals the mobile menu content when the toggle button is clicked", () => {
        renderNavigationBarWithProviders();

        const menu = getMenuElement();
        fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
        expect(menu.getAttribute("aria-hidden")).toBe("false");
    });

    it("closes the mobile menu when the close button is clicked", () => {
        renderNavigationBarWithProviders();

        fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
        fireEvent.click(screen.getByRole("button", { name: /close menu/i }));
        expect(screen.getByRole("button", { name: /open menu/i }).getAttribute("aria-expanded")).toBe("false");
    });

    it("hides the mobile menu content when the close button is clicked", () => {
        renderNavigationBarWithProviders();

        const menu = getMenuElement();
        fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
        fireEvent.click(screen.getByRole("button", { name: /close menu/i }));
        expect(menu.getAttribute("aria-hidden")).toBe("true");
    });

    it("closes the mobile menu when a navigation item is clicked", () => {
        renderNavigationBarWithProviders();

        fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
        const menu = getMenuElement();

        fireEvent.click(within(menu).getByRole("link", { name: "About" }));
        expect(screen.getByRole("button", { name: /open menu/i }).getAttribute("aria-expanded")).toBe("false");
    });

    it("closes the mobile menu when Escape is pressed", () => {
        renderNavigationBarWithProviders();

        const toggleButton = screen.getByRole("button", { name: /open menu/i });
        fireEvent.click(toggleButton);
        const closeButton = screen.getByRole("button", { name: /close menu/i });

        fireEvent.keyDown(closeButton, { key: "Escape" });
        expect(screen.getByRole("button", { name: /open menu/i }).getAttribute("aria-expanded")).toBe("false");
    });

    it("closes the mobile menu when the pathname changes", () => {
        render(
            <ThemeProvider>
                <MemoryRouter initialEntries={["/"]}>
                    <NavigationTestWrapper />
                </MemoryRouter>
            </ThemeProvider>
        );

        fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
        fireEvent.click(screen.getByRole("link", { name: "Go to About" }));

        const toggleButtonAfterPathChange = screen.getByRole("button", { name: /open menu/i });
        expect(toggleButtonAfterPathChange.getAttribute("aria-expanded")).toBe("false");
    });

    it("closes an open mobile menu after resizing to desktop width", () => {
        // Use a width below Tailwind's md breakpoint to emulate a mobile viewport.
        setViewportWidth(MOBILE_VIEWPORT_WIDTH);
        renderNavigationBarWithProviders();

        fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
        setViewportWidth(1280, true);

        const toggleButtonAfterResize = screen.getByRole("button", { name: /open menu/i });
        expect(toggleButtonAfterResize.getAttribute("aria-expanded")).toBe("false");
    });

    it("keeps the mobile menu open below the md media query threshold", () => {
        setRootFontSize(20);
        setViewportWidth(940);
        renderNavigationBarWithProviders();

        fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
        setViewportWidth(940, true);

        expect(screen.getByRole("button", { name: /close menu/i }).getAttribute("aria-expanded")).toBe("true");
    });

    it("closes the mobile menu when viewport satisfies the md media query threshold", () => {
        setRootFontSize(20);
        setViewportWidth(940);
        renderNavigationBarWithProviders();

        fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
        setViewportWidth(960, true);

        expect(screen.getByRole("button", { name: /open menu/i }).getAttribute("aria-expanded")).toBe("false");
    });
});
