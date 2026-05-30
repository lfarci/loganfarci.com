import { describe, it, expect } from "vitest";
import { groupExperiences, ExperienceEntry } from "@/core/experiences";
import { Experience } from "@/types";

const makeExperience = (overrides: Partial<Experience> = {}): Experience => ({
    name: "Developer",
    company: {
        name: "Acme",
        website: "https://acme.com",
        location: "Brussels, Belgium",
    },
    start: new Date("2022-01-01"),
    type: "Full-Time",
    ...overrides,
});

describe("groupExperiences", () => {
    it("returns empty array for empty input", () => {
        expect(groupExperiences([])).toEqual([]);
    });

    it("returns a single entry for one ungrouped experience", () => {
        const experiences = [makeExperience()];
        const result = groupExperiences(experiences);

        expect(result).toHaveLength(1);
        expect(result[0].kind).toBe("single");
    });

    it("preserves all fields in a single entry", () => {
        const exp = makeExperience({
            name: "Senior Dev",
            description: "Did stuff",
            skills: ["React", "TypeScript"],
            companyDescription: "A great company",
        });
        const result = groupExperiences([exp]);
        const entry = result[0] as Extract<ExperienceEntry, { kind: "single" }>;

        expect(entry.role.name).toBe("Senior Dev");
        expect(entry.role.description).toBe("Did stuff");
        expect(entry.role.skills).toEqual(["React", "TypeScript"]);
        expect(entry.companyDescription).toBe("A great company");
    });

    it("groups experiences with the same group identifier", () => {
        const experiences = [
            makeExperience({ name: "Senior Dev", group: "acme-ft", start: new Date("2024-01-01") }),
            makeExperience({ name: "Junior Dev", group: "acme-ft", start: new Date("2022-01-01") }),
        ];
        const result = groupExperiences(experiences);

        expect(result).toHaveLength(1);
        expect(result[0].kind).toBe("grouped");
    });

    it("sorts roles within a group by start date descending (most recent first)", () => {
        const experiences = [
            makeExperience({ name: "Junior", group: "acme-ft", start: new Date("2020-01-01") }),
            makeExperience({ name: "Senior", group: "acme-ft", start: new Date("2023-01-01") }),
            makeExperience({ name: "Mid", group: "acme-ft", start: new Date("2021-06-01") }),
        ];
        const result = groupExperiences(experiences);
        const grouped = result[0] as Extract<ExperienceEntry, { kind: "grouped" }>;

        expect(grouped.roles.map((r) => r.name)).toEqual(["Senior", "Mid", "Junior"]);
    });

    it("keeps ungrouped experiences separate from grouped ones", () => {
        const experiences = [
            makeExperience({ name: "Consultant", group: "acme-ft", start: new Date("2024-01-01") }),
            makeExperience({ name: "Analyst", group: "acme-ft", start: new Date("2022-01-01") }),
            makeExperience({ name: "Intern", company: { name: "Acme", website: "https://acme.com", location: "Brussels" } }),
        ];
        const result = groupExperiences(experiences);

        expect(result).toHaveLength(2);
        expect(result[0].kind).toBe("grouped");
        expect(result[1].kind).toBe("single");
    });

    it("preserves original order (grouped entry appears at position of first member)", () => {
        const experiences = [
            makeExperience({ name: "Consultant", group: "acme-ft", start: new Date("2024-01-01") }),
            makeExperience({
                name: "Other Company Dev",
                company: { name: "Other", website: "https://other.com", location: "Ghent" },
            }),
            makeExperience({ name: "Analyst", group: "acme-ft", start: new Date("2022-01-01") }),
        ];
        const result = groupExperiences(experiences);

        expect(result).toHaveLength(2);
        expect(result[0].kind).toBe("grouped");
        expect(result[1].kind).toBe("single");
        expect(result[1].company.name).toBe("Other");
    });

    it("handles multiple different groups", () => {
        const experiences = [
            makeExperience({ name: "Senior at A", group: "company-a", start: new Date("2024-01-01") }),
            makeExperience({ name: "Junior at A", group: "company-a", start: new Date("2022-01-01") }),
            makeExperience({
                name: "Lead at B",
                group: "company-b",
                company: { name: "B Corp", website: "https://b.com", location: "Antwerp" },
                start: new Date("2023-01-01"),
            }),
            makeExperience({
                name: "Dev at B",
                group: "company-b",
                company: { name: "B Corp", website: "https://b.com", location: "Antwerp" },
                start: new Date("2021-01-01"),
            }),
        ];
        const result = groupExperiences(experiences);

        expect(result).toHaveLength(2);
        expect(result[0].kind).toBe("grouped");
        expect(result[0].company.name).toBe("Acme");
        expect(result[1].kind).toBe("grouped");
        expect(result[1].company.name).toBe("B Corp");
    });

    it("uses company info from the first experience in the group", () => {
        const experiences = [
            makeExperience({
                name: "Senior",
                group: "g1",
                companyDescription: "First description",
                start: new Date("2024-01-01"),
            }),
            makeExperience({
                name: "Junior",
                group: "g1",
                companyDescription: "Second description",
                start: new Date("2022-01-01"),
            }),
        ];
        const result = groupExperiences(experiences);
        const grouped = result[0] as Extract<ExperienceEntry, { kind: "grouped" }>;

        expect(grouped.companyDescription).toBe("First description");
    });
});
