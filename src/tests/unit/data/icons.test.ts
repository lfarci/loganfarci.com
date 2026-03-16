import { describe, it, expect, vi } from "vitest";

vi.mock("@content/data/icons.json", () => ({
    default: [
        { id: "azure", name: "Azure", icon: "/images/azure.svg" },
        { id: "react", name: "React", icon: "/images/react.svg" },
    ]
}));

import { getIcons } from "@/core/data";

describe("getIcons", () => {
    it("returns an array", () => {
        expect(Array.isArray(getIcons())).toBe(true);
    });

    it("returns both mocked icons", () => {
        expect(getIcons()).toHaveLength(2);
    });

    it("returns the correct first icon id", () => {
        expect(getIcons()[0].id).toBe("azure");
    });

    it("returns the correct second icon id", () => {
        expect(getIcons()[1].id).toBe("react");
    });
});
