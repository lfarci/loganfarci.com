import React from "react";
import Card, { CardBody, CardHeader, CardMedia, CardSubtitle, CardTitle } from "./Card";
import CardTitleWithTooltip from "./CardTitleWithTooltip";
import { Secondary, Text } from "@/components/shared/typography";
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
        <div className="flex flex-wrap gap-1.5 mt-2">
            {skills.map((skill) => (
                <IconTag key={skill}>{skill}</IconTag>
            ))}
        </div>
    );
};

const RoleSection: React.FC<{ role: ExperienceRole; isLast?: boolean }> = ({ role, isLast = false }) => (
    <div className="relative pl-6">
        {/* Timeline connector */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-accent border-2 border-accent shrink-0 mt-1.5" />
            {!isLast && <div className="w-0.5 flex-1 bg-border-light mt-1" />}
        </div>

        <div className="pb-6">
            <p className="text-base font-semibold text-text leading-tight">{role.name}</p>
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

const ExperienceCard: React.FC<{ entry: ExperienceEntry }> = ({ entry }) => {
    const { company, companyDescription } = entry;
    const mediaProps = company.logo;

    if (entry.kind === "single") {
        const { role } = entry;
        return (
            <Card className="scroll-mt-24">
                <div className="flex w-full items-start gap-4">
                    {mediaProps && (
                        <CardMedia
                            media={mediaProps}
                            size="medium"
                            align="start"
                            containerClassName="flex shrink-0 justify-center items-start mt-1"
                            className="w-12 h-12 md:w-16 md:h-16"
                        />
                    )}
                    <div className="flex flex-col flex-1 min-w-0 items-start">
                        <CardHeader className="gap-1.5 w-full items-start">
                            <CardTitleWithTooltip>{role.name}</CardTitleWithTooltip>
                            <CardSubtitle className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
                                {company.name} ({role.type})
                            </CardSubtitle>
                            <Secondary className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
                                {company.location}
                            </Secondary>
                            <Secondary className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
                                {formatPeriod(role.start, role.end)}
                            </Secondary>
                        </CardHeader>
                        <CardBody className="pt-1 gap-2 w-full items-start">
                            {companyDescription && <Text>{companyDescription}</Text>}
                            {role.description && <MarkdownPreview>{role.description}</MarkdownPreview>}
                            <RoleSkills skills={role.skills} />
                        </CardBody>
                    </div>
                </div>
            </Card>
        );
    }

    const { roles } = entry;
    const earliestStart = roles[roles.length - 1]?.start;
    const latestEnd = roles[0]?.end;

    return (
        <Card className="scroll-mt-24">
            <div className="flex w-full items-start gap-4">
                {mediaProps && (
                    <CardMedia
                        media={mediaProps}
                        size="medium"
                        align="start"
                        containerClassName="flex shrink-0 justify-center items-start mt-1"
                        className="w-12 h-12 md:w-16 md:h-16"
                    />
                )}
                <div className="flex flex-col flex-1 min-w-0 items-start">
                    <CardHeader className="gap-1.5 w-full items-start">
                        <CardTitle className="leading-tight">{company.name}</CardTitle>
                        <Secondary className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
                            {company.location}
                        </Secondary>
                        <Secondary className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
                            {formatPeriod(earliestStart, latestEnd)}
                        </Secondary>
                    </CardHeader>
                    {companyDescription && (
                        <CardBody className="pt-1 gap-2 w-full items-start">
                            <Text>{companyDescription}</Text>
                        </CardBody>
                    )}
                </div>
            </div>

            {/* Role timeline */}
            <div className="mt-6">
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

export default ExperienceCard;
