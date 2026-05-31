import React from "react";
import Card, { CardBody, CardHeader, CardMedia, CardSubtitle } from "./Card";
import InfoCard from "./InfoCard";
import { Secondary } from "@/components/shared/typography";
import IconTag from "@/components/shared/IconTag";
import { MarkdownPreview } from "@/components/shared/preview";
import CardTitleWithTooltip from "./CardTitleWithTooltip";
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
            <CardTitleWithTooltip>{role.name}</CardTitleWithTooltip>
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
        <Card className="scroll-mt-24">
            <div className="flex w-full items-start gap-4">
                {company.logo && (
                    <CardMedia
                        media={company.logo}
                        size="medium"
                        align="start"
                        containerClassName="flex shrink-0 justify-center items-start mt-1"
                        className="w-12 h-12 md:w-16 md:h-16"
                    />
                )}
                <div className="flex flex-col flex-1 min-w-0 items-start">
                    <CardHeader className="gap-1.5 w-full items-start">
                        <CardSubtitle className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
                            {company.name} · {company.location}
                        </CardSubtitle>
                        <Secondary className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
                            {formatPeriod(earliestStart, latestEnd)}
                        </Secondary>
                    </CardHeader>
                    {companyDescription && (
                        <CardBody className="pt-1 gap-2 w-full items-start">
                            <MarkdownPreview>{companyDescription}</MarkdownPreview>
                        </CardBody>
                    )}
                </div>
            </div>

            <div className="mt-4 border-t border-border-light pt-4">
                {roles.map((role, index) => (
                    <RoleSection
                        key={`${role.name}-${String(role.start)}`}
                        role={role}
                        isLast={index === roles.length - 1}
                    />
                ))}
            </div>
        </Card>
    );
};

const ExperienceCard: React.FC<{ entry: ExperienceEntry }> = ({ entry }) => {
    if (entry.kind === "single") {
        return <SingleExperienceCard entry={entry} />;
    }
    return <GroupedExperienceCard entry={entry} />;
};

export default ExperienceCard;
