import React from "react";
import { motion } from "framer-motion";
import Tooltip from "@/components/shared/Tooltip";
import { BlueskyIcon, EmailIcon, GitHubIcon, LinkedInIcon } from "@/components/shared/icons";
import { hoverLift, pressTap } from "@/core/animations";
import type { Contact } from "@/types";

type SupportedContactIcon = "bluesky" | "email" | "github" | "linkedin";

interface ContactLinksProps {
    contacts: Contact[];
    iconSize?: number;
    className?: string;
}

const renderContactIcon = (icon: Contact["icon"], size: number) => {
    const iconProps = { className: "text-current", size };

    switch (icon as SupportedContactIcon) {
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
};

const contactButtonClassName =
    "group relative inline-flex size-12 items-center justify-center overflow-hidden rounded-2xl border border-border-light/80 bg-surface/85 text-text-secondary shadow-soft ring-1 ring-white/35 backdrop-blur transition-all duration-300 ease-brand hover:-translate-y-0.5 hover:border-transparent hover:text-text-inverse hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

// Reusable row of social/contact links rendered as icon buttons with tooltips.
const ContactLinks: React.FC<ContactLinksProps> = ({ contacts, iconSize = 32, className = "" }) => {
    if (!contacts || contacts.length === 0) {
        return null;
    }

    const containerClassName = `flex flex-wrap gap-6 ${className}`.trim();

    return (
        <div className={containerClassName}>
            {contacts.map((contact) => {
                const icon = renderContactIcon(contact.icon, iconSize);
                const content = icon ?? <span className="text-text-tertiary font-medium">{contact.name}</span>;

                return (
                    <Tooltip key={contact.name} content={contact.name} placement="bottom">
                        <motion.a
                            href={contact.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={contact.name}
                            whileHover={hoverLift}
                            whileTap={pressTap}
                            className={contactButtonClassName}
                        >
                            <span
                                aria-hidden="true"
                                className="absolute inset-0 bg-brand-gradient opacity-0 transition-opacity duration-300 ease-brand group-hover:opacity-100"
                            />
                            <span aria-hidden="true" className="absolute inset-x-3 top-0 h-px bg-white/70" />
                            <span className="relative z-10">{content}</span>
                        </motion.a>
                    </Tooltip>
                );
            })}
        </div>
    );
};

export default ContactLinks;
