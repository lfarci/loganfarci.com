import Section from "@/components/shared/Section";
import React from "react";
import MarkdownSection from "@/components/shared/MarkdownSection";
import { Card, CardBody, CardHeader, CardSubtitle, CardTitle } from "@/components/cards";
import { Certification, SkillCategory } from "@/types";
import { getCertifications, getDiploma, getExperiences, getProfile, getSkillCategories } from "@/core/data";
import IconTag from "@/components/shared/IconTag";
import { Text } from "@/components/shared/typography";
import { createId } from "@/core/string";
import ColumnContainer from "@/components/layout/ColumnContainer";
import ThumbnailGridSection from "@/components/shared/ThumbnailGridSection";
import ExperienceCard from "@/components/cards/ExperienceCard";
import { groupExperiences } from "@/core/experiences";
import InfoCard from "@/components/cards/InfoCard";
import { MarkdownPreview } from "@/components/shared/preview";

const certifications = getCertifications()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((certification: Certification) => ({
        image: certification.image,
        title: certification.title,
        description: certification.issuer,
        url: certification.url,
    }));

const experiences = groupExperiences(getExperiences());
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
                        {experiences.map((entry) => {
                            const key = entry.kind === "grouped"
                                ? `group-${entry.company.name}`
                                : `${entry.role.name}-${entry.company.name}`;
                            return <ExperienceCard key={key} entry={entry} />;
                        })}
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
