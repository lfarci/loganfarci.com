import { fireEvent, render, screen, within } from "@testing-library/react";
import { Link, MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";

import NavigationBar from "./NavigationBar";
import { ThemeProvider } from "@/contexts/ThemeContext";

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

    it("opens and closes the mobile menu when the toggle button is clicked", () => {
        renderNavigationBarWithProviders();

        const toggleButton = screen.getByRole("button", { name: /open menu/i });
        const menu = getMenuElement();

        expect(toggleButton.getAttribute("aria-expanded")).toBe("false");
        expect(menu.getAttribute("aria-hidden")).toBe("true");

        fireEvent.click(toggleButton);

        const closeButton = screen.getByRole("button", { name: /close menu/i });
        expect(closeButton.getAttribute("aria-expanded")).toBe("true");
        expect(menu.getAttribute("aria-hidden")).toBe("false");

        fireEvent.click(closeButton);

        const reopenedToggleButton = screen.getByRole("button", { name: /open menu/i });
        expect(reopenedToggleButton.getAttribute("aria-expanded")).toBe("false");
        expect(menu.getAttribute("aria-hidden")).toBe("true");
    });

    it("closes the mobile menu when a navigation item is clicked", () => {
        renderNavigationBarWithProviders();

        fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
        const menu = getMenuElement();

        expect(menu.getAttribute("aria-hidden")).toBe("false");
        fireEvent.click(within(menu).getByRole("link", { name: "About" }));

        const reopenedToggleButton = screen.getByRole("button", { name: /open menu/i });
        expect(reopenedToggleButton.getAttribute("aria-expanded")).toBe("false");
        expect(menu.getAttribute("aria-hidden")).toBe("true");
    });

    it("closes the mobile menu when Escape is pressed", () => {
        renderNavigationBarWithProviders();

        const toggleButton = screen.getByRole("button", { name: /open menu/i });
        fireEvent.click(toggleButton);
        const closeButton = screen.getByRole("button", { name: /close menu/i });

        expect(closeButton.getAttribute("aria-expanded")).toBe("true");

        fireEvent.keyDown(closeButton, { key: "Escape" });

        const reopenedToggleButton = screen.getByRole("button", { name: /open menu/i });
        expect(reopenedToggleButton.getAttribute("aria-expanded")).toBe("false");
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
        setViewportWidth(390);
        renderNavigationBarWithProviders();

        fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
        expect(screen.getByRole("button", { name: /close menu/i }).getAttribute("aria-expanded")).toBe("true");

        setViewportWidth(1280, true);

        const toggleButtonAfterResize = screen.getByRole("button", { name: /open menu/i });
        expect(toggleButtonAfterResize.getAttribute("aria-expanded")).toBe("false");
    });
});
