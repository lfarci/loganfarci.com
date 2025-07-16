import React from 'react';
import Image from 'next/image';

interface IconProps {
    className?: string;
    size?: number;
}

// Social platform icon mapping to SVG file paths
const socialIconPaths: Record<string, string> = {
    'LinkedIn': '/images/social/linkedin.svg',
    'GitHub': '/images/social/github.svg',
    'Bluesky': '/images/social/bluesky.svg',
    'Email': '/images/social/email.svg',
};

export const SocialIcon: React.FC<IconProps & { platformName: string }> = ({ 
    className = "", 
    size = 20, 
    platformName 
}) => {
    const iconPath = socialIconPaths[platformName];
    
    if (!iconPath) {
        return null;
    }
    
    return (
        <Image
            src={iconPath}
            alt={`${platformName} icon`}
            width={size}
            height={size}
            className={className}
            aria-hidden="true"
        />
    );
};

// Icon mapping for different social platforms
export const getSocialIcon = (platformName: string): React.FC<IconProps> | null => {
    if (!socialIconPaths[platformName]) {
        return null;
    }
    
    return ({ className = "", size = 20 }) => (
        <SocialIcon 
            platformName={platformName} 
            className={className} 
            size={size} 
        />
    );
};