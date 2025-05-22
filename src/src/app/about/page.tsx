"use client";

import Section from "@/components/shared/Section";
import { content } from "@/content/home";
import React from "react";
import TextSection from "@/components/shared/TextSection";
import SmallInfoCard, { SmallInfoCardProps } from "@/components/shared/cards/SmallInfoCard";
import SmallInfoCardsGridSection from "@/components/shared/cards/SmallInfoCardsSection";
import { Certification } from "@/content/types";

export default function About() {
  const certifications: SmallInfoCardProps[] = [...content.credentials]
    .sort((a, b) => (b.relevance ?? 0) - (a.relevance ?? 0))
    .map((certification: Certification) => ({
      image: certification.badge,
      heading: certification.title,
      subtitle: certification.issuer,
      details: [
        certification.date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long"
        })
      ],
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
      <Section heading="Education">
        <SmallInfoCard {...bachelor} />
      </Section>
      <SmallInfoCardsGridSection heading="Certications" items={certifications} />
    </div>
  );
}