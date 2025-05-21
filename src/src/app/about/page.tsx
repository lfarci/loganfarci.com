"use client";

import Section from "@/components/shared/Section";
import { content } from "@/content/home";
import React from "react";
import { Certification } from "@/content/types";
import TextSection from "@/components/shared/TextSection";
import SmallInfoCard, { SmallInfoCardProps } from "@/components/shared/cards/SmallInfoCard";


export default function About() {
  const sortedCredentials = [...content.credentials].sort(
    (a, b) => (b.relevance ?? 0) - (a.relevance ?? 0)
  );

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
      <Section heading="Certifications">
        <div className="grid gap-4 mt-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {sortedCredentials.map((credential: Certification, index: number) => (
            <SmallInfoCard
              key={index}
              heading={credential.title}
              subtitle={credential.issuer}
              details={[
                credential.date.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long"
                })
              ]}
              image={credential.badge}
              tooltip={credential.title}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}