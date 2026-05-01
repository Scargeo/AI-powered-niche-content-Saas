export type JobStatus = 'pending' | 'extracting' | 'analyzing' | 'transforming' | 'completed' | 'failed';

export interface ContentNugget {
  title: string;
  insight: string;
  importance: 'high' | 'medium' | 'low';
}

export interface SocialPost {
  platform: 'twitter' | 'linkedin' | 'instagram' | 'facebook';
  content: string;
  hashtags: string[];
  characterCount: number;
}

export interface VideoClip {
  clipNumber: number;
  title: string;
  hook: string;
  mainContent: string;
  callToAction: string;
  estimatedDuration: string;
}

export interface ContentOutputs {
  socialPosts: SocialPost[];
  emailNewsletter: {
    subject: string;
    preheader: string;
    body: string;
    ctaText: string;
    ctaUrl: string;
  };
  blogToVideoScript: {
    title: string;
    intro: string;
    sections: Array<{ heading: string; script: string; visualNotes: string }>;
    outro: string;
    estimatedDuration: string;
  };
  shortVideoClips: VideoClip[];
}

export interface ContentJob {
  id: string;
  status: JobStatus;
  sourceType: 'url' | 'file';
  sourceInfo: string;
  extractedText?: string;
  nuggets?: ContentNugget[];
  outputs?: ContentOutputs;
  error?: string;
  createdAt: string;
  updatedAt: string;
}
