import React from 'react';
import Image from 'next/image';

const Introduction: React.FC = () => {
    return (
        <div className="flex flex-col md:flex-row items-center md:items-start bg-white shadow-md rounded-lg p-4 space-y-4">
            <div className="md:mr-4 space-y-4">
                <h1 className="text-2xl md:text-4xl">Hi 👋, I&apos;m Logan Farci</h1>
                <p className="text-lg md:text-xl text-gray-600">
                    Welcome on my personal website! I&apos;m a Passionate and results-driven Software Engineer specializing in Microsoft technologies, with a focus on C#, .NET, Visual Studio, and Azure. With three years of hands-on experience in the public, banking, and energy sectors in Belgium, I&apos;ve demonstrated expertise in crafting robust solutions and driving digital innovation.
                </p>
            </div>
            <Image src="/avatar.png" alt="Logan Farci" width={192} height={192} className="rounded-md" />
        </div>
    );
};

export default Introduction;