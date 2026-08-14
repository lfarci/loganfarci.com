import type {
    Certification,
    Contact,
    Diploma,
    Experience,
    Icon,
    Interest,
    ISODateString,
    Profile,
    Skill,
    SkillCategory,
} from "@/types";

// Vite resolves JSON imports at build time — inlined into the bundle
import certifications from "@content/data/certifications.json";
import experiences from "@content/data/experiences.json";
import skills from "@content/data/skills.json";
import icons from "@content/data/icons.json";
import interests from "@content/data/interests.json";
import contacts from "@content/data/contacts.json";
import profile from "@content/data/profile.json";
import education from "@content/data/education.json";

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/u;

function assertISODateString(value: unknown, field: string): asserts value is ISODateString {
    if (typeof value !== "string" || !isoDatePattern.test(value)) {
        throw new Error(`${field} must use the YYYY-MM-DD date format.`);
    }
}

export const getCertifications = (): Certification[] =>
    certifications.map((certification, index) => {
        assertISODateString(certification.date, `certifications[${index}].date`);

        return certification as Certification;
    });

export const getExperiences = (): Experience[] =>
    experiences.map((experience, index) => {
        assertISODateString(experience.start, `experiences[${index}].start`);

        if (experience.end !== undefined) {
            assertISODateString(experience.end, `experiences[${index}].end`);
        }

        return experience as Experience;
    });

export const getSkillCategories = (): SkillCategory[] => skills as SkillCategory[];
export const getIcons = (): Icon[] => icons as Icon[];
export const getInterests = (): Interest[] => interests as Interest[];
export const getContacts = (): Contact[] => contacts as Contact[];
export const getProfile = (): Profile => profile as Profile;
export const getDiploma = (): Diploma => education as Diploma;

export function attemptToLoadIcons(skills: Skill[]): Array<{ skill: Skill; icon: Icon | null }> {
    const iconList = getIcons();
    const iconMap = new Map(iconList.map((i) => [i.id, i]));
    return skills.map((skill) => ({ skill, icon: skill.iconId ? iconMap.get(skill.iconId) || null : null }));
}
