import OpenAI from 'openai';
import { ContentNugget } from '../types';

export class AIAnalyzer {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async extractNuggets(text: string): Promise<ContentNugget[]> {
    const truncated = text.substring(0, 12000);
    
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a content strategist expert at identifying the most valuable insights from content. 
Extract 5-8 high-value nuggets/key insights from the provided content.
Respond ONLY with valid JSON array - no markdown, no explanation.
Format: [{"title": "short title", "insight": "detailed insight (2-3 sentences)", "importance": "high"|"medium"|"low"}]`
        },
        {
          role: 'user',
          content: `Extract the key nuggets from this content:\n\n${truncated}`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const content = response.choices[0]?.message?.content || '[]';
    try {
      // Strip markdown code fences if present
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch {
      return [{ title: 'Key Insight', insight: 'Could not parse nuggets from content', importance: 'medium' }];
    }
  }

  async generateSocialPosts(text: string, nuggets: ContentNugget[], niche?: string, tone?: string, targetAudience?: string): Promise<any[]> {
    const truncated = text.substring(0, 8000);
    const nuggetSummary = nuggets.map(n => `- ${n.title}: ${n.insight}`).join('\n');
    
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a social media expert. Generate 12 social media posts across different platforms.
${niche ? `Niche: ${niche}` : ''}
${tone ? `Tone: ${tone}` : 'Tone: professional yet engaging'}
${targetAudience ? `Target audience: ${targetAudience}` : ''}
Respond ONLY with valid JSON array.
Format: [{"platform": "twitter"|"linkedin"|"instagram"|"facebook", "content": "post text", "hashtags": ["tag1","tag2"], "characterCount": 280}]
Generate: 4 Twitter posts (under 280 chars each), 3 LinkedIn posts (200-700 chars), 3 Instagram posts (150-400 chars), 2 Facebook posts (200-500 chars).`
        },
        {
          role: 'user',
          content: `Content:\n${truncated}\n\nKey Nuggets:\n${nuggetSummary}`
        }
      ],
      temperature: 0.7,
      max_tokens: 3500
    });

    const content = response.choices[0]?.message?.content || '[]';
    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch {
      return [];
    }
  }

  async generateEmailNewsletter(text: string, nuggets: ContentNugget[], niche?: string, tone?: string, targetAudience?: string): Promise<any> {
    const truncated = text.substring(0, 8000);
    const nuggetSummary = nuggets.map(n => `- ${n.title}: ${n.insight}`).join('\n');
    
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an email marketing expert. Create a compelling email newsletter.
${niche ? `Niche: ${niche}` : ''}
${tone ? `Tone: ${tone}` : ''}
${targetAudience ? `Target audience: ${targetAudience}` : ''}
Respond ONLY with valid JSON.
Format: {"subject": "catchy subject line", "preheader": "preview text (50-100 chars)", "body": "full HTML-formatted newsletter body (800-1200 words, use <h2>, <p>, <ul>, <li>, <strong> tags)", "ctaText": "CTA button text", "ctaUrl": "#"}`
        },
        {
          role: 'user',
          content: `Content:\n${truncated}\n\nKey Nuggets:\n${nuggetSummary}`
        }
      ],
      temperature: 0.6,
      max_tokens: 2500
    });

    const content = response.choices[0]?.message?.content || '{}';
    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch {
      return { subject: 'Newsletter', preheader: '', body: content, ctaText: 'Read More', ctaUrl: '#' };
    }
  }

  async generateBlogToVideoScript(text: string, nuggets: ContentNugget[], niche?: string, tone?: string): Promise<any> {
    const truncated = text.substring(0, 8000);
    const nuggetSummary = nuggets.map(n => `- ${n.title}: ${n.insight}`).join('\n');
    
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a YouTube content creator and video script writer. Create a comprehensive blog-to-video script.
${niche ? `Niche: ${niche}` : ''}
${tone ? `Tone: ${tone}` : ''}
Respond ONLY with valid JSON.
Format: {
  "title": "video title",
  "intro": "60-second intro script",
  "sections": [{"heading": "section title", "script": "detailed narration (200-300 words)", "visualNotes": "what to show on screen"}],
  "outro": "60-second outro with CTA",
  "estimatedDuration": "X-Y minutes"
}
Include 4-6 sections covering all key points.`
        },
        {
          role: 'user',
          content: `Content:\n${truncated}\n\nKey Nuggets:\n${nuggetSummary}`
        }
      ],
      temperature: 0.6,
      max_tokens: 3000
    });

    const content = response.choices[0]?.message?.content || '{}';
    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch {
      return { title: 'Video Script', intro: content, sections: [], outro: '', estimatedDuration: '10-15 minutes' };
    }
  }

  async generateShortVideoClips(text: string, nuggets: ContentNugget[], niche?: string, tone?: string): Promise<any[]> {
    const truncated = text.substring(0, 8000);
    const nuggetSummary = nuggets.map(n => `- ${n.title}: ${n.insight}`).join('\n');
    
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a short-form video content creator (TikTok/Reels/Shorts). Create 6 short video clip scripts.
${niche ? `Niche: ${niche}` : ''}
${tone ? `Tone: ${tone}` : ''}
Respond ONLY with valid JSON array.
Format: [{"clipNumber": 1, "title": "clip title", "hook": "attention-grabbing first 3 seconds (1-2 sentences)", "mainContent": "main message (60-90 seconds worth, 100-150 words)", "callToAction": "end CTA", "estimatedDuration": "60-90 seconds"}]
Make each clip standalone and focused on one key idea.`
        },
        {
          role: 'user',
          content: `Content:\n${truncated}\n\nKey Nuggets:\n${nuggetSummary}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2500
    });

    const content = response.choices[0]?.message?.content || '[]';
    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch {
      return [];
    }
  }
}
