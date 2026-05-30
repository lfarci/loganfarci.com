import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ThemeProvider } from "@/contexts/ThemeContext";
import ThemeToggle from "./ThemeToggle";

describe("ThemeToggle", () => {
    it("renders the toggle button after mount and switches the theme", async () => {
        render(
            <ThemeProvider>
                <ThemeToggle />
            </ThemeProvider>
        );

        const button = await screen.findByRole("button", { name: "Switch to dark mode" });
        fireEvent.click(button);

        expect(await screen.findByRole("button", { name: "Switch to light mode" })).toBeTruthy();
        expect(localStorage.getItem("theme")).toBe("dark");
        expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
});
