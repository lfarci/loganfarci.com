import { describe, it, expect, vi } from "vitest";

// Mock all external JSON data files to make tests self-contained
vi.mock("@content/data/certifications.json", () => ({
    default: [
        { title: "Test Cert", image: { src: "/cert.png", alt: "cert" }, url: "https://example.com", issuer: "Issuer", date: "2024-01-01", relevance: "High", order: 1 },
    ],
}));
vi.mock("@content/data/experiences.json", () => ({
    default: [
        { name: "Software Engineer", company: { name: "Acme", url: "https://acme.com" }, start: "2022-01-01" },
    ],
}));
vi.mock("@content/data/skills.json", () => ({
    default: [
        { name: "Frontend", skills: [{ name: "TypeScript" }, { name: "React" }] },
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
        { title: "Open Source", image: { src: "/oss.png", alt: "oss" }, description: "Contributing to OSS" },
    ],
}));
vi.mock("@content/data/contacts.json", () => ({
    default: [
        { name: "GitHub", icon: "/github.svg", url: "https://github.com/test" },
    ],
}));
vi.mock("@content/data/profile.json", () => ({
    default: { role: "Developer", introduction: "Hi", description: "A developer", avatar: { src: "/avatar.png", alt: "avatar" } },
}));
vi.mock("@content/data/education.json", () => ({
    default: { name: "Master CS", University: "Test University", logo: { src: "/logo.png", alt: "logo" }, details: ["Detail 1"], description: "A degree" },
}));

import {
    getCertifications,
    getExperiences,
    getSkillCategories,
    getIcons,
    getInterests,
    getContacts,
    getProfile,
    getDiploma,
    attemptToLoadIcons,
} from "@/core/data";
import type { Skill } from "@/types";

describe("getCertifications", () => {
    it("returns an array", () => {
        expect(Array.isArray(getCertifications())).toBe(true);
    });

    it("returns the mocked certification", () => {
        const certs = getCertifications();
        expect(certs).toHaveLength(1);
        expect(certs[0].title).toBe("Test Cert");
    });
});

describe("getExperiences", () => {
    it("returns an array", () => {
        expect(Array.isArray(getExperiences())).toBe(true);
    });

    it("returns the mocked experience", () => {
        const experiences = getExperiences();
        expect(experiences).toHaveLength(1);
        expect(experiences[0].name).toBe("Software Engineer");
    });
});

describe("getSkillCategories", () => {
    it("returns an array", () => {
        expect(Array.isArray(getSkillCategories())).toBe(true);
    });

    it("returns the mocked skill category", () => {
        const categories = getSkillCategories();
        expect(categories).toHaveLength(1);
        expect(categories[0].name).toBe("Frontend");
    });
});

describe("getIcons", () => {
    it("returns an array", () => {
        expect(Array.isArray(getIcons())).toBe(true);
    });

    it("returns icons with id, name and icon fields", () => {
        const icons = getIcons();
        expect(icons).toHaveLength(2);
        expect(icons[0]).toHaveProperty("id", "azure");
        expect(icons[0]).toHaveProperty("name", "Azure");
        expect(icons[0]).toHaveProperty("icon", "/images/azure.svg");
    });
});

describe("getInterests", () => {
    it("returns an array", () => {
        expect(Array.isArray(getInterests())).toBe(true);
    });

    it("returns the mocked interest", () => {
        const interests = getInterests();
        expect(interests).toHaveLength(1);
        expect(interests[0].title).toBe("Open Source");
    });
});

describe("getContacts", () => {
    it("returns an array", () => {
        expect(Array.isArray(getContacts())).toBe(true);
    });

    it("returns the mocked contact", () => {
        const contacts = getContacts();
        expect(contacts).toHaveLength(1);
        expect(contacts[0].name).toBe("GitHub");
    });
});

describe("getProfile", () => {
    it("returns an object", () => {
        const profile = getProfile();
        expect(typeof profile).toBe("object");
        expect(profile).not.toBeNull();
    });

    it("returns the mocked profile", () => {
        const profile = getProfile();
        expect(profile.role).toBe("Developer");
    });
});

describe("getDiploma", () => {
    it("returns an object", () => {
        const diploma = getDiploma();
        expect(typeof diploma).toBe("object");
        expect(diploma).not.toBeNull();
    });

    it("returns the mocked diploma", () => {
        const diploma = getDiploma();
        expect(diploma.name).toBe("Master CS");
    });
});

describe("attemptToLoadIcons", () => {
    it("returns an entry for each skill provided", () => {
        const skills: Skill[] = [{ name: "TypeScript" }, { name: "Azure" }];
        const result = attemptToLoadIcons(skills);
        expect(result).toHaveLength(2);
        expect(result[0].skill).toEqual(skills[0]);
        expect(result[1].skill).toEqual(skills[1]);
    });

    it("returns null icon when skill has no iconId", () => {
        const skills: Skill[] = [{ name: "TypeScript" }];
        const result = attemptToLoadIcons(skills);
        expect(result[0].icon).toBeNull();
    });

    it("returns null icon when iconId does not match any known icon", () => {
        const skills: Skill[] = [{ name: "TypeScript", iconId: "nonexistent-icon-xyz" }];
        const result = attemptToLoadIcons(skills);
        expect(result[0].icon).toBeNull();
    });

    it("returns the matching icon when iconId is known", () => {
        const skills: Skill[] = [{ name: "Cloud", iconId: "azure" }];
        const result = attemptToLoadIcons(skills);
        expect(result[0].icon).not.toBeNull();
        expect(result[0].icon?.id).toBe("azure");
    });
});

