import { Certification, Experience, SkillCategory, Interest, Contact, Profile, Diploma, Icon, Skill } from "@/types";

// Vite resolves JSON imports at build time — inlined into the bundle
import certifications from "@content/data/certifications.json";
import experiences from "@content/data/experiences.json";
import skills from "@content/data/skills.json";
import icons from "@content/data/icons.json";
import interests from "@content/data/interests.json";
import contacts from "@content/data/contacts.json";
import profile from "@content/data/profile.json";
import education from "@content/data/education.json";

export const getCertifications = (): Certification[] => certifications as Certification[];
export const getExperiences = (): Experience[] => experiences as Experience[];
export const getSkillCategories = (): SkillCategory[] => skills as SkillCategory[];
export const getIcons = (): Icon[] => icons as Icon[];
export const getInterests = (): Interest[] => interests as Interest[];
export const getContacts = (): Contact[] => contacts as Contact[];
export const getProfile = (): Profile => profile as Profile;
export const getDiploma = (): Diploma => education as Diploma;

export function attemptToLoadIcons(skills: Skill[]): Array<{ skill: Skill; icon: Icon | null }> {
    const iconList = getIcons();
    const iconMap = new Map(iconList.map((i) => [i.id, i]));
    return skills.map((skill) => ({
        skill,
        icon: skill.iconId ? iconMap.get(skill.iconId) || null : null,
    }));
}
