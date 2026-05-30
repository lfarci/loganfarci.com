import { Experience } from "@/types";
import { Company } from "@/types/company";

export interface ExperienceRole {
    name: string;
    start: Date;
    end?: Date;
    type?: Experience["type"];
    description?: string;
    skills?: string[];
}

export interface SingleExperienceEntry {
    kind: "single";
    company: Company;
    companyDescription?: string;
    role: ExperienceRole;
}

export interface GroupedExperienceEntry {
    kind: "grouped";
    company: Company;
    companyDescription?: string;
    roles: ExperienceRole[];
}

export type ExperienceEntry = SingleExperienceEntry | GroupedExperienceEntry;

function toRole(experience: Experience): ExperienceRole {
    return {
        name: experience.name,
        start: experience.start,
        end: experience.end,
        type: experience.type,
        description: experience.description,
        skills: experience.skills,
    };
}

/**
 * Groups experiences that share a `group` identifier into a single entry
 * with multiple roles. Ungrouped experiences become single entries.
 * Roles within a group are sorted by start date (most recent first).
 */
export function groupExperiences(experiences: Experience[]): ExperienceEntry[] {
    const grouped = new Map<string, Experience[]>();
    const singles: Experience[] = [];

    for (const exp of experiences) {
        if (exp.group) {
            const existing = grouped.get(exp.group) ?? [];
            existing.push(exp);
            grouped.set(exp.group, existing);
        } else {
            singles.push(exp);
        }
    }

    const entries: ExperienceEntry[] = [];
    const seen = new Set<string>();

    for (const exp of experiences) {
        if (exp.group) {
            if (seen.has(exp.group)) continue;
            seen.add(exp.group);

            const groupExps = grouped.get(exp.group)!;
            const roles = groupExps
                .map(toRole)
                .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());

            entries.push({
                kind: "grouped",
                company: groupExps[0].company,
                companyDescription: groupExps[0].companyDescription,
                roles,
            });
        } else {
            entries.push({
                kind: "single",
                company: exp.company,
                companyDescription: exp.companyDescription,
                role: toRole(exp),
            });
        }
    }

    return entries;
}
