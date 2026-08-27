import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TooltipProvider } from "@/components/shared/primitives/TooltipPrimitives";
import MarkdownPreview from "./MarkdownPreview";

function renderMarkdownPreview() {
    return render(
        <TooltipProvider>
            <MarkdownPreview>## Preview details</MarkdownPreview>
        </TooltipProvider>,
    );
}

describe("MarkdownPreview", () => {
    it("starts collapsed", () => {
        renderMarkdownPreview();

        expect(screen.getByRole("button", { name: "Show more" })).toBeTruthy();
    });

    it("expands the preview", () => {
        renderMarkdownPreview();

        fireEvent.click(screen.getByRole("button", { name: "Show more" }));

        expect(screen.getByRole("button", { name: "Show less" })).toBeTruthy();
    });

    it("collapses an expanded preview", () => {
        renderMarkdownPreview();
        fireEvent.click(screen.getByRole("button", { name: "Show more" }));

        fireEvent.click(screen.getByRole("button", { name: "Show less" }));

        expect(screen.getByRole("button", { name: "Show more" })).toBeTruthy();
    });

    it("fades collapsed content into the elevated card surface", () => {
        const { container } = renderMarkdownPreview();

        expect(container.querySelector(".to-surface-elevated")).toBeTruthy();
    });
});
