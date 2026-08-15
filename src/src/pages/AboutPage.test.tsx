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
    it("renders every experience summary directly without a disclosure control", () => {
        renderAboutPage();

        for (const experience of getExperiences()) {
            expect(screen.getByText(experience.summary)).toBeTruthy();
        }

        expect(screen.queryByRole("button")).toBeNull();
    });

    it("renders the achievement bullets as list items for each experience", () => {
        renderAboutPage();

        const allAchievements = getExperiences().flatMap((experience) => experience.achievements);

        expect(screen.getAllByRole("list")).toHaveLength(getExperiences().length);

        for (const achievement of allAchievements) {
            expect(screen.getByText(achievement)).toBeTruthy();
        }
    });
});
