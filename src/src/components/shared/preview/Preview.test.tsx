import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TooltipProvider } from "@/components/shared/primitives/TooltipPrimitives";
import Preview from "./Preview";

function renderPreview() {
    render(
        <TooltipProvider>
            <Preview collapsedContent={<h2>Summary</h2>} expandedContent={<h2>Full details</h2>} />
        </TooltipProvider>,
    );
}

describe("Preview", () => {
    it("starts with the collapsed preview selected", () => {
        renderPreview();

        expect(screen.getByRole("heading", { name: "Summary" })).toBeTruthy();
    });

    it("expands the preview", () => {
        renderPreview();

        fireEvent.click(screen.getByRole("button", { name: "Show more" }));

        expect(screen.getByRole("heading", { name: "Full details" })).toBeTruthy();
        expect(screen.getByRole("button", { name: "Show less" })).toBeTruthy();
    });

    it("collapses an expanded preview", () => {
        renderPreview();
        fireEvent.click(screen.getByRole("button", { name: "Show more" }));

        fireEvent.click(screen.getByRole("button", { name: "Show less" }));

        expect(screen.getByRole("heading", { name: "Summary" })).toBeTruthy();
        expect(screen.getByRole("button", { name: "Show more" })).toBeTruthy();
    });
});
