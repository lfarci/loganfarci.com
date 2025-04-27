import React from 'react';
import Image from 'next/image';
import ExternalLink, { ExternalLinkProps } from '../shared/ExternalLink';
import GreetingHeading from './GreetingHeading';
import Contacts from './Contacts'; // Import the extracted Contacts component

interface ImageProps {
    src: string;
    alt: string;
    width: number;
    height: number;
}

interface IntroductionProps {
    introduction: string;
    image?: ImageProps;
    contacts?: ExternalLinkProps[];
}

const Introduction: React.FC<IntroductionProps> = ({ image, introduction, contacts = [] }) => (
    <div className="flex flex-col md:flex-row items-center pt-8">
        <div className="md:mr-6 space-y-6 flex-1 flex flex-col justify-center">
            <GreetingHeading greeting="Hi" name="Logan" />
            <p className="text">{introduction}</p>
            {contacts.length > 0 && <Contacts contacts={contacts} />}
        </div>
        {image && <Image {...image} className="rounded-xl w-full md:w-1/3 mt-6 md:mt-0" />}
    </div>
);

export default Introduction;