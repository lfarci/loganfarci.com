import Section from "@/components/shared/Section";
import React from "react";
import MarkdownSection from "@/components/shared/MarkdownSection";
import SmallInfoCard, { SmallInfoCardProps } from "@/components/shared/cards/SmallInfoCard";
import SmallInfoCardsGridSection from "@/components/shared/cards/SmallInfoCardsSection";
import { Certification, SkillCategory } from "@/types";
import { MarkdownPreview } from "@/components/shared/preview";
import IconTag from "@/components/shared/IconTag";
import { Text } from "@/components/shared/typography";
import certificationsData from "@/data/certifications.json";
import diplomaData from "@/data/education.json";
import experiencesData from "@/data/experiences.json";
import profileData from "@/data/profile.json";
import skillCategoriesData from "@/data/skills.json";

const formatMonthYear = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long" });
};

const formatExperiencePeriod = (start: Date, end?: Date) => {
    const startDate = formatMonthYear(start);
    const endDate = end ? formatMonthYear(end) : "Present";
    return `${startDate} - ${endDate}`;
};

export default function About() {
    const certifications: SmallInfoCardProps[] = certificationsData
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((certification: Certification) => ({
            image: certification.image,
            heading: certification.title,
            subtitle: certification.issuer,
            details: [formatMonthYear(certification.date)],
            imageSize: "medium" as const,
        }));

    const bachelor: SmallInfoCardProps = {
        image: diplomaData.logo,
        heading: diplomaData.name,
        subtitle: diplomaData.University,
        details: diplomaData.details,
    };

    return (
        <div>
            <MarkdownSection 
                heading="About Me" 
                content={profileData.description}
                imageSrc={profileData.avatar.src}
                imageAlt={profileData.avatar.alt}
            />
            <Section heading="Experience">
                <div className="flex flex-col gap-4">
                    {experiencesData.map((experience, index) => (
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
                    <MarkdownPreview>{diplomaData.description}</MarkdownPreview>
                </SmallInfoCard>
            </Section>
            <SmallInfoCardsGridSection heading="Certifications" items={certifications} />
            <Section heading="Skills">
                <div className="flex flex-col gap-4">
                    {skillCategoriesData.map((category: SkillCategory) => (
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