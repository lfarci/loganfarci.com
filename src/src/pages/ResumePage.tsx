import Section from "@/components/shared/Section";
import React from "react";
import MarkdownContent from "@/components/shared/MarkdownContent";
import { Card, CardBody, CardHeader, CardSubtitle, CardTitle } from "@/components/cards";
import InfoCard from "@/components/cards/InfoCard";
import { Certification, SkillCategory } from "@/types";
import { MarkdownPreview } from "@/components/shared/preview";
import {
    getCertifications,
    getContacts,
    getDiploma,
    getExperiences,
    getProfile,
    getSkillCategories,
} from "@/core/data";
import { formatExperiencePeriod } from "@/core/date";
import IconTag from "@/components/shared/IconTag";
import { Text } from "@/components/shared/typography";
import { createId } from "@/core/string";
import ColumnContainer from "@/components/layout/ColumnContainer";
import JsonLd from "@/components/shared/JsonLd";
import { Heading1 } from "@/components/shared/typography";
import { createBreadcrumbJsonLd, createCanonicalUrl, siteName } from "@/core/seo";
import NewTabLink from "@/components/shared/NewTabLink";
import ContactLinks from "@/components/ContactLinks";
import type { JsonLdObject } from "@/core/seo";
import { siteUrl } from "@/core/site";

const profile = getProfile();
const experiences = getExperiences();
const diploma = getDiploma();
const certifications = getCertifications()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((certification: Certification) => ({
        image: certification.image,
        title: certification.title,
        description: certification.issuer,
        url: certification.url,
    }));
const skillCategories = getSkillCategories();
const contacts = getContacts();

const pageTitle = "Résumé - Logan Farci";
const pageDescription =
    "Professional résumé for Logan Farci, a Software Engineer specializing in Azure, C#, .NET, and cloud-native solutions.";
const pageUrl = createCanonicalUrl("/resume");
const skillKeywords = [...new Set(skillCategories.flatMap((cat) => cat.skills.map((s) => s.name)))].sort();
const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Résumé", path: "/resume" },
]);

function createPersonJsonLd(): JsonLdObject {
    const skillNames = [...new Set(skillCategories.flatMap((cat) => cat.skills.map((s) => s.name)))].sort();

    const knowsAbout = [
        ...new Set(
            skillCategories.flatMap((cat) => cat.skills.map((skill) => ({ "@type": "Thing", name: skill.name }))),
        ),
    ];

    const alumniOf: JsonLdObject = { "@type": "EducationalOrganization", name: diploma.University };

    const person: JsonLdObject = {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: siteName,
        url: siteUrl,
        image: createCanonicalUrl(profile.avatar.src),
        jobTitle: "Software Engineer",
        description: profile.introduction,
        knowsAbout,
        alumniOf,
        skills: skillNames.join(", "),
        hasOccupation: [
            ...experiences.map((exp) => ({
                "@type": "Occupation",
                name: exp.name,
                description: exp.description ?? undefined,
                startDate: exp.start,
                endDate: exp.end ?? undefined,
                employer: { "@type": "Organization", name: exp.company.name, location: exp.company.location },
            })),
        ],
    };

    const contactsUrls = contacts.map((c) => c.url).filter((url) => url.startsWith("http"));
    if (contactsUrls.length > 0) {
        person.sameAs = contactsUrls;
    }

    return person;
}

const personJsonLd = createPersonJsonLd();

export default function ResumePage() {
    return (
        <>
            <title>{pageTitle}</title>
            <link rel="canonical" href={pageUrl} />
            <meta name="description" content={pageDescription} />
            <meta name="keywords" content={skillKeywords.join(", ")} />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:url" content={pageUrl} />
            <meta name="twitter:title" content={pageTitle} />
            <meta name="twitter:description" content={pageDescription} />
            <JsonLd data={[breadcrumbJsonLd, personJsonLd]} />

            <article className="py-8 md:py-10">
                {/* Header: name, role, contacts */}
                <header className="mb-8 md:mb-10">
                    <Heading1 id="resume" className="mb-2 scroll-mt-24">
                        Résumé
                    </Heading1>
                    <div className="flex flex-col gap-1 mb-4">
                        <Text className="text-lg font-medium">{profile.role}</Text>
                        <ContactLinks contacts={contacts} />
                    </div>
                    <div className="flow-root">
                        <img
                            src={profile.avatar.src}
                            alt={profile.avatar.alt}
                            width={120}
                            height={120}
                            className="block mx-auto mb-4 md:float-right md:ml-6 md:mb-4 md:mt-0"
                        />
                        <MarkdownContent content={profile.description} />
                    </div>
                </header>

                {/* Experience */}
                <Section heading="Experience">
                    <ColumnContainer>
                        {experiences.map((experience) => (
                            <InfoCard
                                key={`${experience.name}-${experience.company.name}`}
                                title={experience.name}
                                subtitle={`${experience.company.name}${experience.type ? ` (${experience.type})` : ""}`}
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

                {/* Education */}
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

                {/* Certifications */}
                <Section heading="Certifications">
                    <ColumnContainer>
                        {certifications.map((cert) =>
                            cert.url ? (
                                <NewTabLink key={cert.title} url={cert.url}>
                                    <InfoCard
                                        title={cert.title}
                                        subtitle={cert.description}
                                        media={cert.image}
                                        mediaSize="small"
                                        mediaAlign="start"
                                        align="start"
                                    />
                                </NewTabLink>
                            ) : (
                                <InfoCard
                                    key={cert.title}
                                    title={cert.title}
                                    subtitle={cert.description}
                                    media={cert.image}
                                    mediaSize="small"
                                    mediaAlign="start"
                                    align="start"
                                />
                            ),
                        )}
                    </ColumnContainer>
                </Section>

                {/* Skills */}
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
                                        {category.skills.map((skill) => (
                                            <IconTag key={skill.name}>{skill.name}</IconTag>
                                        ))}
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </ColumnContainer>
                </Section>
            </article>
        </>
    );
}
