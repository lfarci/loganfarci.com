import Section from "@/components/shared/Section";
import { content } from "@/content/home";
import React from "react";
import Image from "next/image";
import { Certification } from "@/content/types";
import { Tooltip } from "@heroui/tooltip";

function CredentialCard({ credential }: { credential: Certification }) {
  const formattedDate = credential.date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long"
  });

  return (
    <div className="flex bg-white rounded-lg shadow p-4 !lg:mt-4 w-full mx-auto items-center min-w-0">
      <Image
        src={credential.badge.src}
        alt={credential.badge.alt}
        width={credential.badge.width}
        height={credential.badge.height}
        className="object-contain h-16 w-16 mr-4"
      />
      <div className="flex flex-col min-w-0">
        <Tooltip content={credential.title}>
          <h3 className="lg:text-base text-lg font-bold text-gray-500 heading-font whitespace-nowrap overflow-hidden text-ellipsis">
            {credential.title}
          </h3>
        </Tooltip>
        <span className="text-base text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">{credential.issuer}</span>
        <span className="text-base text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">{formattedDate}</span>
      </div>
    </div>
  );
}

export default function About() {
  const sortedCredentials = [...content.credentials].sort(
    (a, b) => (b.relevance ?? 0) - (a.relevance ?? 0)
  );

  return (
    <Section heading="Certifications">
      <div className="grid gap-4 mt-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {sortedCredentials.map((credential: Certification, index: number) => (
          <CredentialCard key={index} credential={credential} />
        ))}
      </div>
    </Section>
  );
}