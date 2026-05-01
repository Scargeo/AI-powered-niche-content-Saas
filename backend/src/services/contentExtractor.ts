import axios from 'axios';
import * as cheerio from 'cheerio';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

export class ContentExtractor {
  async extractFromUrl(url: string): Promise<string> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ContentRepurposer/1.0)'
        },
        timeout: 15000,
        maxContentLength: 5 * 1024 * 1024 // 5MB
      });

      const $ = cheerio.load(response.data);
      
      // Remove script, style, nav, footer elements
      $('script, style, nav, footer, header, aside, .sidebar, #sidebar, .ad, .advertisement').remove();
      
      // Try to get main content
      let text = '';
      const mainSelectors = ['article', 'main', '.content', '.post-content', '.entry-content', '#content'];
      
      for (const selector of mainSelectors) {
        const element = $(selector);
        if (element.length > 0) {
          text = element.text();
          break;
        }
      }
      
      if (!text || text.trim().length < 200) {
        text = $('body').text();
      }
      
      // Clean up whitespace
      text = text.replace(/\s+/g, ' ').trim();
      
      if (text.length < 100) {
        throw new Error('Could not extract sufficient content from the URL');
      }
      
      // Limit to ~50,000 characters to avoid token limits
      return text.substring(0, 50000);
    } catch (error: any) {
      if (error.message?.includes('Could not extract')) throw error;
      throw new Error(`Failed to fetch URL: ${error.message}`);
    }
  }

  async extractFromFile(filePath: string, mimeType: string, originalName: string): Promise<string> {
    const fs = await import('fs');
    const fileBuffer = fs.readFileSync(filePath);
    
    if (mimeType === 'application/pdf' || originalName.endsWith('.pdf')) {
      const data = await pdf(fileBuffer);
      return data.text.substring(0, 50000);
    }
    
    if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      originalName.endsWith('.docx')
    ) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      return result.value.substring(0, 50000);
    }
    
    // Plain text, markdown, etc.
    const text = fileBuffer.toString('utf-8');
    return text.substring(0, 50000);
  }
}
