import React from "react";
import Image from "next/image";
import ClientTooltip from "../shared/ClientTooltip";
import NewTabLink from "../shared/NewTabLink";

export interface ContactProps {
    name: string;
    url: string;
    icon: string;
}

interface ContactsProps {
    contacts: ContactProps[];
}

const Contacts: React.FC<ContactsProps> = ({ contacts }) => (
    <div className="flex flex-wrap gap-6">
        {contacts.map((contact, index) => (
            <ClientTooltip key={index} content={contact.name} placement="bottom">
                <NewTabLink url={contact.url}>
                    <Image
                        src={contact.icon}
                        alt={contact.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 hover:opacity-80 transition-opacity"
                    />
                </NewTabLink>
            </ClientTooltip>
        ))}
    </div>
);

export default Contacts;
