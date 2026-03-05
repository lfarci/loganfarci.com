import { describe, it, expect } from "vitest";
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
});

describe("getExperiences", () => {
    it("returns an array", () => {
        expect(Array.isArray(getExperiences())).toBe(true);
    });
});

describe("getSkillCategories", () => {
    it("returns an array", () => {
        expect(Array.isArray(getSkillCategories())).toBe(true);
    });
});

describe("getIcons", () => {
    it("returns an array", () => {
        expect(Array.isArray(getIcons())).toBe(true);
    });

    it("returns icons with id, name and icon fields", () => {
        const icons = getIcons();
        expect(icons.length).toBeGreaterThan(0);
        expect(icons[0]).toHaveProperty("id");
        expect(icons[0]).toHaveProperty("name");
        expect(icons[0]).toHaveProperty("icon");
    });
});

describe("getInterests", () => {
    it("returns an array", () => {
        expect(Array.isArray(getInterests())).toBe(true);
    });
});

describe("getContacts", () => {
    it("returns an array", () => {
        expect(Array.isArray(getContacts())).toBe(true);
    });
});

describe("getProfile", () => {
    it("returns an object", () => {
        const profile = getProfile();
        expect(typeof profile).toBe("object");
        expect(profile).not.toBeNull();
    });
});

describe("getDiploma", () => {
    it("returns an object", () => {
        const diploma = getDiploma();
        expect(typeof diploma).toBe("object");
        expect(diploma).not.toBeNull();
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

    it("returns null icon when iconId does not match any icon", () => {
        const skills: Skill[] = [{ name: "TypeScript", iconId: "nonexistent-icon-xyz" }];
        const result = attemptToLoadIcons(skills);
        expect(result[0].icon).toBeNull();
    });

    it("returns an icon when iconId matches a known icon", () => {
        const icons = getIcons();
        if (icons.length === 0) return;
        const knownIconId = icons[0].id;
        const skills: Skill[] = [{ name: "KnownSkill", iconId: knownIconId }];
        const result = attemptToLoadIcons(skills);
        expect(result[0].icon).not.toBeNull();
        expect(result[0].icon?.id).toBe(knownIconId);
    });
});
