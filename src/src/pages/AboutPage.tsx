import Section from "@/components/shared/Section";
import React from "react";
import MarkdownContent from "@/components/shared/MarkdownContent";
import {
    Card,
    CardBody,
    CardGrid,
    CardHeader,
    CardLink,
    CardSubtitle,
    CardTitle,
    MediaTileCard,
} from "@/components/cards";
import InfoCard from "@/components/cards/InfoCard";
import { Certification, Experience, SkillCategory } from "@/types";
import { MarkdownPreview } from "@/components/shared/preview";
import { getCertifications, getDiploma, getExperiences, getProfile, getSkillCategories } from "@/core/data";
import { formatExperiencePeriod } from "@/core/date";
import IconTag from "@/components/shared/IconTag";
import { Text } from "@/components/shared/typography";
import { createId } from "@/core/string";
import ColumnContainer from "@/components/layout/ColumnContainer";
import JsonLd from "@/components/shared/JsonLd";
import { Heading1 } from "@/components/shared/typography";
import { createBreadcrumbJsonLd, createCanonicalUrl } from "@/core/seo";

const certifications = getCertifications()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((certification: Certification) => ({
        image: certification.image,
        title: certification.title,
        description: certification.issuer,
        url: certification.url,
    }));
const featuredCertifications = certifications.slice(0, 6);
const remainingCertifications = certifications.slice(6);

const experiences = getExperiences();
const recentExperiences = experiences.slice(0, 2);
const earlierExperiences = experiences.slice(2);
const skillCategories = getSkillCategories();
const diploma = getDiploma();
const profile = getProfile();

const pageTitle = "About - Logan Farci";
const pageDescription =
    "Learn more about Logan Farci, a Software Engineer specializing in Azure, C#, .NET, and cloud-native solutions.";
const pageUrl = createCanonicalUrl("/about");
const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
]);

function ExperienceEntry({ experience }: { experience: Experience }) {
    return (
        <InfoCard
            title={experience.name}
            subtitle={`${experience.company.name}${experience.type ? ` (${experience.type})` : ""}`}
            details={[experience.company.location, formatExperiencePeriod(experience.start, experience.end)]}
            media={experience.company.logo}
            mediaSize="small"
            mediaAlign="start"
            align="start"
            showTitleTooltip
            className="rounded-none border-x-0 border-y-0 bg-transparent p-5 shadow-none hover:bg-surface-elevated hover:shadow-none"
        >
            <MarkdownPreview>{experience.description ?? ""}</MarkdownPreview>
        </InfoCard>
    );
}

export default function AboutPage() {
    return (
        <>
            <title>{pageTitle}</title>
            <link rel="canonical" href={pageUrl} />
            <meta name="description" content={pageDescription} />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:url" content={pageUrl} />
            <meta name="twitter:title" content={pageTitle} />
            <meta name="twitter:description" content={pageDescription} />
            <JsonLd data={breadcrumbJsonLd} />
            <article className="py-8 md:py-10">
                <Heading1 id="about-me" className="mb-6 scroll-mt-24 md:mb-8">
                    About Me
                </Heading1>
                <div className="flow-root border-b border-border-light pb-10 md:pb-12">
                    <img
                        src={profile.avatar.src}
                        alt={profile.avatar.alt}
                        width={300}
                        height={300}
                        className="block mx-auto mb-6 rounded-none md:float-right md:ml-8 md:mb-6 md:mt-0"
                    />
                    <MarkdownContent content={profile.description} />
                </div>
                <Section heading="Experience">
                    <ColumnContainer className="gap-0 divide-y divide-border-light border-y border-border-light">
                        {recentExperiences.map((experience) => (
                            <ExperienceEntry
                                key={`${experience.name}-${experience.company.name}`}
                                experience={experience}
                            />
                        ))}
                        {earlierExperiences.length > 0 && (
                            <details className="group">
                                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium text-text-primary marker:content-none focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
                                    View earlier experience
                                    <span className="font-[family-name:var(--font-reddit-mono)] text-xs uppercase tracking-[0.12em] text-accent">
                                        {earlierExperiences.length} roles
                                    </span>
                                </summary>
                                <div className="divide-y divide-border-light border-t border-border-light">
                                    {earlierExperiences.map((experience) => (
                                        <ExperienceEntry
                                            key={`${experience.name}-${experience.company.name}`}
                                            experience={experience}
                                        />
                                    ))}
                                </div>
                            </details>
                        )}
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
                <Section heading="Certifications">
                    <CardGrid columns={2} className="mt-0">
                        {featuredCertifications.map((certification) => (
                            <CardLink key={certification.title} href={certification.url} external>
                                <MediaTileCard
                                    title={certification.title}
                                    description={certification.description}
                                    image={certification.image}
                                    size="small"
                                />
                            </CardLink>
                        ))}
                    </CardGrid>
                    {remainingCertifications.length > 0 && (
                        <details className="group mt-6 border-y border-border-light">
                            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium text-text-primary marker:content-none focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
                                View all certifications
                                <span className="font-[family-name:var(--font-reddit-mono)] text-xs uppercase tracking-[0.12em] text-accent">
                                    {remainingCertifications.length} more
                                </span>
                            </summary>
                            <CardGrid columns={2} className="border-t border-border-light p-5">
                                {remainingCertifications.map((certification) => (
                                    <CardLink key={certification.title} href={certification.url} external>
                                        <MediaTileCard
                                            title={certification.title}
                                            description={certification.description}
                                            image={certification.image}
                                            size="small"
                                        />
                                    </CardLink>
                                ))}
                            </CardGrid>
                        </details>
                    )}
                </Section>
                <Section heading="Skills" id="skills">
                    <ColumnContainer className="gap-0 divide-y divide-border-light border-y border-border-light">
                        {skillCategories.map((category: SkillCategory) => (
                            <Card
                                key={category.name}
                                id={createId(category.name)}
                                className="scroll-mt-24 rounded-none border-x-0 border-y-0 bg-transparent p-5 shadow-none hover:bg-surface-elevated hover:shadow-none"
                            >
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
