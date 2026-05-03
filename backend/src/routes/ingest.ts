import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ContentExtractor } from '../services/contentExtractor';
import { AIAnalyzer } from '../services/aiAnalyzer';
import { ContentTransformer } from '../services/contentTransformer';
import { ContentJob } from '../types';

const router = Router();
const extractor = new ContentExtractor();
const analyzer = new AIAnalyzer();
const transformer = new ContentTransformer();

// In-memory job store (for production use Redis/DB)
const jobs = new Map<string, ContentJob>();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4.5 * 1024 * 1024 }, // 4.5 MB (Vercel request body limit)
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.docx', '.txt', '.md'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOCX, TXT, and MD files are supported'));
    }
  }
});

// Get job status
router.get('/jobs/:jobId', (req: Request, res: Response) => {
  const job = jobs.get(req.params.jobId);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  return res.json(job);
});

// Process URL
router.post('/url', async (req: Request, res: Response) => {
  const { url, niche, tone, targetAudience } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const jobId = uuidv4();
  const job: ContentJob = {
    id: jobId,
    status: 'pending',
    sourceType: 'url',
    sourceInfo: url,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  jobs.set(jobId, job);

  // Process asynchronously
  await processContent(job, { text: null, fromUrl: url }, { niche, tone, targetAudience }, jobs);

  return res.json(jobs.get(jobId));
});

// Process file
router.post('/file', upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'File is required' });
  }

  const { niche, tone, targetAudience } = req.body;
  const jobId = uuidv4();
  const job: ContentJob = {
    id: jobId,
    status: 'pending',
    sourceType: 'file',
    sourceInfo: req.file.originalname,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  jobs.set(jobId, job);

  // Process synchronously so the response contains the completed job
  await processContent(
    job,
    { text: null, fromFile: { buffer: req.file.buffer, mimeType: req.file.mimetype, originalName: req.file.originalname } },
    { niche, tone, targetAudience },
    jobs
  );

  return res.json(jobs.get(jobId));
});

async function processContent(
  job: ContentJob,
  source: { text: string | null; fromUrl?: string; fromFile?: { buffer: Buffer; mimeType: string; originalName: string } },
  options: { niche?: string; tone?: string; targetAudience?: string },
  jobStore: Map<string, ContentJob>
): Promise<void> {
  const updateJob = (updates: Partial<ContentJob>) => {
    const current = jobStore.get(job.id)!;
    Object.assign(current, { ...updates, updatedAt: new Date() });
    jobStore.set(job.id, current);
  };

  try {
    // Step 1: Extract content
    updateJob({ status: 'extracting' });
    let text: string;
    
    if (source.fromUrl) {
      text = await extractor.extractFromUrl(source.fromUrl);
    } else if (source.fromFile) {
      text = await extractor.extractFromFile(source.fromFile.buffer, source.fromFile.mimeType, source.fromFile.originalName);
    } else {
      text = source.text!;
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
  } catch (error: any) {
    updateJob({ status: 'failed', error: error.message });
  }
}

export { jobs };
export default router;
