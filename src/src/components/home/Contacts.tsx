import React from 'react';
import NewTabLink, { ExternalLinkProps } from '../shared/NewTabLink';

interface ContactsProps {
    contacts: ExternalLinkProps[];
}

const Contacts: React.FC<ContactsProps> = ({ contacts }) => <div className="flex flex-wrap gap-4">
    {contacts.map((contact, index) => (
        <NewTabLink key={index} {...contact} />
    ))}
</div>;

export default Contacts;
