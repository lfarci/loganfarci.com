import { describe, it, expect } from "vitest";
import { getIcon } from "@/core/icons";

describe("getIcon", () => {
    it("returns icon data for a known icon name", () => {
        const icon = getIcon("azure");
        expect(icon).not.toBeNull();
        expect(icon?.src).toBeTruthy();
        expect(icon?.alt).toContain("icon");
    });

    it("is case-insensitive", () => {
        const lower = getIcon("azure");
        const upper = getIcon("Azure");
        const mixed = getIcon("AZURE");
        expect(lower).toEqual(upper);
        expect(lower).toEqual(mixed);
    });

    it("returns null for an unknown icon name", () => {
        const icon = getIcon("this-icon-does-not-exist-xyz");
        expect(icon).toBeNull();
    });

    it("trims whitespace from the icon name", () => {
        const icon = getIcon("  azure  ");
        expect(icon).not.toBeNull();
    });
});
