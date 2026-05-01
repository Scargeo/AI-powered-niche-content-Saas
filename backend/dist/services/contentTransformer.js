"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentTransformer = void 0;
const aiAnalyzer_1 = require("./aiAnalyzer");
class ContentTransformer {
    constructor() {
        this.analyzer = new aiAnalyzer_1.AIAnalyzer();
    }
    async transform(text, nuggets, options) {
        const { niche, tone, targetAudience } = options || {};
        // Run all transformations in parallel for speed
        const [socialPosts, emailNewsletter, blogToVideoScript, shortVideoClips] = await Promise.all([
            this.analyzer.generateSocialPosts(text, nuggets, niche, tone, targetAudience),
            this.analyzer.generateEmailNewsletter(text, nuggets, niche, tone, targetAudience),
            this.analyzer.generateBlogToVideoScript(text, nuggets, niche, tone),
            this.analyzer.generateShortVideoClips(text, nuggets, niche, tone)
        ]);
        // Ensure character counts are accurate
        const processedPosts = socialPosts.map((post) => ({
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
exports.ContentTransformer = ContentTransformer;
