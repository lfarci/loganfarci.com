import { render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import MarkdownContent from "./MarkdownContent";

vi.mock("./MermaidDiagram", () => ({
    default: ({ children }: { children: React.ReactNode }) => <div aria-label="Mermaid diagram">{children}</div>,
}));

describe("MarkdownContent", () => {
    afterEach(() => {
        window.history.replaceState({}, "", "/");
    });

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

    it("routes Mermaid code fences to the diagram renderer", async () => {
        render(<MarkdownContent content={"```mermaid\ngraph TD; A-->B\n```"} />);

        expect((await screen.findByRole("generic", { name: "Mermaid diagram" })).textContent).toContain(
            "graph TD; A-->B",
        );
    });

    it("keeps raw HTML inert", () => {
        render(<MarkdownContent content={'<img src="invalid" alt="unsafe" />'} />);

        expect(screen.queryByRole("img", { name: "unsafe" })).toBeNull();
    });

    it("assigns collision-safe ids to duplicate article headings", () => {
        render(<MarkdownContent content={"## Repeat\n\n## Repeat\n\n## Repeat 2"} articleNavigation />);

        expect(screen.getAllByRole("heading").map((heading) => heading.id)).toEqual([
            "repeat",
            "repeat-2",
            "repeat-2-2",
        ]);
    });

    it("uses inline heading content in the permalink accessible name", () => {
        render(<MarkdownContent content={"## Install *with* `npm`"} articleNavigation />);

        expect(screen.getByRole("link", { name: 'Link to "Install with npm" section' }).getAttribute("href")).toBe(
            "#install-with-npm",
        );
    });

    it("keeps heading permalinks keyboard reachable", () => {
        render(<MarkdownContent content={"## Keyboard access"} articleNavigation />);

        const permalink = screen.getByRole("link", { name: 'Link to "Keyboard access" section' });
        permalink.focus();

        expect(document.activeElement).toBe(permalink);
    });

    it("keeps heading permalinks simple and hides them below desktop widths", () => {
        render(<MarkdownContent content={"## Responsive permalink"} articleNavigation />);

        const permalink = screen.getByRole("link", { name: 'Link to "Responsive permalink" section' });

        expect({
            hiddenByDefault: permalink.classList.contains("hidden"),
            visibleOnDesktop: permalink.classList.contains("lg:inline-flex"),
            hasHoverBackground: permalink.classList.contains("hover:bg-surface-hover"),
            hasFocusBackground: permalink.classList.contains("focus-visible:bg-surface-hover"),
            hasFocusOutline: permalink.classList.contains("focus-visible:outline-2"),
            hasFocusRing: permalink.classList.contains("focus-visible:ring-2"),
            hasRoundedContainer: Array.from(permalink.classList).some((className) => className.startsWith("rounded-")),
            suppressesBoxOutline: permalink.classList.contains("focus-visible:outline-none"),
            scalesFocusedGlyph: permalink.classList.contains("focus-visible:[&>svg]:scale-110"),
        }).toEqual({
            hiddenByDefault: true,
            visibleOnDesktop: true,
            hasHoverBackground: false,
            hasFocusBackground: false,
            hasFocusOutline: false,
            hasFocusRing: false,
            hasRoundedContainer: false,
            suppressesBoxOutline: true,
            scalesFocusedGlyph: true,
        });
    });

    it("preserves nested heading levels in the table of contents", () => {
        render(<MarkdownContent content={"## Parent\n\n### Child\n\n#### Detail"} articleNavigation />);

        const navigation = screen.getByRole("navigation", { name: "Table of contents" });

        expect(within(navigation).getAllByRole("list")).toHaveLength(3);
    });

    it("targets the shared heading ids from table-of-contents links", () => {
        render(<MarkdownContent content={"## Parent\n\n### Child\n\n## Next"} articleNavigation />);

        const navigation = screen.getByRole("navigation", { name: "Table of contents" });

        expect(
            within(navigation)
                .getAllByRole("link")
                .map((link) => link.getAttribute("href")),
        ).toEqual(["#parent", "#child", "#next"]);
    });

    it("omits the table of contents when too few headings justify it", () => {
        render(<MarkdownContent content={"## First\n\n## Second"} articleNavigation />);

        expect(screen.queryByRole("navigation", { name: "Table of contents" })).toBeNull();
    });

    it("does not add article navigation when there are no eligible headings", () => {
        render(<MarkdownContent content={"##### Small detail\n\nBody copy."} articleNavigation />);

        expect(screen.queryAllByRole("link")).toHaveLength(0);
    });

    it("provides a fragment target offset below the sticky header", () => {
        window.history.replaceState({}, "", "/articles/example#getting-started");
        render(<MarkdownContent content={"## Getting started"} articleNavigation />);

        const target = screen.getByRole("heading", { name: "Getting started" });

        expect(document.getElementById(window.location.hash.slice(1))).toBe(target);
        expect(target.className).toContain("scroll-mt-24");
    });

    it("renders heading ids and fragment links in static HTML", () => {
        const html = renderToStaticMarkup(
            <MarkdownContent content={"## First\n\n### Second\n\n## Third"} articleNavigation />,
        );

        expect([
            html.includes('id="first"'),
            html.includes('href="#first"'),
            html.includes("Table of contents"),
        ]).toEqual([true, true, true]);
    });
});
