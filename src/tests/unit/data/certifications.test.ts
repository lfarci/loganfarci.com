import { describe, it, expect, vi } from "vitest";

vi.mock("@content/data/certifications.json", () => ({
    default: [{
        title: "Test Cert",
        image: { src: "/cert.png", alt: "cert" },
        url: "https://example.com",
        issuer: "Issuer",
        date: "2024-01-01",
        relevance: "High",
        order: 1,
    }]
}));

import { getCertifications } from "@/core/data";

describe("getCertifications", () => {
    it("returns an array", () => {
        expect(Array.isArray(getCertifications())).toBe(true);
    });

    it("returns the mocked certification", () => {
        expect(getCertifications()).toHaveLength(1);
    });

    it("returns the correct certification title", () => {
        expect(getCertifications()[0].title).toBe("Test Cert");
    });
});
