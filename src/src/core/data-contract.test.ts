import { describe, expect, it } from "vitest";

import { getCertifications, getExperiences } from "./data";

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/u;

describe("structured-data date contract", () => {
    it("keeps every certification date in YYYY-MM-DD format", () => {
        for (const certification of getCertifications()) {
            expect(certification.date, `${certification.title} date`).toMatch(ISO_DATE_PATTERN);
        }
    });

    it("keeps every experience start date in YYYY-MM-DD format", () => {
        for (const experience of getExperiences()) {
            expect(experience.start, `${experience.name} start`).toMatch(ISO_DATE_PATTERN);
        }
    });

    it("keeps every experience end date in YYYY-MM-DD format when present", () => {
        for (const experience of getExperiences()) {
            if (experience.end) {
                expect(experience.end, `${experience.name} end`).toMatch(ISO_DATE_PATTERN);
            }
        }
    });
});
