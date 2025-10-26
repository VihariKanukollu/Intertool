
import { GoogleGenAI, Type } from "@google/genai";
import type { Tone, SocialPosts } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const socialPostSchema = {
    type: Type.OBJECT,
    properties: {
        content: {
            type: Type.STRING,
            description: "The main body of the social media post."
        },
        hashtags: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING,
                description: "A relevant hashtag, without the '#' symbol."
            },
            description: "An array of relevant hashtags for the post."
        }
    },
    required: ['content', 'hashtags']
};

export const generateSocialPosts = async (idea: string, tone: Tone): Promise<SocialPosts> => {
    const prompt = `
        You are an expert social media manager. Your task is to generate three social media posts from a single idea, tailored for LinkedIn, Twitter/X, and Instagram.
        The user's idea is: "${idea}"
        The desired tone is: "${tone}"

        Please generate content for each platform with the following considerations:
        - **LinkedIn:** Professional, detailed, and engaging for a business audience. Should be a longer form post.
        - **Twitter/X:** Short, punchy, and concise. Use a strong hook. Maximum 280 characters.
        - **Instagram:** Visually-focused caption. Start with a hook, followed by a short paragraph, and include relevant, popular hashtags.

        Provide the output in a JSON format that strictly follows the provided schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        linkedIn: socialPostSchema,
                        twitter: socialPostSchema,
                        instagram: socialPostSchema,
                    },
                    required: ['linkedIn', 'twitter', 'instagram']
                }
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as SocialPosts;

    } catch (error) {
        console.error("Error generating social posts:", error);
        throw new Error("Failed to generate content from AI. Please check your prompt and try again.");
    }
};

export const generateImage = async (prompt: string, aspectRatio: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: aspectRatio,
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }

    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate an image. The AI may have refused the prompt.");
    }
};
