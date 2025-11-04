import { getSkillCategories } from "./data";

export interface SkillIcon {
    src: string;
    alt: string;
}

// Lazy initialization for performance
let skillIconMap: Map<string, SkillIcon> | null = null;

/**
 * Builds a map of skill names to their icons from the skills.json data.
 * Uses case-insensitive matching and supports common aliases.
 */
function buildSkillIconMap(): Map<string, SkillIcon> {
    const map = new Map<string, SkillIcon>();

    // Flatten all skills from all categories
    const skillCategories = getSkillCategories();
    skillCategories.forEach((category) => {
        category.skills.forEach((skill) => {
            if (skill.icon) {
                const icon: SkillIcon = {
                    src: skill.icon,
                    alt: `${skill.name} icon`,
                };
                // Store by lowercase name for case-insensitive lookup
                map.set(skill.name.toLowerCase(), icon);
            }
        });
    });

    // Add common aliases
    const aliases: Record<string, string> = {
        ts: "typescript",
        js: "javascript",
        dotnet: ".net",
        net: ".net",
        csharp: "c#",
        "c-sharp": "c#",
        k8s: "kubernetes",
        vscode: "visual studio code",
        "vs code": "visual studio code",
        copilot: "github copilot",
        worktree: "git",
    };

    // Add alias mappings
    Object.entries(aliases).forEach(([alias, skillName]) => {
        const icon = map.get(skillName.toLowerCase());
        if (icon) {
            map.set(alias.toLowerCase(), icon);
        }
    });

    return map;
}

/**
 * Gets the icon information for a skill by name.
 * Supports case-insensitive matching and common aliases.
 * 
 * @param skillName - The name of the skill or its alias
 * @returns SkillIcon object if found, null otherwise
 * 
 * @example
 * getSkillIcon(".NET")        // → { src: "/images/skills/backend/dotnet.svg", alt: ".NET icon" }
 * getSkillIcon("typescript")  // → { src: "/images/skills/frontend/typescript.svg", alt: "TypeScript icon" }
 * getSkillIcon("ts")          // → { src: "/images/skills/frontend/typescript.svg", alt: "TypeScript icon" }
 * getSkillIcon("AZURE")       // → Azure icon if exists in skills data
 * getSkillIcon("Unknown")     // → null
 */
export function getSkillIcon(skillName: string): SkillIcon | null {
    // Lazy initialization - build map only when first needed
    if (skillIconMap === null) {
        skillIconMap = buildSkillIconMap();
    }

    // Case-insensitive lookup
    const normalizedName = skillName.toLowerCase().trim();
    return skillIconMap.get(normalizedName) || null;
}
