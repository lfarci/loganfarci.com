import { describe, it, expect, vi } from "vitest";

vi.mock("@content/data/education.json", () => ({
    default: {
        name: "Master CS",
        University: "Test University",
        logo: { src: "/logo.png", alt: "logo" },
        details: ["Detail 1"],
        description: "A degree",
    }
}));

import { getDiploma } from "@/core/data";

describe("getDiploma", () => {
    it("returns an object", () => {
        expect(typeof getDiploma()).toBe("object");
    });

    it("returns a non-null value", () => {
        expect(getDiploma()).not.toBeNull();
    });

    it("returns the correct diploma name", () => {
        expect(getDiploma().name).toBe("Master CS");
    });
});
