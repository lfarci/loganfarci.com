import { describe, expect, it, vi } from "vitest";

vi.mock("@content/data/certifications.json", () => ({
    default: [
        {
            title: "Test Cert",
            image: { src: "/cert.png", alt: "cert" },
            url: "https://example.com",
            issuer: "Issuer",
            date: "2024-01-01",
            relevance: "High",
            order: 1,
        },
    ],
}));

vi.mock("@content/data/experiences.json", () => ({
    default: [
        {
            name: "Software Engineer",
            company: { name: "Acme", url: "https://acme.com" },
            start: "2022-01-01",
        },
    ],
}));

vi.mock("@content/data/skills.json", () => ({
    default: [
        {
            name: "Frontend",
            skills: [{ name: "TypeScript" }, { name: "React" }],
        },
    ],
}));

vi.mock("@content/data/icons.json", () => ({
    default: [
        { id: "azure", name: "Azure", icon: "/images/azure.svg" },
        { id: "react", name: "React", icon: "/images/react.svg" },
    ],
}));

vi.mock("@content/data/interests.json", () => ({
    default: [
        {
            title: "Open Source",
            image: { src: "/oss.png", alt: "oss" },
            description: "Contributing to OSS",
        },
    ],
}));

vi.mock("@content/data/contacts.json", () => ({
    default: [
        {
            name: "GitHub",
            icon: "/github.svg",
            url: "https://github.com/test",
        },
    ],
}));

vi.mock("@content/data/profile.json", () => ({
    default: {
        role: "Developer",
        introduction: "Hi",
        description: "A developer",
        avatar: { src: "/avatar.png", alt: "avatar" },
    },
}));

vi.mock("@content/data/education.json", () => ({
    default: {
        name: "Master CS",
        University: "Test University",
        logo: { src: "/logo.png", alt: "logo" },
        details: ["Detail 1"],
        description: "A degree",
    },
}));

import {
    attemptToLoadIcons,
    getCertifications,
    getContacts,
    getDiploma,
    getExperiences,
    getIcons,
    getInterests,
    getProfile,
    getSkillCategories,
} from "./data";

describe("data accessors", () => {
    it("returns mocked certifications", () => {
        expect(getCertifications()).toHaveLength(1);
        expect(getCertifications()[0].title).toBe("Test Cert");
    });

    it("returns mocked experiences", () => {
        expect(getExperiences()).toHaveLength(1);
        expect(getExperiences()[0].name).toBe("Software Engineer");
    });

    it("returns mocked skill categories", () => {
        expect(getSkillCategories()).toHaveLength(1);
        expect(getSkillCategories()[0].name).toBe("Frontend");
    });

    it("returns mocked icons", () => {
        expect(getIcons()).toHaveLength(2);
        expect(getIcons()[1].id).toBe("react");
    });

    it("returns mocked interests", () => {
        expect(getInterests()).toHaveLength(1);
        expect(getInterests()[0].title).toBe("Open Source");
    });

    it("returns mocked contacts", () => {
        expect(getContacts()).toHaveLength(1);
        expect(getContacts()[0].name).toBe("GitHub");
    });

    it("returns the mocked profile", () => {
        expect(getProfile().role).toBe("Developer");
    });

    it("returns the mocked diploma", () => {
        expect(getDiploma().name).toBe("Master CS");
    });
});

describe("attemptToLoadIcons", () => {
    it("preserves the original skill and loads a matching icon when present", () => {
        const input = { name: "Cloud", iconId: "azure" };
        const result = attemptToLoadIcons([input]);

        expect(result).toHaveLength(1);
        expect(result[0].skill).toEqual(input);
        expect(result[0].icon?.id).toBe("azure");
    });

    it("returns null when a skill has no iconId or when the icon is unknown", () => {
        expect(attemptToLoadIcons([{ name: "TypeScript" }])[0].icon).toBeNull();
        expect(attemptToLoadIcons([{ name: "TypeScript", iconId: "missing" }])[0].icon).toBeNull();
    });

    it("returns an empty list when there are no skills", () => {
        expect(attemptToLoadIcons([])).toEqual([]);
    });
});
