import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockAzureIcon, mockReactIcon } from "../tools";

vi.mock("@/core/data", () => ({
    getIcons: () => [mockAzureIcon, mockReactIcon],
}));

beforeEach(() => {
    vi.resetModules();
});

import { getIcon } from "@/core/icons";

describe("getIcon", () => {
    it("returns a non-null value for a known icon name", () => {
        expect(getIcon("azure")).not.toBeNull();
    });

    it("returns icon data with a truthy src for a known icon name", () => {
        expect(getIcon("azure")?.src).toBeTruthy();
    });

    it("returns icon data whose alt contains 'icon' for a known icon name", () => {
        expect(getIcon("azure")?.alt).toContain("icon");
    });

    it("returns the same result regardless of input casing (lowercase)", () => {
        expect(getIcon("azure")).toEqual(getIcon("Azure"));
    });

    it("returns the same result regardless of input casing (uppercase)", () => {
        expect(getIcon("azure")).toEqual(getIcon("AZURE"));
    });

    it("returns null for an unknown icon name", () => {
        expect(getIcon("this-icon-does-not-exist-xyz")).toBeNull();
    });

    it("trims leading and trailing whitespace from the icon name", () => {
        expect(getIcon("  azure  ")).not.toBeNull();
    });
});
