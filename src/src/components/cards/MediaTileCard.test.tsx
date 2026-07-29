import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import MediaTileCard from "./MediaTileCard";

describe("MediaTileCard", () => {
    it("renders its description at the normal body-text size", () => {
        render(<MediaTileCard title="Cloud" description="Build reliable cloud platforms." />);

        const description = screen.getByText("Build reliable cloud platforms.");

        expect(description.className).toContain("text-base");
        expect(description.className).toContain("md:text-[1.0625rem]");
    });
});
