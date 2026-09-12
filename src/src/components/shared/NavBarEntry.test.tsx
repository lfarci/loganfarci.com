import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import NavBarEntry from "./NavBarEntry";

describe("NavBarEntry", () => {
    it("renders application routes through the router", () => {
        render(
            <MemoryRouter>
                <NavBarEntry url="/about">About</NavBarEntry>
            </MemoryRouter>,
        );

        expect(screen.getByRole("link", { name: "About" }).getAttribute("href")).toBe("/about");
    });

    it("renders file downloads as native anchors", () => {
        render(
            <NavBarEntry url="/resume.pdf" download>
                Résumé
            </NavBarEntry>,
        );

        const link = screen.getByRole("link", { name: "Résumé" });
        expect(link.getAttribute("href")).toBe("/resume.pdf");
        expect(link.hasAttribute("download")).toBe(true);
    });

    it("marks the active application route for assistive technology", () => {
        render(
            <MemoryRouter>
                <NavBarEntry url="/about" active>
                    About
                </NavBarEntry>
            </MemoryRouter>,
        );

        expect(screen.getByRole("link", { name: "About" }).getAttribute("aria-current")).toBe("page");
    });
});
