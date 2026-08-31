import { Link } from "react-router";
import { BlueskyIcon, EmailIcon, GitHubIcon, LinkedInIcon } from "@/components/shared/icons";
import { Button } from "@/components/shared/primitives/Button";
import { getContacts, getHomeContent, getProfile } from "@/core/data";
import { createCanonicalUrl } from "@/core/seo";
import type { Contact } from "@/types";

const contacts = getContacts();
const profile = getProfile();
const homeContent = getHomeContent();
const emailContact = contacts.find((contact) => contact.icon === "email");

const pageTitle = "Logan Farci - Software Engineer";
const pageDescription =
    "Software Engineer specializing in Azure, C#, .NET, and cloud-native solutions. Explore my work, articles, and certifications.";
const pageUrl = createCanonicalUrl("/");

function getContactIcon(contact: Contact) {
    const iconProps = { className: "size-5", size: 20, strokeWidth: 2 };

    switch (contact.icon) {
        case "bluesky":
            return <BlueskyIcon {...iconProps} />;
        case "email":
            return <EmailIcon {...iconProps} />;
        case "github":
            return <GitHubIcon {...iconProps} />;
        case "linkedin":
            return <LinkedInIcon {...iconProps} />;
        default:
            return null;
    }
}

function ResumeIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
            <path d="M14 2v6h6M8 13h8M8 17h6" />
        </svg>
    );
}

function ArrowIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M5 12h14m-5-5 5 5-5 5" />
        </svg>
    );
}

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

            <div className="home-frame">
                <section className="home-intro" aria-labelledby="home-heading">
                    <h1 id="home-heading" className="home-heading">
                        <span>Hi, I&apos;m Logan.</span>
                        <span className="text-brand">Software Engineer</span>
                    </h1>
                    <p className="home-role">{profile.role}</p>
                    <p className="home-stack">{homeContent.technologies.join(" · ")}</p>
                </section>

                <div className="home-actions">
                    <div className="home-cta-row">
                        <Button asChild className="home-cta home-cta-primary">
                            <a href="/resume.pdf" download>
                                <ResumeIcon />
                                View résumé
                            </a>
                        </Button>
                        <Button asChild variant="secondary" className="home-cta home-cta-secondary">
                            <a href={emailContact?.url ?? "mailto:logan.farci@outlook.be"}>
                                <EmailIcon className="size-5" size={20} strokeWidth={2} />
                                Contact me
                            </a>
                        </Button>
                    </div>
                    <div className="home-contact-list" aria-label="Other ways to connect">
                        {contacts.map((contact) => (
                            <a
                                key={contact.name}
                                href={contact.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={contact.name}
                                className="home-contact-link"
                            >
                                {getContactIcon(contact)}
                            </a>
                        ))}
                    </div>
                </div>

                <figure className="home-portrait">
                    <img
                        src={profile.avatar.src}
                        alt={profile.avatar.alt}
                        width={profile.avatar.width ?? 512}
                        height={profile.avatar.height ?? 512}
                        fetchPriority="high"
                    />
                    <figcaption>Consultant · Avanade</figcaption>
                </figure>

                <nav className="home-proof" aria-label="Profile highlights">
                    {homeContent.proofLinks.map((proof) => (
                        <Link key={proof.label} to={proof.to} className="home-proof-link">
                            <span className="home-proof-label">{proof.label}</span>
                            <span className="home-proof-detail">{proof.detail}</span>
                            <ArrowIcon />
                        </Link>
                    ))}
                </nav>
            </div>
        </>
    );
}
