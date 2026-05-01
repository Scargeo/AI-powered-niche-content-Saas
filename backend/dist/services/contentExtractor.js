"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentExtractor = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const mammoth_1 = __importDefault(require("mammoth"));
class ContentExtractor {
    async extractFromUrl(url) {
        try {
            const response = await axios_1.default.get(url, {
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
        }
        catch (error) {
            if (error.message?.includes('Could not extract'))
                throw error;
            throw new Error(`Failed to fetch URL: ${error.message}`);
        }
    }
    async extractFromFile(filePath, mimeType, originalName) {
        const fs = await Promise.resolve().then(() => __importStar(require('fs')));
        const fileBuffer = fs.readFileSync(filePath);
        if (mimeType === 'application/pdf' || originalName.endsWith('.pdf')) {
            const data = await (0, pdf_parse_1.default)(fileBuffer);
            return data.text.substring(0, 50000);
        }
        if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            originalName.endsWith('.docx')) {
            const result = await mammoth_1.default.extractRawText({ buffer: fileBuffer });
            return result.value.substring(0, 50000);
        }
        // Plain text, markdown, etc.
        const text = fileBuffer.toString('utf-8');
        return text.substring(0, 50000);
    }
}
exports.ContentExtractor = ContentExtractor;
