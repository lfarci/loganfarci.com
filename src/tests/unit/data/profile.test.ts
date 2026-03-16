import { describe, it, expect } from "vitest";
import { mockProfile, mockDataModule } from "./helpers";

mockDataModule();

import { getProfile } from "@/core/data";

describe("getProfile", () => {
    it("returns an object", () => {
        expect(typeof getProfile()).toBe("object");
    });

    it("returns a non-null value", () => {
        expect(getProfile()).not.toBeNull();
    });

    it("returns the correct role", () => {
        expect(getProfile().role).toBe(mockProfile.role);
    });
});
