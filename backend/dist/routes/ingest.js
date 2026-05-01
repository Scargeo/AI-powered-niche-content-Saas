"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobs = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const contentExtractor_1 = require("../services/contentExtractor");
const aiAnalyzer_1 = require("../services/aiAnalyzer");
const contentTransformer_1 = require("../services/contentTransformer");
const router = (0, express_1.Router)();
const extractor = new contentExtractor_1.ContentExtractor();
const analyzer = new aiAnalyzer_1.AIAnalyzer();
const transformer = new contentTransformer_1.ContentTransformer();
// In-memory job store (for production use Redis/DB)
const jobs = new Map();
exports.jobs = jobs;
const upload = (0, multer_1.default)({
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (_req, file, cb) => {
        const allowed = ['.pdf', '.docx', '.txt', '.md'];
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        if (allowed.includes(ext)) {
            cb(null, true);
        }
        else {
            cb(new Error('Only PDF, DOCX, TXT, and MD files are supported'));
        }
    }
});
// Get job status
router.get('/jobs/:jobId', (req, res) => {
    const job = jobs.get(req.params.jobId);
    if (!job) {
        return res.status(404).json({ error: 'Job not found' });
    }
    return res.json(job);
});
// Process URL
router.post('/url', async (req, res) => {
    const { url, niche, tone, targetAudience } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }
    const jobId = (0, uuid_1.v4)();
    const job = {
        id: jobId,
        status: 'pending',
        sourceType: 'url',
        sourceInfo: url,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    jobs.set(jobId, job);
    // Process asynchronously
    processContent(job, { text: null, fromUrl: url }, { niche, tone, targetAudience }, jobs);
    return res.status(202).json({ jobId, status: 'pending' });
});
// Process file
router.post('/file', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'File is required' });
    }
    const { niche, tone, targetAudience } = req.body;
    const jobId = (0, uuid_1.v4)();
    const job = {
        id: jobId,
        status: 'pending',
        sourceType: 'file',
        sourceInfo: req.file.originalname,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    jobs.set(jobId, job);
    // Process asynchronously
    processContent(job, { text: null, fromFile: { path: req.file.path, mimeType: req.file.mimetype, originalName: req.file.originalname } }, { niche, tone, targetAudience }, jobs);
    return res.status(202).json({ jobId, status: 'pending' });
});
async function processContent(job, source, options, jobStore) {
    const updateJob = (updates) => {
        const current = jobStore.get(job.id);
        Object.assign(current, { ...updates, updatedAt: new Date() });
        jobStore.set(job.id, current);
    };
    try {
        // Step 1: Extract content
        updateJob({ status: 'extracting' });
        let text;
        if (source.fromUrl) {
            text = await extractor.extractFromUrl(source.fromUrl);
        }
        else if (source.fromFile) {
            text = await extractor.extractFromFile(source.fromFile.path, source.fromFile.mimeType, source.fromFile.originalName);
        }
        else {
            text = source.text;
        }
        updateJob({ extractedText: text.substring(0, 500) + '...' });
        // Step 2: Analyze and extract nuggets
        updateJob({ status: 'analyzing' });
        const nuggets = await analyzer.extractNuggets(text);
        updateJob({ nuggets });
        // Step 3: Transform into all formats
        updateJob({ status: 'transforming' });
        const outputs = await transformer.transform(text, nuggets, options);
        // Step 4: Complete
        updateJob({ status: 'completed', outputs });
    }
    catch (error) {
        updateJob({ status: 'failed', error: error.message });
    }
}
exports.default = router;
