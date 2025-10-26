
export type Tone = 'Professional' | 'Witty' | 'Urgent';

export type Platform = 'LinkedIn' | 'Twitter' | 'Instagram';

export interface SocialPost {
  content: string;
  hashtags: string[];
}

export interface SocialPosts {
  linkedIn: SocialPost;
  twitter: SocialPost;
  instagram: SocialPost;
}
