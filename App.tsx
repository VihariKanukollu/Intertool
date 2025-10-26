
import React, { useState, useCallback } from 'react';
import { generateSocialPosts, generateImage } from './services/geminiService';
import type { Tone, Platform, SocialPosts } from './types';
import { TONES, PLATFORMS, PLATFORM_CONFIG } from './constants';
import { SocialPostCard } from './components/SocialPostCard';

const App: React.FC = () => {
    const [idea, setIdea] = useState<string>('');
    const [tone, setTone] = useState<Tone>('Professional');
    const [generatedContent, setGeneratedContent] = useState<SocialPosts | null>(null);
    const [imageUrls, setImageUrls] = useState<Record<Platform, string | null>>({ LinkedIn: null, Twitter: null, Instagram: null });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!idea.trim()) {
            setError('Please enter an idea.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedContent(null);
        setImageUrls({ LinkedIn: null, Twitter: null, Instagram: null });

        try {
            const content = await generateSocialPosts(idea, tone);
            setGeneratedContent(content);

            const imagePrompt = `A visually appealing, high-quality image representing the concept of: "${idea}". Style should be modern and engaging.`;

            const imagePromises = PLATFORMS.map(platform =>
                generateImage(imagePrompt, PLATFORM_CONFIG[platform].aspectRatio)
                    .then(url => ({ platform, url }))
            );

            const results = await Promise.all(imagePromises);
            
            setImageUrls(prev => {
                const newUrls = {...prev};
                results.forEach(({platform, url}) => {
                    newUrls[platform] = url;
                });
                return newUrls;
            });

        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [idea, tone]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-4xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        AI Social Content Generator
                    </h1>
                    <p className="text-gray-400 mt-2 text-lg">Turn one idea into tailored content for every platform.</p>
                </header>

                <main className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="idea" className="block text-lg font-medium text-gray-300 mb-2">Your Content Idea</label>
                            <textarea
                                id="idea"
                                rows={3}
                                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow duration-200 resize-none"
                                placeholder="e.g., The launch of our new productivity app..."
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-lg font-medium text-gray-300 mb-2">Choose a Tone</label>
                            <div className="flex flex-wrap gap-2">
                                {TONES.map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTone(t)}
                                        disabled={isLoading}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                                            tone === t
                                                ? 'bg-purple-600 text-white shadow-lg'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !idea.trim()}
                            className="w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating...
                                </>
                            ) : (
                                'Generate Content'
                            )}
                        </button>
                        {error && <p className="text-red-400 text-center">{error}</p>}
                    </div>
                </main>

                {(isLoading || generatedContent) && (
                    <section className="mt-10">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                           {PLATFORMS.map(platform => (
                                <SocialPostCard 
                                    key={platform}
                                    platform={platform}
                                    content={generatedContent?.[PLATFORM_CONFIG[platform].key]?.content}
                                    hashtags={generatedContent?.[PLATFORM_CONFIG[platform].key]?.hashtags}
                                    imageUrl={imageUrls[platform]}
                                    isLoading={isLoading || (generatedContent !== null && imageUrls[platform] === null)}
                                />
                           ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default App;
