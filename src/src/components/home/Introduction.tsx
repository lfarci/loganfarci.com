import React from 'react';
import Image from 'next/image';

interface ContactProps {
    name: string;
    url: string;
}

interface ImageProps {
    src: string;
    alt: string;
    width: number;
    height: number;
}

interface IntroductionProps {
    heading: string;
    introduction: string;
    image?: ImageProps;
    contacts?: ContactProps[]
}

const Contact: React.FC<ContactProps> = ({ name, url }) => <a href={url} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">{ name }</a>;

const Contacts: React.FC<{ contacts: ContactProps[] }> = ({ contacts }) => <div className="flex flex-wrap gap-4">
    {contacts.map((contact, index) => (
        <Contact key={index} {...contact} />
    ))}
</div>;

const Introduction: React.FC<IntroductionProps> = ({ image, heading, introduction, contacts = [] }) => {
    const showContacts = contacts.length > 0;

    return (
        <div className="flex flex-col md:flex-row items-center md:items-start bg-white p-6 space-y-6">
            <div className="md:mr-6 space-y-6 flex-1">
                <h1 className="text-2xl md:text-4xl">{heading}</h1>
                <p className="text-lg md:text-xl text-gray-600">{introduction}</p>
                {showContacts && <Contacts contacts={contacts} />}
            </div>
            {image && <Image {...image} className="rounded-md w-full md:w-1/4" />}
        </div>
    );
};

export default Introduction;