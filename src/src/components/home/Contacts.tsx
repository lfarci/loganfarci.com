import React from 'react';
import { getSocialIcon } from '../shared/SocialIcons';

export interface ContactProps {
    name: string;
    url: string;
}

interface ContactsProps {
    contacts: ContactProps[];
}

const Contacts: React.FC<ContactsProps> = ({ contacts }) => (
    <div className="flex flex-wrap gap-6">
        {contacts.map((contact, index) => {
            const IconComponent = getSocialIcon(contact.name);
            
            return (
                <a
                    key={index}
                    href={contact.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-all duration-200 ease-in-out transform hover:scale-105"
                    aria-label={`Visit ${contact.name} profile`}
                >
                    {IconComponent && (
                        <IconComponent 
                            className="group-hover:scale-110 transition-transform duration-200" 
                            size={20} 
                        />
                    )}
                    <span className="text-base md:text-lg font-medium">
                        {contact.name}
                    </span>
                </a>
            );
        })}
    </div>
);

export default Contacts;
