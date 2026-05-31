import React from "react";
import InfoCard from "./InfoCard";
import { Heading4, Secondary } from "@/components/shared/typography";
import IconTag from "@/components/shared/IconTag";
import { MarkdownPreview } from "@/components/shared/preview";
import type { ExperienceEntry, ExperienceRole } from "@/core/experiences";

const formatMonthYear = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long" });
};

const formatPeriod = (start: Date, end?: Date) => {
    return `${formatMonthYear(start)} - ${end ? formatMonthYear(end) : "Present"}`;
};

const RoleSkills: React.FC<{ skills?: string[] }> = ({ skills }) => {
    if (!skills?.length) return null;
    return (
        <div className="flex flex-wrap gap-2 mt-4">
            {skills.map((skill) => (
                <IconTag key={skill}>{skill}</IconTag>
            ))}
        </div>
    );
};

const RoleSection: React.FC<{ role: ExperienceRole; isLast?: boolean }> = ({ role, isLast = false }) => (
    <div className="relative pl-6">
        <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-surface border-2 border-accent shrink-0 mt-1.5" />
            {!isLast && <div className="w-0.5 flex-1 bg-border-light mt-1" />}
        </div>

        <div className="pb-6">
            <Heading4 className="text-text-secondary!">{role.name}</Heading4>
            <Secondary>{role.type} · {formatPeriod(role.start, role.end)}</Secondary>
            {role.description && (
                <div className="mt-2">
                    <MarkdownPreview>{role.description}</MarkdownPreview>
                </div>
            )}
            <RoleSkills skills={role.skills} />
        </div>
    </div>
);

const SingleExperienceCard: React.FC<{ entry: Extract<ExperienceEntry, { kind: "single" }> }> = ({ entry }) => {
    const { company, companyDescription, role } = entry;
    const combinedMarkdown = [companyDescription, role.description].filter(Boolean).join("\n\n");

    return (
        <InfoCard
            title={role.name}
            subtitle={`${company.name} (${role.type})`}
            details={[
                company.location,
                formatPeriod(role.start, role.end),
            ]}
            media={company.logo}
            mediaSize="small"
            mediaAlign="start"
            align="start"
            showTitleTooltip
        >
            {combinedMarkdown && <MarkdownPreview>{combinedMarkdown}</MarkdownPreview>}
            <RoleSkills skills={role.skills} />
        </InfoCard>
    );
};

const GroupedExperienceCard: React.FC<{ entry: Extract<ExperienceEntry, { kind: "grouped" }> }> = ({ entry }) => {
    const { company, companyDescription, roles } = entry;
    const earliestStart = roles[roles.length - 1]?.start;
    const latestEnd = roles[0]?.end;

    return (
        <InfoCard
            title={company.name}
            details={[
                company.location,
                formatPeriod(earliestStart, latestEnd),
            ]}
            media={company.logo}
            mediaSize="small"
            mediaAlign="start"
            align="start"
            footer={
                <div className="w-full border-t border-border-light pt-4">
                    {roles.map((role, index) => (
                        <RoleSection
                            key={`${role.name}-${String(role.start)}`}
                            role={role}
                            isLast={index === roles.length - 1}
                        />
                    ))}
                </div>
            }
        >
            {companyDescription && <MarkdownPreview>{companyDescription}</MarkdownPreview>}
        </InfoCard>
    );
};

const ExperienceCard: React.FC<{ entry: ExperienceEntry }> = ({ entry }) => {
    if (entry.kind === "single") {
        return <SingleExperienceCard entry={entry} />;
    }
    return <GroupedExperienceCard entry={entry} />;
};

export default ExperienceCard;
