import { describe, it, expect, vi } from "vitest";

vi.mock("@content/data/experiences.json", () => ({
    default: [{
        name: "Software Engineer",
        company: { name: "Acme", url: "https://acme.com" },
        start: "2022-01-01",
    }]
}));

import { getExperiences } from "@/core/data";

describe("getExperiences", () => {
    it("returns an array", () => {
        expect(Array.isArray(getExperiences())).toBe(true);
    });

    it("returns the mocked experience", () => {
        expect(getExperiences()).toHaveLength(1);
    });

    it("returns the correct experience name", () => {
        expect(getExperiences()[0].name).toBe("Software Engineer");
    });
});
