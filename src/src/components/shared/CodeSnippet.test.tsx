import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import CodeSnippet from "./CodeSnippet";

const { diagramModuleRequested, releaseDiagramModule, waitForDiagramModule } = vi.hoisted(() => {
    let releaseDiagramModule = () => undefined;
    const waitForDiagramModule = new Promise<void>((resolve) => {
        releaseDiagramModule = resolve;
    });

    return { diagramModuleRequested: vi.fn(), releaseDiagramModule, waitForDiagramModule };
});

vi.mock("./MermaidDiagram", async () => {
    diagramModuleRequested();
    await waitForDiagramModule;

    return {
        default: ({ children }: { children: React.ReactNode }) => <div aria-label="Mermaid diagram">{children}</div>,
    };
});

describe("CodeSnippet", () => {
    it("preserves inline code without block controls", () => {
        const { container } = render(<CodeSnippet>npm install</CodeSnippet>);

        expect({
            element: container.firstElementChild?.tagName,
            keepsInlineRadius: container.firstElementChild?.classList.contains("rounded-sm"),
            copyControl: screen.queryByRole("button"),
        }).toEqual({ element: "CODE", keepsInlineRadius: true, copyControl: null });
    });

    it("renders an ordinary code block without requesting the diagram module", () => {
        render(<CodeSnippet className="language-typescript">const answer = 42;</CodeSnippet>);

        expect(diagramModuleRequested).not.toHaveBeenCalled();
    });

    it("displays the declared language with an accessible copy control", () => {
        render(<CodeSnippet className="language-typescript">const answer = 42;</CodeSnippet>);

        expect({
            language: screen.getByText("typescript").textContent,
            copyControl: screen.getByRole("button", { name: "Copy typescript code" }).textContent,
        }).toEqual({ language: "typescript", copyControl: "Copy" });
    });

    it("copies fenced code and exposes success feedback", async () => {
        const writeText = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
        render(<CodeSnippet className="language-typescript">{"const answer = 42;\n"}</CodeSnippet>);

        fireEvent.click(screen.getByRole("button", { name: "Copy typescript code" }));

        await waitFor(() => expect(writeText).toHaveBeenCalledWith("const answer = 42;"));
        expect({
            visibleFeedback: screen.getByRole("button", { name: "Copy typescript code" }).textContent,
            announcedFeedback: screen.getByRole("status").textContent,
        }).toEqual({ visibleFeedback: "Copied", announcedFeedback: "Code copied to clipboard." });
    });

    it("exposes copy failures to sighted users and assistive technology", async () => {
        const writeText = vi.fn().mockRejectedValue(new Error("Clipboard unavailable"));
        Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
        render(<CodeSnippet className="language-shell">npm run build</CodeSnippet>);

        fireEvent.click(screen.getByRole("button", { name: "Copy shell code" }));

        await waitFor(() =>
            expect(screen.getByRole("status").textContent).toBe("Could not copy code to the clipboard."),
        );
        expect(screen.getByRole("button", { name: "Copy shell code" }).textContent).toBe("Copy failed");
    });

    it("keeps long code keyboard-scrollable inside the shared block container", () => {
        render(<CodeSnippet className="language-text">A_really_long_line_without_breaks</CodeSnippet>);
        const codeViewport = screen.getByLabelText("text code");
        const container = codeViewport.parentElement;

        expect({
            semanticRadius: container?.classList.contains("rounded-card"),
            subtleBorder: container?.classList.contains("border-border-light"),
            elevatedSurface: container?.classList.contains("bg-surface-elevated"),
            clippedShell: container?.classList.contains("overflow-hidden"),
            internalScroll: codeViewport.classList.contains("overflow-x-auto"),
            keyboardScrollable: codeViewport.getAttribute("tabindex"),
        }).toEqual({
            semanticRadius: true,
            subtleBorder: true,
            elevatedSurface: true,
            clippedShell: true,
            internalScroll: true,
            keyboardScrollable: "0",
        });
    });

    it("reserves diagram space behind an accessible loading boundary", async () => {
        const { container } = render(<CodeSnippet className="language-mermaid">graph TD; A--&gt;B</CodeSnippet>);

        expect(screen.getByRole("status", { name: "Loading Mermaid diagram" })).toBeTruthy();
        expect({
            sharedContainer: container.firstElementChild?.classList.contains("rounded-card"),
            reservedViewport: screen
                .getByRole("region", { name: "Mermaid diagram viewport" })
                .classList.contains("min-h-48"),
            copyControl: screen.queryByRole("button"),
        }).toEqual({ sharedContainer: true, reservedViewport: true, copyControl: null });

        releaseDiagramModule();

        expect(await screen.findByRole("generic", { name: "Mermaid diagram" })).toBeTruthy();
    });

    it("renders fenced content and controls in static HTML", () => {
        const html = renderToStaticMarkup(
            <CodeSnippet className="language-typescript">const answer = 42;</CodeSnippet>,
        );

        expect({
            language: html.includes(">typescript<"),
            code: html.includes("const answer = 42;"),
            copyControl: html.includes('aria-label="Copy typescript code"'),
            statusRegion: html.includes('role="status"'),
        }).toEqual({ language: true, code: true, copyControl: true, statusRegion: true });
    });
});
