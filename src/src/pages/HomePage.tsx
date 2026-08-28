import ArticleListSection from "@/components/ArticleListSection";
import ContactLinks from "@/components/ContactLinks";
import HeroSection from "@/components/HeroSection";
import ColumnContainer from "@/components/layout/ColumnContainer";
import Section from "@/components/shared/Section";
import TextSection from "@/components/shared/TextSection";
import ThumbnailGridSection from "@/components/shared/ThumbnailGridSection";
import { Button } from "@/components/shared/primitives/Button";
import { Heading1, Heading3, Text } from "@/components/shared/typography";
import { getFeaturedArticles } from "@/core/articles";
import { getCertifications, getContacts, getInterests, getProfile } from "@/core/data";
import { createCanonicalUrl } from "@/core/seo";
import { Link } from "react-router";

const featuredCertifications = getCertifications().filter((c) => c.relevance == "High");
const interests = getInterests();
const contacts = getContacts();
const profile = getProfile();
const featuredArticles = getFeaturedArticles();
const emailContact = contacts.find((contact) => contact.icon === "email");

const pageTitle = "Logan Farci - Software Engineer";
const pageDescription =
    "Software Engineer specializing in Azure, C#, .NET, and cloud-native solutions. Explore my work, articles, and certifications.";
const pageUrl = createCanonicalUrl("/");

export default function HomePage() {
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
            <ColumnContainer>
                <HeroSection
                    heading={
                        <Heading1 className="max-w-3xl text-5xl tracking-[-0.035em] md:text-7xl md:leading-[0.98]">
                            Cloud-native solutions that scale.
                        </Heading1>
                    }
                    description={
                        <div className="max-w-xl space-y-3">
                            <p className="font-[family-name:var(--font-reddit-mono)] text-xs uppercase tracking-[0.14em] text-accent">
                                Azure Associate Developer
                            </p>
                            <Text>{profile.introduction}</Text>
                        </div>
                    }
                    image={{ ...profile.avatar, src: "/images/avatar.png" }}
                    actions={
                        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                            <Button asChild>
                                <a href="/resume.pdf" download>
                                    Download résumé
                                </a>
                            </Button>
                            {emailContact && (
                                <Button asChild variant="secondary">
                                    <a href={emailContact.url}>Contact me</a>
                                </Button>
                            )}
                        </div>
                    }
                    proof={
                        <>
                            <dl className="grid max-w-2xl border-y border-border-light sm:grid-cols-3">
                                <div className="border-b border-border-light py-4 sm:border-b-0 sm:border-r sm:pr-5">
                                    <dt className="font-[family-name:var(--font-reddit-mono)] text-xs uppercase tracking-[0.12em] text-accent">
                                        Experience
                                    </dt>
                                    <dd className="mt-2 text-sm leading-6 text-text-secondary">
                                        Belgian public, banking, and energy
                                    </dd>
                                </div>
                                <div className="border-b border-border-light py-4 sm:border-b-0 sm:border-r sm:px-5">
                                    <dt className="font-[family-name:var(--font-reddit-mono)] text-xs uppercase tracking-[0.12em] text-accent">
                                        Writing
                                    </dt>
                                    <dd className="mt-2 text-sm leading-6 text-text-secondary">
                                        Technical articles and practical notes
                                    </dd>
                                </div>
                                <div className="py-4 sm:pl-5">
                                    <dt className="font-[family-name:var(--font-reddit-mono)] text-xs uppercase tracking-[0.12em] text-accent">
                                        Cloud systems
                                    </dt>
                                    <dd className="mt-2 text-sm leading-6 text-text-secondary">
                                        Azure, .NET, and dependable delivery
                                    </dd>
                                </div>
                            </dl>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                <Text className="text-sm text-text-muted">Find me elsewhere</Text>
                                <ContactLinks contacts={contacts} iconSize={20} />
                            </div>
                        </>
                    }
                />
                <TextSection
                    heading="About Me"
                    text={profile.introduction}
                    redirectPath="/about#about-me"
                    redirectLabel="Read more about me"
                />
                <Section heading="What I Do" redirectPath="/about#skills" redirectLabel="Explore my skills in detail">
                    <div className="grid border-b border-border-light md:grid-cols-2 md:gap-x-10">
                        {interests.map((interest) => (
                            <Link
                                key={interest.title}
                                to={interest.redirectPath ?? "/about#skills"}
                                className="group border-t border-border-light py-5 pr-4 focus-visible:relative focus-visible:z-10 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:py-6"
                            >
                                <Heading3 className="transition-colors group-hover:text-primary-hover">
                                    {interest.title}
                                </Heading3>
                                <Text className="mt-2 text-text-secondary">{interest.description}</Text>
                                <span className="mt-3 inline-block font-[family-name:var(--font-reddit-mono)] text-xs uppercase tracking-[0.12em] text-accent">
                                    Explore skills
                                </span>
                            </Link>
                        ))}
                    </div>
                </Section>
                <ThumbnailGridSection
                    heading="My Certifications"
                    size="large"
                    columns={3}
                    items={featuredCertifications}
                    redirectPath="/about#certifications"
                    redirectLabel="Show all my certifications"
                />
                <ArticleListSection
                    heading="Featured Articles"
                    articles={featuredArticles}
                    limit={3}
                    redirectPath="/articles"
                    redirectLabel="View all my articles"
                    emptyMessage="No featured articles found."
                />
            </ColumnContainer>
        </>
    );
}
