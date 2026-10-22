import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import icons from "@content/data/icons.json";
import skills from "@content/data/skills.json";
import type { SkillCategory } from "@/types";

describe("skill icon coverage", () => {
    const textOnlySkills = new Set(["REST API", "Team Foundation Version Control", "Agent Skills"]);
    it("assigns local SVGs to branded skills while allowing intentional text-only concepts", () => {
        for (const category of skills as SkillCategory[]) {
            for (const skill of category.skills) {
                const label = `${category.name} / ${skill.name}`;
                if (textOnlySkills.has(skill.name)) {
                    expect(skill.iconId, `${label} should remain text-only`).toBeUndefined();
                    expect(icons.some((entry) => entry.name === skill.name)).toBe(false);
                    continue;
                }

                expect(skill.iconId, `${label} must have an iconId`).toBeDefined();
                const icon = icons.find((entry) => entry.id === skill.iconId);
                expect(icon?.name, `${label} must resolve to a matching display-name icon`).toBe(skill.name);

                if (!icon) {
                    continue;
                }

                const localPath = resolve(process.cwd(), "public", icon.icon.replace(/^\//u, ""));
                expect(existsSync(localPath), `${label} icon file does not exist: ${icon.icon}`).toBe(true);
                expect(readFileSync(localPath, "utf8"), `${label} must be an SVG`).toMatch(/<svg\b/u);
            }
        }
    });
});
