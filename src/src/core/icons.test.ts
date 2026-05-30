import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./data", () => ({
    getIcons: () => [
        { id: "azure", name: "Azure", icon: "/images/azure.svg" },
        { id: "react", name: "React", icon: "/images/react.svg" },
    ],
}));

describe("getIcon", () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it("returns icon metadata for a known icon name", async () => {
        const { getIcon } = await import("./icons");

        expect(getIcon("azure")).toEqual({
            src: "/images/azure.svg",
            alt: "Azure icon",
        });
    });

    it("normalizes casing and whitespace before looking up icons", async () => {
        const { getIcon } = await import("./icons");

        expect(getIcon("azure")).toEqual(getIcon("Azure"));
        expect(getIcon("azure")).toEqual(getIcon("  AZURE  "));
    });

    it("returns null when the icon does not exist", async () => {
        const { getIcon } = await import("./icons");

        expect(getIcon("missing-icon")).toBeNull();
    });
});
