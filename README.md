# ✨ AI-Powered Niche Content Repurposer

A micro SaaS that takes **one piece of cornerstone content** and automatically transforms it into dozens of platform-specific assets using GPT-4o.

---

## 🚀 What It Does

1. **Ingest** — Paste a URL or upload a file (PDF, DOCX, TXT, MD)
2. **Extract** — AI scrapes/parses the content and pulls the full text
3. **Analyze** — GPT-4o identifies 5–8 high-value key insights (nuggets)
4. **Transform** — Simultaneously generates:
   - 📱 **12 social media posts** (Twitter/X, LinkedIn, Instagram, Facebook)
   - 📧 **Email newsletter** (subject, preheader, full HTML body, CTA)
   - 🎬 **Blog-to-video script** (intro, 4–6 sections with visual notes, outro)
   - 🎞️ **6 short video clip scripts** (hook, main content, CTA — TikTok/Reels/Shorts ready)

---

## 🗂️ Project Structure

```
.
├── backend/                  # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── server.ts         # Express server entry point
│   │   ├── types/index.ts    # Shared TypeScript types
│   │   ├── services/
│   │   │   ├── contentExtractor.ts   # URL scraping + file parsing
│   │   │   ├── aiAnalyzer.ts         # OpenAI GPT-4o integration
│   │   │   └── contentTransformer.ts # Parallel transformation
│   │   └── routes/ingest.ts  # REST API routes
│   ├── .env.example
│   └── package.json
│
├── frontend/                 # React + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── App.tsx            # Root component + routing
│   │   ├── components/
│   │   │   ├── UploadForm.tsx       # URL/file input with drag-and-drop
│   │   │   ├── ProcessingStatus.tsx # Animated progress steps
│   │   │   ├── ResultsView.tsx      # 5-tab results display
│   │   │   └── CopyButton.tsx       # One-click copy
│   │   ├── services/api.ts    # Axios API client
│   │   └── types/index.ts     # Shared TypeScript types
│   ├── .env.example
│   └── package.json
│
└── package.json              # Root scripts (dev, build, install:all)
```

---

## ⚙️ Setup & Running Locally

### Prerequisites
- Node.js 18+
- OpenAI API key

### 1. Clone & Install

```bash
git clone https://github.com/Scargeo/AI-powered-niche-content-Saas.git
cd AI-powered-niche-content-Saas
npm run install:all
```

### 2. Configure Environment Variables

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env and set your OPENAI_API_KEY
```

```env
OPENAI_API_KEY=sk-...your-key-here...
PORT=3001
FRONTEND_URL=http://localhost:5173
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:3001/api
```

### 3. Run Development Servers

From the root directory:
```bash
npm run dev
```

Or individually:
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/url` | Submit a URL for processing |
| `POST` | `/api/file` | Upload a file for processing |
| `GET`  | `/api/jobs/:jobId` | Poll job status and get results |
| `GET`  | `/health` | Health check |

### Submit URL
```json
POST /api/url
{
  "url": "https://example.com/article",
  "niche": "SaaS",
  "tone": "professional",
  "targetAudience": "startup founders"
}
```

### Submit File
```
POST /api/file (multipart/form-data)
  file: <PDF/DOCX/TXT/MD — max 10MB>
  niche: (optional)
  tone: (optional)
  targetAudience: (optional)
```

### Job Status Response
```json
{
  "id": "uuid",
  "status": "completed",
  "sourceType": "url",
  "sourceInfo": "https://...",
  "nuggets": [...],
  "outputs": {
    "socialPosts": [...],
    "emailNewsletter": {...},
    "blogToVideoScript": {...},
    "shortVideoClips": [...]
  }
}
```

Job statuses: `pending` → `extracting` → `analyzing` → `transforming` → `completed` | `failed`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| State management | TanStack Query (React Query) |
| Backend | Node.js, Express, TypeScript |
| AI | OpenAI GPT-4o |
| URL scraping | Axios + Cheerio |
| File parsing | pdf-parse (PDF), mammoth (DOCX) |

---

## 📝 Notes

- Jobs are stored **in-memory** on the backend. For production, replace with Redis or a database.
- The `/tmp/uploads/` directory is used for temporary file storage during processing.
- All AI transformations run **in parallel** for maximum speed.

