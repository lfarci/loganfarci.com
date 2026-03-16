import { describe, it, expect } from "vitest";
import { mockInterest, mockInterestsData } from "../tools";

mockInterestsData();

import { getInterests } from "@/core/data";

describe("getInterests", () => {
    it("returns an array", () => {
        expect(Array.isArray(getInterests())).toBe(true);
    });

    it("returns the mocked interest", () => {
        expect(getInterests()).toHaveLength(1);
    });

    it("returns the correct interest title", () => {
        expect(getInterests()[0].title).toBe(mockInterest.title);
    });
});
