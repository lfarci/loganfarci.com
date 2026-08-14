import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
    vi.resetModules();
    vi.doUnmock("@content/data/certifications.json");
    vi.doUnmock("@content/data/experiences.json");
});

describe("structured-data date contracts", () => {
    it("rejects a certification date outside the YYYY-MM-DD format", async () => {
        vi.doMock("@content/data/certifications.json", () => ({ default: [{ date: "2024/01/01" }] }));
        const { getCertifications } = await import("./data");

        expect(() => getCertifications()).toThrowError("certifications[0].date must use the YYYY-MM-DD date format.");
    });

    it("rejects an experience start date outside the YYYY-MM-DD format", async () => {
        vi.doMock("@content/data/experiences.json", () => ({ default: [{ start: "2024-01-01T00:00:00Z" }] }));
        const { getExperiences } = await import("./data");

        expect(() => getExperiences()).toThrowError("experiences[0].start must use the YYYY-MM-DD date format.");
    });

    it("rejects an experience end date outside the YYYY-MM-DD format", async () => {
        vi.doMock("@content/data/experiences.json", () => ({
            default: [{ start: "2024-01-01", end: "January 2025" }],
        }));
        const { getExperiences } = await import("./data");

        expect(() => getExperiences()).toThrowError("experiences[0].end must use the YYYY-MM-DD date format.");
    });
});
