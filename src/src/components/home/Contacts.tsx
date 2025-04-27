import React from 'react';
import ExternalLink, { ExternalLinkProps } from '../shared/ExternalLink';

interface ContactsProps {
    contacts: ExternalLinkProps[];
}

const Contacts: React.FC<ContactsProps> = ({ contacts }) => (
    <div className="flex flex-wrap gap-4">
        {contacts.map((contact, index) => (
            <ExternalLink key={index} {...contact} />
        ))}
    </div>
);

export default Contacts;
