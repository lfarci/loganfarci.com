"use client";

import Section from "@/components/shared/Section";
import { content } from "@/content/home";
import React from "react";
import TextSection from "@/components/shared/TextSection";
import SmallInfoCard, { SmallInfoCardProps } from "@/components/shared/cards/SmallInfoCard";
import SmallInfoCardsGridSection from "@/components/shared/cards/SmallInfoCardsSection";
import { Certification } from "@/content/types";
import experiences from "@/content/experience";
import TextPreview from "@/components/shared/TextPreview";

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
      image: certification.badge,
      heading: certification.title,
      subtitle: certification.issuer,
      details: [formatMonthYear(certification.date)],
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
      <Section heading="Experience">
        <div className="flex flex-col gap-4">
          {experiences.map((experience, index) => <SmallInfoCard
            key={index}
            image={experience.company.logo}
            heading={experience.name}
            subtitle={`${experience.company.name} (${experience.type})`}
            imageSize="small"
            details={[experience.company.location, formatExperiencePeriod(experience.start, experience.end)]} />)}
        </div>
      </Section>
      <Section heading="Education">
        <SmallInfoCard {...bachelor} imageSize="small">
          <TextPreview>{content.bachelor.description}</TextPreview>
        </SmallInfoCard>
      </Section>
      <SmallInfoCardsGridSection heading="Certications" items={certifications} />
    </div>
  );
}