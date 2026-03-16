import { describe, it, expect } from "vitest";
import { mockSkillCategory, mockIcon, mockDataModule } from "./helpers";
import type { Skill } from "@/types";

mockDataModule();

import { getSkillCategories, attemptToLoadIcons } from "@/core/data";

describe("getSkillCategories", () => {
    it("returns an array", () => {
        expect(Array.isArray(getSkillCategories())).toBe(true);
    });

    it("returns the mocked skill category", () => {
        expect(getSkillCategories()).toHaveLength(1);
    });

    it("returns the correct category name", () => {
        expect(getSkillCategories()[0].name).toBe(mockSkillCategory.name);
    });
});

describe("attemptToLoadIcons", () => {
    it("returns an entry for each skill provided", () => {
        const skills: Skill[] = [{ name: "TypeScript" }, { name: "Azure" }];
        expect(attemptToLoadIcons(skills)).toHaveLength(2);
    });

    it("preserves the skill reference in each result entry", () => {
        const skill: Skill = { name: "TypeScript" };
        expect(attemptToLoadIcons([skill])[0].skill).toEqual(skill);
    });

    it("returns null icon when skill has no iconId", () => {
        const skills: Skill[] = [{ name: "TypeScript" }];
        expect(attemptToLoadIcons(skills)[0].icon).toBeNull();
    });

    it("returns null icon when iconId does not match any known icon", () => {
        const skills: Skill[] = [{ name: "TypeScript", iconId: "nonexistent-icon-xyz" }];
        expect(attemptToLoadIcons(skills)[0].icon).toBeNull();
    });

    it("returns the matching icon when iconId is known", () => {
        const skills: Skill[] = [{ name: "Cloud", iconId: mockIcon.id }];
        expect(attemptToLoadIcons(skills)[0].icon?.id).toBe(mockIcon.id);
    });

    it("returns an empty array when no skills are provided", () => {
        expect(attemptToLoadIcons([])).toHaveLength(0);
    });
});
