import { Skill } from "./skill";

export interface SkillCategory {
    name: string;
    description?: string;
    skills: Skill[];
}
