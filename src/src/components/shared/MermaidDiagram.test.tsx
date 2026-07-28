import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import MermaidDiagram from "./MermaidDiagram";

const { initialize, run } = vi.hoisted(() => ({ initialize: vi.fn(), run: vi.fn() }));

vi.mock("mermaid", () => ({ default: { initialize, run } }));

describe("MermaidDiagram", () => {
    beforeEach(() => {
        run.mockResolvedValue(undefined);
    });

    it("initializes Mermaid with strict rendering security", async () => {
        render(<MermaidDiagram>graph TD; A--&gt;B</MermaidDiagram>);

        await waitFor(() => {
            expect(initialize).toHaveBeenCalledWith({ startOnLoad: false, securityLevel: "strict" });
        });
    });

    it("renders diagrams through the Mermaid container selector", async () => {
        render(<MermaidDiagram>graph TD; A--&gt;B</MermaidDiagram>);

        await waitFor(() => {
            expect(run).toHaveBeenCalledWith({ querySelector: ".mermaid" });
        });
    });

    it("reports Mermaid rendering failures without rejecting the component effect", async () => {
        const error = new Error("invalid diagram");
        const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
        run.mockRejectedValue(error);

        render(<MermaidDiagram>not valid Mermaid</MermaidDiagram>);

        await waitFor(() => {
            expect(consoleError).toHaveBeenCalledWith("Failed to render Mermaid diagram", error);
        });
    });
});
