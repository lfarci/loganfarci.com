import { render, screen } from "@testing-library/react";
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
    it("renders an ordinary code block without requesting the diagram module", () => {
        render(<CodeSnippet className="language-typescript">const answer = 42;</CodeSnippet>);

        expect(diagramModuleRequested).not.toHaveBeenCalled();
    });

    it("reserves diagram space behind an accessible loading boundary", async () => {
        const { container } = render(<CodeSnippet className="language-mermaid">graph TD; A--&gt;B</CodeSnippet>);

        expect(screen.getByRole("status", { name: "Loading Mermaid diagram" })).toBeTruthy();
        expect(container.firstElementChild?.className).toContain("min-h-48");

        releaseDiagramModule();

        expect(await screen.findByRole("generic", { name: "Mermaid diagram" })).toBeTruthy();
    });
});
