import React from 'react';
import Image from 'next/image';
import ExternalLink, { ExternalLinkProps } from '../shared/ExternalLink';
import Icon from '../shared/Icon';

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

const WavingHandIcon: React.FC = () => <Image src="/icons/waving_hand.png" alt={'Waving hand'} width={256} height={256} className="inline-block w-10 h-10" />;

const Contacts: React.FC<{ contacts: ExternalLinkProps[] }> = ({ contacts }) => <div className="flex flex-wrap gap-4">
    {contacts.map((contact, index) => (
        <ExternalLink key={index} {...contact} />
    ))}
</div>;

const Introduction: React.FC<IntroductionProps> = ({ image, introduction, contacts = [] }) => {
    const showContacts = contacts.length > 0;

    return (
        <div className="flex flex-col md:flex-row items-center pt-8">
            <div className="md:mr-6 space-y-6 flex-1 flex flex-col justify-center">
                <h1 className="text-4xl font-bold heading-font flex items-center">
                    <span className="pr-1">Hi</span>
                    <WavingHandIcon />
                    <span>, I'm Logan</span>
                </h1>
                <p className="important-text">{introduction}</p>
                {showContacts && <Contacts contacts={contacts} />}
            </div>
            {image && <Image {...image} className="rounded-xl w-full md:w-1/3 mt-6 md:mt-0" />}
        </div>
    );
};

export default Introduction;