import NewTabLink from "@/components/shared/NewTabLink";
import Section from "@/components/shared/Section";
import { content } from "@/content/home";
import React from "react";
import Image from "next/image";

function CredentialCard({ credential }: { credential: any }) {
  return (
    <div className="flex bg-white rounded-lg shadow p-4 items-center w-full max-w-md mx-auto">
      <div className="flex-shrink-0 w-1/3 flex justify-center items-center">
        <Image
          src={credential.badge.src}
          alt={credential.badge.alt}
          width={credential.badge.width}
          height={credential.badge.height}
          className="object-contain h-16 w-16"
        />
      </div>
      <div className="flex flex-col justify-center w-2/3">
        <NewTabLink url={credential.verificationUrl}>
          {credential.title}
        </NewTabLink>
        <span className="text-sm text-gray-500">
          Issued by {credential.issuer} on {credential.date.toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

export default function About() {
  const sortedCredentials = [...content.credentials].sort(
    (a, b) => (b.relevance ?? 0) - (a.relevance ?? 0)
  );

  return (
    <div className="flex flex-col space-y-4">
      <Section heading="Certifications">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          {sortedCredentials.map((credential: any, index: number) => (
            <CredentialCard key={index} credential={credential} />
          ))}
        </div>
      </Section>
    </div>
  );
}