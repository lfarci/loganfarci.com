import React from "react";
import ClientTooltip from "../shared/ClientTooltip";
import NewTabLink from "../shared/NewTabLink";
import { EmailIcon, BlueskyIcon, GitHubIcon, LinkedInIcon } from "@/components/shared/icons";

export interface ContactProps {
    name: string;
    url: string;
    icon: string;
}

interface ContactsProps {
    contacts: ContactProps[];
}

const getContactIcon = (icon: string) => {
    const iconProps = { className: "text-text-tertiary w-8 h-8", size: 32 };
    const emailIconProps = { className: "text-text-tertiary w-8 h-8", size: 36 };

    switch (icon) {
        case "bluesky":
            return <BlueskyIcon {...iconProps} />;
        case "email":
            return <EmailIcon {...emailIconProps} />;
        case "github":
            return <GitHubIcon {...iconProps} />;
        case "linkedin":
            return <LinkedInIcon {...iconProps} />;
        default:
            return null;
    }
};

const Contacts: React.FC<ContactsProps> = ({ contacts }) => (
    <div className="flex flex-wrap gap-6 ">
        {contacts.map((contact) => (
            <ClientTooltip key={contact.name} content={contact.name} placement="bottom">
                <NewTabLink url={contact.url}>{getContactIcon(contact.icon)}</NewTabLink>
            </ClientTooltip>
        ))}
    </div>
);

export default Contacts;
