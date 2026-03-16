import { describe, it, expect } from "vitest";
import { mockCertification, mockCertificationsData } from "../tools";

mockCertificationsData();

import { getCertifications } from "@/core/data";

describe("getCertifications", () => {
    it("returns an array", () => {
        expect(Array.isArray(getCertifications())).toBe(true);
    });

    it("returns the mocked certification", () => {
        expect(getCertifications()).toHaveLength(1);
    });

    it("returns the correct certification title", () => {
        expect(getCertifications()[0].title).toBe(mockCertification.title);
    });
});
