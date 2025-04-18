import React from 'react';
import Image from 'next/image';
import ExternalLink, { ExternalLinkProps } from '../shared/ExternalLink';

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
    contacts?: ExternalLinkProps[]
}


const Contacts: React.FC<{ contacts: ExternalLinkProps[] }> = ({ contacts }) => <div className="flex flex-wrap gap-4">
    {contacts.map((contact, index) => (
        <ExternalLink key={index} {...contact} />
    ))}
</div>;

const Introduction: React.FC<IntroductionProps> = ({ image, heading, introduction, contacts = [] }) => {
    const showContacts = contacts.length > 0;

    return (
        <div className="flex flex-col md:flex-row items-center pt-8">
            <div className="md:mr-6 space-y-6 flex-1 flex flex-col justify-center">
            <h1 className="text-2xl md:text-4xl">{heading}</h1>
            <p className="text-lg md:text-xl text-gray-600">{introduction}</p>
            {showContacts && <Contacts contacts={contacts} />}
            </div>
            {image && <Image {...image} className="rounded-md w-full md:w-1/3 mt-6 md:mt-0" />}
        </div>
    );
};

export default Introduction;