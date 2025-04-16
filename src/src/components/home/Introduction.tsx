import React from 'react';
import Image from 'next/image';

interface ContactProps {
    name: string;
    url: string;
}

interface IntroductionProps {
    image: string;
    heading: string;
    introduction: string;
    contacts?: ContactProps[]
}

const Contact: React.FC<ContactProps> = ({ name, url }) => <a href={url} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">{ name }</a>;

const Introduction: React.FC<IntroductionProps> = ({ image, heading, introduction, contacts = [] }) => {
    const showContacts = contacts.length > 0;

    return (
        <div className="flex flex-col md:flex-row items-center md:items-start bg-white shadow-md rounded-lg p-6 space-y-6">
            <div className="md:mr-6 space-y-6">
            <h1 className="text-2xl md:text-4xl">{heading}</h1>
            <p className="text-lg md:text-xl text-gray-600">{introduction}</p>
            {showContacts && (
                <div className="flex space-x-6">
                {contacts.map((contact, index) => (
                    <Contact key={index} {...contact} />
                ))}
                </div>
            )}
            </div>
            <Image src={image} alt="Logan Farci" width={192} height={192} className="rounded-md" />
        </div>
    );
};

export default Introduction;