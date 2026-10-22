import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import icons from "@content/data/icons.json";
import skills from "@content/data/skills.json";
import type { SkillCategory } from "@/types";

describe("skill icon coverage", () => {
    it("assigns a real local SVG to every displayed skill", () => {
        for (const category of skills as SkillCategory[]) {
            for (const skill of category.skills) {
                const label = `${category.name} / ${skill.name}`;
                expect(skill.iconId, `${label} must have an iconId`).toBeDefined();
                const icon = icons.find((entry) => entry.id === skill.iconId);
                expect(icon?.name, `${label} must resolve to a matching display-name icon`).toBe(skill.name);

                if (!icon) {
                    continue;
                }

                const localPath = fileURLToPath(new URL(`../../public${icon.icon}`, import.meta.url));
                expect(existsSync(localPath), `${label} icon file does not exist: ${icon.icon}`).toBe(true);
                expect(readFileSync(localPath, "utf8"), `${label} must be an SVG`).toMatch(/<svg\b/u);
            }
        }
    });
});
