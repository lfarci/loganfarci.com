import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router";
import { describe, expect, it } from "vitest";

import NavigationBar from "./NavigationBar";

function renderNavigationBar() {
    return render(
        <MemoryRouter initialEntries={["/"]}>
            <NavigationBar title="Logan Farci" />
        </MemoryRouter>
    );
}

function NavigationBarWithPathChanger() {
    const navigate = useNavigate();

    return (
        <>
            <button type="button" onClick={() => navigate("/about")}>Go to about</button>
            <NavigationBar title="Logan Farci" />
        </>
    );
}

describe("NavigationBar", () => {
    it("updates the mobile menu ARIA state when toggled", () => {
        renderNavigationBar();

        const toggleButton = screen.getByRole("button", { name: /open menu/i });
        const menuId = toggleButton.getAttribute("aria-controls");
        const menu = menuId ? document.getElementById(menuId) : null;

        expect(toggleButton.getAttribute("aria-expanded")).toBe("false");
        expect(menu?.getAttribute("aria-hidden")).toBe("true");

        fireEvent.click(toggleButton);

        const closeButton = screen.getByRole("button", { name: /close menu/i });
        expect(closeButton.getAttribute("aria-expanded")).toBe("true");
        expect(menu?.getAttribute("aria-hidden")).toBe("false");
    });

    it("closes the mobile menu when Escape is pressed", () => {
        renderNavigationBar();

        const toggleButton = screen.getByRole("button", { name: /open menu/i });
        fireEvent.click(toggleButton);

        expect(screen.getByRole("button", { name: /close menu/i }).getAttribute("aria-expanded")).toBe("true");

        fireEvent.keyDown(window, { key: "Escape" });

        expect(screen.getByRole("button", { name: /open menu/i }).getAttribute("aria-expanded")).toBe("false");
    });

    it("closes the mobile menu when the pathname changes", () => {
        render(
            <MemoryRouter initialEntries={["/"]}>
                <NavigationBarWithPathChanger />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
        fireEvent.click(screen.getByRole("button", { name: /go to about/i }));

        expect(screen.getByRole("button", { name: /open menu/i }).getAttribute("aria-expanded")).toBe("false");
    });
});
