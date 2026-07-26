import { fireEvent, render, screen } from "@testing-library/react";
import { Link, MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

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

function NavigationTestWrapper() {
    return (
        <>
            <Link to="/about">Go to About</Link>
            <NavigationBar title="Logan Farci" />
        </>
    );
}

describe("NavigationBar", () => {
    it("updates the mobile menu ARIA state when toggled", () => {
        const { container } = renderNavigationBarWithProviders();

        const toggleButton = screen.getByRole("button", { name: /open menu/i });
        const menuId = toggleButton.getAttribute("aria-controls");
        const menu = menuId ? container.querySelector(`[id="${menuId}"]`) : null;

        expect(toggleButton.getAttribute("aria-expanded")).toBe("false");
        expect(menu?.getAttribute("aria-hidden")).toBe("true");

        fireEvent.click(toggleButton);

        const closeButton = screen.getByRole("button", { name: /close menu/i });
        expect(closeButton.getAttribute("aria-expanded")).toBe("true");
        expect(menu?.getAttribute("aria-hidden")).toBe("false");
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
});
