
import React from 'react';
import type { Platform } from '../types';
import { PLATFORM_CONFIG } from '../constants';

interface SocialPostCardProps {
    platform: Platform;
    content: string | undefined;
    hashtags: string[] | undefined;
    imageUrl: string | null;
    isLoading: boolean;
}

const ImageLoader: React.FC = () => (
    <div className="bg-gray-700 animate-pulse w-full aspect-[16/9]"></div>
);

const ContentLoader: React.FC = () => (
    <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        <div className="flex flex-wrap gap-2 mt-2">
            <div className="h-5 bg-gray-700 rounded-full w-20"></div>
            <div className="h-5 bg-gray-700 rounded-full w-24"></div>
            <div className="h-5 bg-gray-700 rounded-full w-16"></div>
        </div>
    </div>
);

export const SocialPostCard: React.FC<SocialPostCardProps> = ({ platform, content, hashtags, imageUrl, isLoading }) => {
    const config = PLATFORM_CONFIG[platform];
    const Icon = config.icon;

    const aspectClass = {
        '16:9': 'aspect-[16/9]',
        '4:3': 'aspect-[4/3]',
        '1:1': 'aspect-square'
    }[config.aspectRatio] || 'aspect-video';

    return (
        <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-700 flex flex-col h-full transform transition-transform duration-300 hover:scale-105">
            <div className={`p-4 flex items-center gap-3 bg-gradient-to-r ${config.gradient}`}>
                <Icon className="w-7 h-7 text-white" />
                <h3 className="text-xl font-bold text-white">{platform}</h3>
            </div>

            <div className="flex-grow flex flex-col">
                <div className={`relative w-full ${aspectClass} bg-gray-900`}>
                    {isLoading || !imageUrl ? (
                        <div className={`absolute inset-0 flex items-center justify-center ${aspectClass} w-full`}>
                             <div className="bg-gray-700 animate-pulse w-full h-full"></div>
                        </div>
                    ) : (
                        <img src={imageUrl} alt={`Generated for ${platform}`} className="w-full h-full object-cover" />
                    )}
                </div>
                
                <div className="p-5 flex-grow">
                    {isLoading ? (
                        <ContentLoader />
                    ) : (
                        <>
                            <p className="text-gray-300 whitespace-pre-wrap">{content}</p>
                            {hashtags && hashtags.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {hashtags.map((tag, index) => (
                                        <span key={index} className="text-purple-400 text-sm font-medium">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
