import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "./Badge";

describe("Badge", () => {
    it("uses a distinct surface and strong border", () => {
        render(<Badge>Azure</Badge>);

        expect(screen.getByText("Azure").className).toContain("border-border-strong");
        expect(screen.getByText("Azure").className).toContain("bg-surface");
    });
});
