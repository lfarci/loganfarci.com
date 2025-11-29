import Section from "@/components/shared/Section";
import React from "react";
import MarkdownSection from "@/components/shared/MarkdownSection";
import { SmallInfoCard, SmallInfoCardProps, SmallInfoCardsSection } from "@/components/cards";
import { Certification, SkillCategory } from "@/types";
import { MarkdownPreview } from "@/components/shared/preview";
import { getCertifications, getDiploma, getExperiences, getProfile, getSkillCategories } from "@/core/data";
import IconTag from "@/components/shared/IconTag";
import { Text } from "@/components/shared/typography";

const formatMonthYear = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long" });
};

const formatExperiencePeriod = (start: Date, end?: Date) => {
    const startDate = formatMonthYear(start);
    const endDate = end ? formatMonthYear(end) : "Present";
    return `${startDate} - ${endDate}`;
};

const certifications: SmallInfoCardProps[] = getCertifications()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((certification: Certification) => ({
        image: certification.image,
        heading: certification.title,
        subtitle: certification.issuer,
        details: [formatMonthYear(certification.date)],
        imageSize: "medium" as const,
    }));

const experiences = getExperiences();
const skillCategories = getSkillCategories();
const diploma = getDiploma();
const profile = getProfile();

export default function About() {
    const bachelor: SmallInfoCardProps = {
        image: diploma.logo,
        heading: diploma.name,
        subtitle: diploma.University,
        details: diploma.details,
    };

    return (
        <div>
            <MarkdownSection 
                heading="About Me" 
                content={profile.description}
                imageSrc={profile.avatar.src}
                imageAlt={profile.avatar.alt}
            />
            <Section heading="Experience">
                <div className="flex flex-col gap-4">
                    {experiences.map((experience, index) => (
                        <SmallInfoCard
                            key={index}
                            image={experience.company.logo}
                            heading={experience.name}
                            subtitle={`${experience.company.name} (${experience.type})`}
                            imageSize="small"
                            imagePosition="start"
                            details={[
                                experience.company.location,
                                formatExperiencePeriod(experience.start, experience.end),
                            ]}
                        >
                            <MarkdownPreview>{experience.description}</MarkdownPreview>
                        </SmallInfoCard>
                    ))}
                </div>
            </Section>
            <Section heading="Education">
                <SmallInfoCard {...bachelor} imageSize="small" imagePosition="start">
                    <MarkdownPreview>{diploma.description}</MarkdownPreview>
                </SmallInfoCard>
            </Section>
            <SmallInfoCardsSection heading="Certifications" items={certifications} />
            <Section heading="Skills">
                <div className="flex flex-col gap-4">
                    {skillCategories.map((category: SkillCategory) => (
                        <SmallInfoCard
                            key={category.name}
                            heading={category.name}
                            subtitle={`${category.skills.length} skills`}
                            flex="col"
                            details={[]}
                        >
                            <Text>{category.description}</Text>
                            <div className="flex flex-wrap gap-2 mt-6">
                                {category.skills.map((skill) => <IconTag key={skill.name}>{skill.name}</IconTag>)}
                            </div>
                        </SmallInfoCard>
                    ))}
                </div>
            </Section>
        </div>
    );
}
