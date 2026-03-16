import { describe, it, expect } from "vitest";
import { mockAzureIcon, mockReactIcon, mockIconsData } from "../tools";

mockIconsData([mockAzureIcon, mockReactIcon]);

import { getIcons } from "@/core/data";

describe("getIcons", () => {
    it("returns an array", () => {
        expect(Array.isArray(getIcons())).toBe(true);
    });

    it("returns both mocked icons", () => {
        expect(getIcons()).toHaveLength(2);
    });

    it("returns the correct first icon id", () => {
        expect(getIcons()[0].id).toBe(mockAzureIcon.id);
    });

    it("returns the correct second icon id", () => {
        expect(getIcons()[1].id).toBe(mockReactIcon.id);
    });
});
