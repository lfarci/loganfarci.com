import { getSkillCategories } from "./data";

export interface SkillIcon {
    src: string;
    alt: string;
}

let skillIconMap: Map<string, SkillIcon> | null = null;

function buildSkillIconMap(): Map<string, SkillIcon> {
    const map = new Map<string, SkillIcon>();
    const skillCategories = getSkillCategories();
    
    skillCategories.forEach((category) => {
        category.skills.forEach((skill) => {
            if (skill.icon) {
                const icon: SkillIcon = {
                    src: skill.icon,
                    alt: `${skill.name} icon`,
                };
                map.set(skill.name.toLowerCase(), icon);
            }
        });
    });

    return map;
}

export function getSkillIcon(skillName: string): SkillIcon | null {
    if (skillIconMap === null) {
        skillIconMap = buildSkillIconMap();
    }

    const normalizedName = skillName.toLowerCase().trim();
    return skillIconMap.get(normalizedName) || null;
}
