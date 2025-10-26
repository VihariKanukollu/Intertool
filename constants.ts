
import React from 'react';
import type { Tone, Platform } from './types';
import { LinkedInIcon, TwitterIcon, InstagramIcon } from './components/PlatformIcons';

export const TONES: Tone[] = ['Professional', 'Witty', 'Urgent'];
export const PLATFORMS: Platform[] = ['LinkedIn', 'Twitter', 'Instagram'];

interface PlatformConfig {
    aspectRatio: string;
    icon: React.FC<{ className?: string }>;
    key: keyof import('./types').SocialPosts;
    gradient: string;
}

export const PLATFORM_CONFIG: Record<Platform, PlatformConfig> = {
    LinkedIn: {
        aspectRatio: '4:3',
        icon: LinkedInIcon,
        key: 'linkedIn',
        gradient: 'from-blue-600 to-blue-400'
    },
    Twitter: {
        aspectRatio: '16:9',
        icon: TwitterIcon,
        key: 'twitter',
        gradient: 'from-gray-800 to-gray-600'
    },
    Instagram: {
        aspectRatio: '1:1',
        icon: InstagramIcon,
        key: 'instagram',
        gradient: 'from-pink-500 via-red-500 to-yellow-500'
    }
};
