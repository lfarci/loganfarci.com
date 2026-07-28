import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import MarkdownSection from "./MarkdownSection";

describe("MarkdownSection", () => {
    it("renders its heading and markdown content", () => {
        render(<MarkdownSection heading="Profile" content="A **short** introduction." />);

        expect(screen.getByRole("heading", { name: "Profile" })).toBeTruthy();
        expect(screen.getByText("short").tagName).toBe("STRONG");
    });

    it("renders the optional image with its accessible name and fixed dimensions", () => {
        render(
            <MarkdownSection
                heading="Profile"
                content="Introduction"
                imageSrc="/images/profile.avif"
                imageAlt="Logan speaking at a conference"
            />,
        );

        const image = screen.getByRole("img", { name: "Logan speaking at a conference" });
        expect(image.getAttribute("width")).toBe("300");
        expect(image.getAttribute("height")).toBe("300");
    });

    it("omits the optional image when no source is provided", () => {
        render(<MarkdownSection heading="Profile" content="Introduction" />);

        expect(screen.queryByRole("img")).toBeNull();
    });
});
