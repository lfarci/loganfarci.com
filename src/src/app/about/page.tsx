import Section from "@/components/shared/Section";
import React from "react";
import MarkdownSection from "@/components/shared/MarkdownSection";
import { Card, CardBody, CardGrid, CardHeader, CardSubtitle, CardTitle } from "@/components/cards";
import InfoCard from "@/components/cards/InfoCard";
import MediaTileCard from "@/components/cards/MediaTileCard";
import { Certification, SkillCategory } from "@/types";
import { MarkdownPreview } from "@/components/shared/preview";
import { getCertifications, getDiploma, getExperiences, getProfile, getSkillCategories } from "@/core/data";
import IconTag from "@/components/shared/IconTag";
import { Text } from "@/components/shared/typography";
import { createId } from "@/core/string";
import ColumnContainer from "@/components/layout/ColumnContainer";

const formatMonthYear = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long" });
};

const formatExperiencePeriod = (start: Date, end?: Date) => {
    const startDate = formatMonthYear(start);
    const endDate = end ? formatMonthYear(end) : "Present";
    return `${startDate} - ${endDate}`;
};

const certifications = getCertifications()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((certification: Certification) => ({
        image: certification.image,
        title: certification.title,
        description: certification.issuer,
        date: formatMonthYear(certification.date),
    }));

const experiences = getExperiences();
const skillCategories = getSkillCategories();
const diploma = getDiploma();
const profile = getProfile();

export default function About() {

    return (
        <div>
            <MarkdownSection 
                heading="About Me" 
                content={profile.description}
                imageSrc={profile.avatar.src}
                imageAlt={profile.avatar.alt}
            />
            <Section heading="Experience">
                <ColumnContainer>
                    {experiences.map((experience) => (
                        <InfoCard
                            key={`${experience.name}-${experience.company.name}`}
                            title={experience.name}
                            subtitle={`${experience.company.name} (${experience.type})`}
                            details={[
                                experience.company.location,
                                formatExperiencePeriod(experience.start, experience.end),
                            ]}
                            media={experience.company.logo}
                            mediaSize="small"
                            mediaAlign="start"
                            align="start"
                            showTitleTooltip
                        >
                            <MarkdownPreview>{experience.description}</MarkdownPreview>
                        </InfoCard>
                    ))}
                </ColumnContainer>
            </Section>
            <Section heading="Education">
                <InfoCard
                    title={diploma.name}
                    subtitle={diploma.University}
                    details={diploma.details}
                    media={diploma.logo}
                    mediaSize="small"
                    mediaAlign="start"
                    align="start"
                    showTitleTooltip
                >
                    <MarkdownPreview>{diploma.description}</MarkdownPreview>
                </InfoCard>
            </Section>
            <Section heading="Certifications">
                <CardGrid columns={2} className="mt-4">
                    {certifications.map((certification) => (
                        <MediaTileCard
                            key={certification.title}
                            title={certification.title}
                            description={certification.description}
                            image={certification.image}
                            size="small"
                        />
                    ))}
                </CardGrid>
            </Section>
            <Section heading="Skills" id="skills">
                <ColumnContainer>
                    {skillCategories.map((category: SkillCategory) => (
                        <Card key={category.name} id={createId(category.name)} className="scroll-mt-24">
                            <CardHeader className="gap-1.5">
                                <CardTitle>{category.name}</CardTitle>
                                <CardSubtitle>{`${category.skills.length} skills`}</CardSubtitle>
                            </CardHeader>
                            <CardBody className="pt-1 gap-2">
                                <Text>{category.description}</Text>
                                <div className="flex flex-wrap gap-2 mt-6">
                                    {category.skills.map((skill) => <IconTag key={skill.name}>{skill.name}</IconTag>)}
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </ColumnContainer>
            </Section>
        </div>
    );
}
