import React from "react";
import ClientTooltip from "@/components/shared/ClientTooltip";
import NewTabLink from "@/components/shared/NewTabLink";
import { BlueskyIcon, EmailIcon, GitHubIcon, LinkedInIcon } from "@/components/shared/icons";
import type { Contact } from "@/types";

type SupportedContactIcon = "bluesky" | "email" | "github" | "linkedin";

interface ContactLinksProps {
    contacts: Contact[];
    iconSize?: number;
    className?: string;
}

const renderContactIcon = (icon: Contact["icon"], size: number) => {
    const iconProps = { className: "text-text-tertiary", size };

    switch (icon as SupportedContactIcon) {
        case "bluesky":
            return <BlueskyIcon {...iconProps} />;
        case "email":
            return <EmailIcon {...iconProps} size={size + 4} />;
        case "github":
            return <GitHubIcon {...iconProps} />;
        case "linkedin":
            return <LinkedInIcon {...iconProps} />;
        default:
            return null;
    }
};

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
                    <ClientTooltip key={contact.name} content={contact.name} placement="bottom">
                        <NewTabLink url={contact.url}>{content}</NewTabLink>
                    </ClientTooltip>
                );
            })}
        </div>
    );
};

export default ContactLinks;
