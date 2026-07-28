import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import MarkdownContent from "./MarkdownContent";

vi.mock("./MermaidDiagram", () => ({
    default: ({ children }: { children: React.ReactNode }) => <div aria-label="Mermaid diagram">{children}</div>,
}));

describe("MarkdownContent", () => {
    it("maps a body-level heading to a level-two heading", () => {
        render(<MarkdownContent content="# Body heading" />);

        expect(screen.getByRole("heading", { level: 2, name: "Body heading" })).toBeTruthy();
    });

    it("renders GFM tables with their accessible table role", () => {
        render(<MarkdownContent content={"| Name | Value |\n| --- | --- |\n| Test | Passed |"} />);

        expect(screen.getByRole("table")).toBeTruthy();
    });

    it("opens rendered links in a new tab", () => {
        render(<MarkdownContent content="[Project](https://example.com)" />);

        expect(screen.getByRole("link", { name: "Project" }).getAttribute("target")).toBe("_blank");
    });

    it("routes Mermaid code fences to the diagram renderer", () => {
        render(<MarkdownContent content={"```mermaid\ngraph TD; A-->B\n```"} />);

        expect(screen.getByRole("generic", { name: "Mermaid diagram" }).textContent).toContain("graph TD; A-->B");
    });

    it("keeps raw HTML inert", () => {
        render(<MarkdownContent content={'<img src="invalid" alt="unsafe" />'} />);

        expect(screen.queryByRole("img", { name: "unsafe" })).toBeNull();
    });
});
