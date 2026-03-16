import { describe, it, expect } from "vitest";
import { mockIcon, mockIcon2, mockDataModule } from "./helpers";

mockDataModule();

import { getIcons } from "@/core/data";

describe("getIcons", () => {
    it("returns an array", () => {
        expect(Array.isArray(getIcons())).toBe(true);
    });

    it("returns both mocked icons", () => {
        expect(getIcons()).toHaveLength(2);
    });

    it("returns the correct first icon id", () => {
        expect(getIcons()[0].id).toBe(mockIcon.id);
    });

    it("returns the correct second icon id", () => {
        expect(getIcons()[1].id).toBe(mockIcon2.id);
    });
});
