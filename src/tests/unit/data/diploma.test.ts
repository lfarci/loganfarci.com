import { describe, it, expect } from "vitest";
import { mockDiploma, mockDataModule } from "./helpers";

mockDataModule();

import { getDiploma } from "@/core/data";

describe("getDiploma", () => {
    it("returns an object", () => {
        expect(typeof getDiploma()).toBe("object");
    });

    it("returns a non-null value", () => {
        expect(getDiploma()).not.toBeNull();
    });

    it("returns the correct diploma name", () => {
        expect(getDiploma().name).toBe(mockDiploma.name);
    });
});
