import { describe, it, expect, vi } from "vitest";

vi.mock("@content/data/interests.json", () => ({
    default: [{
        title: "Open Source",
        image: { src: "/oss.png", alt: "oss" },
        description: "Contributing to OSS",
    }]
}));

import { getInterests } from "@/core/data";

describe("getInterests", () => {
    it("returns an array", () => {
        expect(Array.isArray(getInterests())).toBe(true);
    });

    it("returns the mocked interest", () => {
        expect(getInterests()).toHaveLength(1);
    });

    it("returns the correct interest title", () => {
        expect(getInterests()[0].title).toBe("Open Source");
    });
});
