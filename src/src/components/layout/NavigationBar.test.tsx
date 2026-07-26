import { fireEvent, render, screen, within } from "@testing-library/react";
import { Link, MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";

import NavigationBar from "./NavigationBar";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MD_BREAKPOINT_WIDTH } from "@/core/breakpoints";

const MOBILE_VIEWPORT_WIDTH = MD_BREAKPOINT_WIDTH - 1;

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

    if (triggerResize) {
        fireEvent(window, new Event("resize"));
    }
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
    afterEach(() => {
        setViewportWidth(1024);
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
        expect(screen.getByRole("button", { name: /close menu/i }).getAttribute("aria-expanded")).toBe("true");

        setViewportWidth(1280, true);

        const toggleButtonAfterResize = screen.getByRole("button", { name: /open menu/i });
        expect(toggleButtonAfterResize.getAttribute("aria-expanded")).toBe("false");
    });
});
