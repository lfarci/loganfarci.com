import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import LayoutWrapper from "./LayoutWrapper";
import { ThemeProvider } from "@/contexts/ThemeContext";

function renderLayoutWrapper() {
    return render(
        <ThemeProvider>
            <MemoryRouter>
                <LayoutWrapper>Page content</LayoutWrapper>
            </MemoryRouter>
        </ThemeProvider>,
    );
}

describe("LayoutWrapper", () => {
    it("renders the skip link as the first focusable element", () => {
        renderLayoutWrapper();

        const skipLink = screen.getByRole("link", { name: "Skip to content" });
        const firstFocusableElement = document.querySelector("a[href], button:not([disabled]), [tabindex]");

        expect(firstFocusableElement).toBe(skipLink);
    });

    it("targets the main content landmark", () => {
        renderLayoutWrapper();

        const skipLink = screen.getByRole("link", { name: "Skip to content" });
        const mainContent = screen.getByRole("main");

        expect(skipLink.getAttribute("href")).toBe(`#${mainContent.id}`);
    });

    it("makes the main content programmatically focusable", () => {
        renderLayoutWrapper();

        const mainContent = screen.getByRole("main");

        expect(mainContent.getAttribute("tabindex")).toBe("-1");
    });
});
