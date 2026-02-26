import Section from "@/components/shared/Section";
import React from "react";
import MarkdownSection from "@/components/shared/MarkdownSection";
import { Card, CardBody, CardHeader, CardSubtitle, CardTitle } from "@/components/cards";
import InfoCard from "@/components/cards/InfoCard";
import { Certification, SkillCategory } from "@/types";
import { MarkdownPreview } from "@/components/shared/preview";
import { getCertifications, getDiploma, getExperiences, getProfile, getSkillCategories } from "@/core/data";
import IconTag from "@/components/shared/IconTag";
import { Text } from "@/components/shared/typography";
import { createId } from "@/core/string";
import ColumnContainer from "@/components/layout/ColumnContainer";
import ThumbnailGridSection from "@/components/shared/ThumbnailGridSection";

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
        url: certification.url,
    }));

const experiences = getExperiences();
const skillCategories = getSkillCategories();
const diploma = getDiploma();
const profile = getProfile();

export default function AboutPage() {
    return (
        <>
            <title>About - Logan Farci</title>
            <meta name="description" content="Learn more about Logan Farci, Software Engineer." />
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
                <ThumbnailGridSection
                    heading="Certifications"
                    items={certifications}
                    columns={2}
                    size="small"
                />
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
        </>
    );
}
