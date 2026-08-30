import type { ReactNode } from "react";
import JsonLd from "@/components/shared/JsonLd";
import MarkdownContent from "@/components/shared/MarkdownContent";
import IconTag from "@/components/shared/IconTag";
import { ChevronDownIcon } from "@/components/shared/icons";
import { getCertifications, getDiploma, getExperiences, getProfile, getSkillCategories } from "@/core/data";
import { formatExperiencePeriod } from "@/core/date";
import { createBreadcrumbJsonLd, createCanonicalUrl } from "@/core/seo";
import type { Certification, SkillCategory } from "@/types";

const relevanceOrder: Record<Certification["relevance"], number> = { High: 0, Medium: 1, Low: 2 };
const certifications = getCertifications().sort(
    (left, right) =>
        relevanceOrder[left.relevance] - relevanceOrder[right.relevance] || (left.order ?? 0) - (right.order ?? 0),
);
const featuredCertifications = certifications.filter((certification) => certification.relevance === "High");
const additionalCertifications = certifications.filter((certification) => certification.relevance !== "High");
const experiences = getExperiences();
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

function ArrowUpRightIcon() {
    return (
        <svg aria-hidden="true" className="field-link-arrow" fill="none" viewBox="0 0 24 24">
            <path
                d="M7 17 17 7M8 7h9v9"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.75"
            />
        </svg>
    );
}

interface DisclosureProps {
    children: ReactNode;
    defaultOpen?: boolean;
    detail?: string;
    title: string;
}

function Disclosure({ children, defaultOpen = false, detail, title }: Readonly<DisclosureProps>) {
    return (
        <details className="field-disclosure" open={defaultOpen}>
            <summary>
                <span className="min-w-0">
                    <h3>{title}</h3>
                    {detail && <span className="field-meta">{detail}</span>}
                </span>
                <ChevronDownIcon aria-hidden="true" className="field-disclosure-icon" size={22} strokeWidth={1.75} />
            </summary>
            <div className="field-disclosure-body">{children}</div>
        </details>
    );
}

function CertificationLink({ certification }: Readonly<{ certification: Certification }>) {
    return (
        <a href={certification.url} target="_blank" rel="noopener noreferrer" className="field-credential-link">
            <img
                src={certification.image.src}
                alt={certification.image.alt}
                width={certification.image.width}
                height={certification.image.height}
            />
            <span className="min-w-0">
                <h3>{certification.title}</h3>
                <span className="field-meta">{certification.issuer}</span>
            </span>
            <ArrowUpRightIcon />
        </a>
    );
}

function SkillDisclosure({ category, defaultOpen }: Readonly<{ category: SkillCategory; defaultOpen: boolean }>) {
    return (
        <Disclosure defaultOpen={defaultOpen} detail={`${category.skills.length} skills`} title={category.name}>
            <p className="field-supporting-copy">{category.description}</p>
            <div className="field-skill-list">
                {category.skills.map((skill) => (
                    <IconTag key={skill.name}>{skill.name}</IconTag>
                ))}
            </div>
        </Disclosure>
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

            <article className="field-page field-about-page">
                <header className="field-page-header" id="about-me">
                    <h1 className="field-page-title">About Me</h1>
                    <p className="field-page-deck">
                        The experience, working principles, and technical range behind the systems I build.
                    </p>
                </header>

                <section className="field-about-intro" aria-label="Profile">
                    <figure className="field-about-portrait">
                        <img
                            src={profile.avatar.src}
                            alt={profile.avatar.alt}
                            width={profile.avatar.width ?? 512}
                            height={profile.avatar.height ?? 512}
                        />
                    </figure>
                    <div className="field-about-narrative">
                        <MarkdownContent content={profile.description} measure />
                    </div>
                </section>

                <section className="field-section" id="experience">
                    <header className="field-section-header">
                        <h2>Experience</h2>
                        <p>Selected roles and the systems delivered along the way.</p>
                    </header>
                    <div className="field-disclosure-list">
                        {experiences.map((experience, index) => (
                            <Disclosure
                                key={`${experience.name}-${experience.company.name}`}
                                defaultOpen={index === 0}
                                title={experience.name}
                                detail={`${experience.company.name} · ${formatExperiencePeriod(experience.start, experience.end)}`}
                            >
                                <div className="field-entry-layout">
                                    <img
                                        src={experience.company.logo.src}
                                        alt={experience.company.logo.alt}
                                        width={experience.company.logo.width}
                                        height={experience.company.logo.height}
                                        className="field-entry-logo"
                                    />
                                    <div>
                                        <p className="field-meta mb-4">
                                            {experience.company.location} · {experience.type}
                                        </p>
                                        <MarkdownContent content={experience.description} measure />
                                    </div>
                                </div>
                            </Disclosure>
                        ))}
                    </div>
                </section>

                <section className="field-section" id="education">
                    <header className="field-section-header">
                        <h2>Education</h2>
                        <p>The foundation beneath the professional work.</p>
                    </header>
                    <article className="field-education-entry">
                        <img
                            src={diploma.logo.src}
                            alt={diploma.logo.alt}
                            width={diploma.logo.width}
                            height={diploma.logo.height}
                        />
                        <div>
                            <h3>{diploma.name}</h3>
                            <p className="field-meta">
                                {diploma.University} · {diploma.details.join(" · ")}
                            </p>
                            <div className="mt-5">
                                <MarkdownContent content={diploma.description} measure />
                            </div>
                        </div>
                    </article>
                </section>

                <section className="field-section" id="certifications">
                    <header className="field-section-header">
                        <h2>Certifications</h2>
                        <p>Current, relevant proof—led by the credentials closest to my work.</p>
                    </header>
                    <div>
                        <div className="field-credential-list">
                            {featuredCertifications.map((certification) => (
                                <CertificationLink key={certification.title} certification={certification} />
                            ))}
                        </div>
                        {additionalCertifications.length > 0 && (
                            <div>
                                <Disclosure
                                    title="Additional certifications"
                                    detail={`${additionalCertifications.length} credentials`}
                                >
                                    <div className="field-credential-list">
                                        {additionalCertifications.map((certification) => (
                                            <CertificationLink
                                                key={certification.title}
                                                certification={certification}
                                            />
                                        ))}
                                    </div>
                                </Disclosure>
                            </div>
                        )}
                    </div>
                </section>

                <section className="field-section" id="skills">
                    <header className="field-section-header">
                        <h2>Skills</h2>
                        <p>Grouped by how the tools combine in real delivery work.</p>
                    </header>
                    <div className="field-disclosure-list">
                        {skillCategories.map((category, index) => (
                            <SkillDisclosure key={category.name} category={category} defaultOpen={index === 0} />
                        ))}
                    </div>
                </section>
            </article>
        </>
    );
}
