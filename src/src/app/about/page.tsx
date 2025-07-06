"use client";

import Section from "@/components/shared/Section";
import { content } from "@/content/home";
import React from "react";
import TextSection from "@/components/shared/TextSection";
import SmallInfoCard, { SmallInfoCardProps } from "@/components/shared/cards/SmallInfoCard";
import SmallInfoCardsGridSection from "@/components/shared/cards/SmallInfoCardsSection";
import { Certification } from "@/content/types";
import experiences from "@/content/experience";
import { MarkdownPreview } from "@/components/shared/preview";
import { skillCategories } from "@/content/skills";
import { Chip } from "@heroui/react";
import Image from "next/image";

const formatMonthYear = (date: Date) => {
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long"
  });
}

const formatExperiencePeriod = (start: Date, end?: Date) => {
  const startDate = formatMonthYear(start);
  const endDate = end ? formatMonthYear(end) : "Present";
  return `${startDate} - ${endDate}`;
}

export default function About() {
  const certifications: SmallInfoCardProps[] = [...content.credentials]
    .sort((a, b) => (b.relevance ?? 0) - (a.relevance ?? 0))
    .map((certification: Certification) => ({
      image: certification.image,
      heading: certification.title,
      subtitle: certification.issuer,
      details: [formatMonthYear(certification.date)],
      imageSize: "medium" as const,
    }));

  const bachelor: SmallInfoCardProps = {
    image: content.bachelor.logo,
    heading: content.bachelor.name,
    subtitle: content.bachelor.University,
    details: content.bachelor.details
  };

  return (
    <div>
      <TextSection heading="About Me" text={content.about} />
      <Section heading="Skills">
        <div className="flex flex-col gap-4">
          {skillCategories.map((category) => (
            <SmallInfoCard
              key={category.name}
              heading={category.name}
              subtitle={`${category.skills.length} skills`}
              details={[]}
            >
              <div className="flex flex-wrap gap-2 mt-2">
                {category.skills.map((skill, skillIndex) => (
                  <Chip 
                    key={skillIndex}
                    variant="bordered"
                    size="lg"
                    radius="md"
                    className="text-base"
                    startContent={
                      skill.icon ? (
                        <Image
                          src={skill.icon}
                          alt={`${skill.name} icon`}
                          width={16}
                          height={16}
                          className="rounded-sm mr-1.5"
                        />
                      ) : undefined
                    }
                  >
                    {skill.name}
                  </Chip>
                ))}
              </div>
            </SmallInfoCard>
          ))}
        </div>
      </Section>
      <Section heading="Experience">
        <div className="flex flex-col gap-4">
          {experiences.map((experience, index) => <SmallInfoCard
            key={index}
            image={experience.company.logo}
            heading={experience.name}
            subtitle={`${experience.company.name} (${experience.type})`}
            imageSize="small"
            imagePosition="start"
            details={[experience.company.location, formatExperiencePeriod(experience.start, experience.end)]}><MarkdownPreview>{experience.description}</MarkdownPreview></SmallInfoCard>)}
        </div>
      </Section>
      <Section heading="Education">
        <SmallInfoCard {...bachelor} imageSize="small" imagePosition="start">
          <MarkdownPreview>{content.bachelor.description}</MarkdownPreview>
        </SmallInfoCard>
      </Section>
      <SmallInfoCardsGridSection heading="Certifications" items={certifications} />
    </div>
  );
}