import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the data module so the icon map is built from controlled data,
// not from the real icons.json file on disk.
vi.mock("@/core/data", () => ({
    getIcons: () => [
        { id: "azure", name: "Azure", icon: "/images/azure.svg" },
        { id: "react", name: "React", icon: "/images/react.svg" },
    ],
}));

// Re-import after mock so the icon cache is reset between tests
beforeEach(() => {
    vi.resetModules();
});

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
