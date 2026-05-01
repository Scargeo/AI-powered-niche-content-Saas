import { AIAnalyzer } from './aiAnalyzer';
import { ContentNugget, ContentOutputs } from '../types';

export class ContentTransformer {
  private analyzer: AIAnalyzer;

  constructor() {
    this.analyzer = new AIAnalyzer();
  }

  async transform(
    text: string,
    nuggets: ContentNugget[],
    options?: { niche?: string; tone?: string; targetAudience?: string }
  ): Promise<ContentOutputs> {
    const { niche, tone, targetAudience } = options || {};

    // Run all transformations in parallel for speed
    const [socialPosts, emailNewsletter, blogToVideoScript, shortVideoClips] = await Promise.all([
      this.analyzer.generateSocialPosts(text, nuggets, niche, tone, targetAudience),
      this.analyzer.generateEmailNewsletter(text, nuggets, niche, tone, targetAudience),
      this.analyzer.generateBlogToVideoScript(text, nuggets, niche, tone),
      this.analyzer.generateShortVideoClips(text, nuggets, niche, tone)
    ]);

    // Ensure character counts are accurate
    const processedPosts = socialPosts.map((post: any) => ({
      ...post,
      characterCount: post.content?.length || 0
    }));

    return {
      socialPosts: processedPosts,
      emailNewsletter,
      blogToVideoScript,
      shortVideoClips
    };
  }
}
