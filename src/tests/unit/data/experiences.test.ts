import { describe, it, expect } from "vitest";
import { mockExperience, mockExperiencesData } from "../tools";

mockExperiencesData();

import { getExperiences } from "@/core/data";

describe("getExperiences", () => {
    it("returns an array", () => {
        expect(Array.isArray(getExperiences())).toBe(true);
    });

    it("returns the mocked experience", () => {
        expect(getExperiences()).toHaveLength(1);
    });

    it("returns the correct experience name", () => {
        expect(getExperiences()[0].name).toBe(mockExperience.name);
    });
});
