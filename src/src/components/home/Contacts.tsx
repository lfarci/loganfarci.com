import React from 'react';
import NewTabLink from '../shared/NewTabLink';

export interface ContactProps {
    name: string;
    url: string;
}

interface ContactsProps {
    contacts: ContactProps[];
}

const Contacts: React.FC<ContactsProps> = ({ contacts }) => <div className="flex flex-wrap gap-4">
    {contacts.map((contact, index) => (
        <NewTabLink key={index} url={contact.url}>{contact.name}</NewTabLink>
    ))}
</div>;

export default Contacts;
