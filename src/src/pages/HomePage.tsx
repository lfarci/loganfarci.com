import { Link } from "react-router";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { BlueskyIcon, EmailIcon, GitHubIcon, LinkedInIcon } from "@/components/shared/icons";
import { Button } from "@/components/shared/primitives/Button";
import { getContacts, getExperiences, getProfile } from "@/core/data";
import { createCanonicalUrl } from "@/core/seo";
import type { Contact } from "@/types";

const contacts = getContacts();
const profile = getProfile();
const currentExperience = getExperiences()[0];
const emailContact = contacts.find((contact) => contact.icon === "email");

const pageTitle = "Logan Farci - Software Engineer";
const pageDescription =
    "Software Engineer specializing in Azure, C#, .NET, and cloud-native solutions. Explore my work, articles, and certifications.";
const pageUrl = createCanonicalUrl("/");

const proofLinks = [
    { label: "Experience", detail: "Public, banking and energy systems", to: "/about#experience" },
    { label: "Writing", detail: "GitHub, Azure and applied AI", to: "/articles" },
    { label: "Cloud systems", detail: "C#, .NET, Azure and Terraform", to: "/about#skills" },
] as const;

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

function DownloadIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />
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
                <header className="home-masthead">
                    <Link
                        to="/"
                        aria-current="page"
                        className="home-wordmark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                    >
                        <span aria-hidden="true" className="home-wordmark-dot" />
                        Logan Farci
                    </Link>
                    <nav aria-label="Primary" className="home-primary-nav">
                        <Link to="/" aria-current="page" className="home-nav-link">
                            Home
                        </Link>
                        <Link to="/about" className="home-nav-link">
                            About
                        </Link>
                        <Link to="/articles" className="home-nav-link">
                            Articles
                        </Link>
                    </nav>
                    <ThemeToggle />
                </header>

                <section className="home-intro" aria-labelledby="home-heading">
                    <h1 id="home-heading" className="home-heading">
                        <span>Hi, I&apos;m Logan.</span>
                        <span className="text-brand">Software Engineer</span>
                    </h1>
                    <p className="home-role">{profile.role}</p>
                    <p className="home-stack">C# · .NET · Azure · cloud-native systems</p>
                </section>

                <div className="home-actions">
                    <div className="home-cta-row">
                        <Button asChild className="home-cta home-cta-primary">
                            <a href="/resume.pdf" download>
                                <DownloadIcon />
                                Download résumé
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
                    <div className="home-portrait-marker" aria-hidden="true">
                        L. FARCI
                    </div>
                    <img
                        src={profile.avatar.src}
                        alt={profile.avatar.alt}
                        width={profile.avatar.width ?? 512}
                        height={profile.avatar.height ?? 512}
                        fetchPriority="high"
                    />
                    <figcaption>
                        <span>{currentExperience?.name ?? "Full-Stack Developer"}</span>
                        <span>{currentExperience?.company.name ?? "Avanade"}</span>
                    </figcaption>
                </figure>

                <nav className="home-proof" aria-label="Profile highlights">
                    {proofLinks.map((proof) => (
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
