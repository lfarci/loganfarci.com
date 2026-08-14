import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TooltipProvider } from "@/components/shared/primitives/TooltipPrimitives";
import { getExperiences } from "@/core/data";
import AboutPage from "./AboutPage";

vi.mock("@/components/shared/MermaidDiagram", () => ({
    default: ({ children }: { children: React.ReactNode }) => <div aria-label="Mermaid diagram">{children}</div>,
}));

function renderAboutPage() {
    return render(
        <TooltipProvider>
            <AboutPage />
        </TooltipProvider>,
    );
}

describe("AboutPage experience presentation", () => {
    it("renders every experience description directly without a disclosure control", () => {
        renderAboutPage();

        expect(screen.queryByRole("button")).toBeNull();
    });

    it("shows the full experience descriptions without clipping", () => {
        renderAboutPage();

        for (const experience of getExperiences()) {
            const summary = experience.description?.split("\n\n")[0];
            expect(summary).toBeTruthy();
            expect(screen.getByText(summary as string)).toBeTruthy();
        }
    });

    it("renders the achievement bullets for each experience", () => {
        renderAboutPage();

        const examples = getExperiences()
            .map((experience) => experience.description?.split("\n").at(-1)?.replace(/^- /u, ""))
            .filter(Boolean);

        for (const bullet of examples) {
            expect(screen.getByText(bullet as string)).toBeTruthy();
        }
    });
});
