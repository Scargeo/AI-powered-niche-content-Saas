import { useState, useCallback } from 'react';
import { UploadForm } from './components/UploadForm';
import { ProcessingStatus } from './components/ProcessingStatus';
import { ResultsView } from './components/ResultsView';
import { api } from './services/api';
import type { ContentJob } from './types';
import { Sparkles, Zap, Share2, Mail, Video, Film } from 'lucide-react';

function ContentRepurposer() {
  const [job, setJob] = useState<ContentJob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmitUrl = useCallback(async (url: string, opts: { niche?: string; tone?: string; targetAudience?: string }) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const completedJob = await api.submitUrl(url, opts);
      setJob(completedJob);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } }; message?: string };
      setSubmitError(error.response?.data?.error || error.message || 'Failed to submit URL');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleSubmitFile = useCallback(async (file: File, opts: { niche?: string; tone?: string; targetAudience?: string }) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const completedJob = await api.submitFile(file, opts);
      setJob(completedJob);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } }; message?: string };
      setSubmitError(error.response?.data?.error || error.message || 'Failed to submit file');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setJob(null);
    setSubmitError(null);
  }, []);

  const showResults = job?.status === 'completed' && job.outputs;
  const showProcessing = isSubmitting;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Gradient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl sticky top-0 z-20">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <span className="font-bold text-lg text-white">ContentRepurposer</span>
              <span className="text-xs bg-brand-900/50 text-brand-300 px-2 py-0.5 rounded-full border border-brand-800">AI</span>
            </div>
            <nav className="hidden sm:flex items-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-1.5"><Zap size={14} /> Fast</span>
              <span className="flex items-center gap-1.5"><Share2 size={14} /> Multi-format</span>
              <span className="flex items-center gap-1.5"><Sparkles size={14} /> GPT-4o</span>
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-12">
          {!showResults && !showProcessing && (
            <>
              {/* Hero */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-900/40 border border-brand-800 rounded-full text-brand-300 text-sm mb-6">
                  <Sparkles size={14} />
                  AI-Powered Content Repurposer
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
                  One piece of content.<br />
                  <span className="text-brand-400">Dozens of assets.</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Paste a URL or upload a file. Our AI extracts the key insights and transforms
                  them into social posts, email newsletters, video scripts, and more — all at once.
                </p>
              </div>

              {/* Feature pills */}
              <div className="flex flex-wrap justify-center gap-2 mb-10">
                {[
                  { icon: <Share2 size={14} />, label: '12 Social Posts' },
                  { icon: <Mail size={14} />, label: 'Email Newsletter' },
                  { icon: <Video size={14} />, label: 'Video Script' },
                  { icon: <Film size={14} />, label: '6 Short Clips' },
                  { icon: <Sparkles size={14} />, label: 'Key Insights' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-full text-sm text-gray-300">
                    {item.icon}
                    {item.label}
                  </div>
                ))}
              </div>

              {(submitError || job?.status === 'failed') && (
                <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-900/20 border border-red-800 rounded-xl text-red-300 text-sm">
                  ⚠️ {submitError || job?.error || 'Processing failed'}
                  {job?.status === 'failed' && (
                    <button
                      onClick={handleReset}
                      className="ml-3 underline text-red-200 hover:text-white"
                    >
                      Try again
                    </button>
                  )}
                </div>
              )}

              <UploadForm
                onSubmitUrl={handleSubmitUrl}
                onSubmitFile={handleSubmitFile}
                isLoading={isSubmitting}
              />
            </>
          )}

          {showProcessing && (
            <ProcessingStatus
              status="extracting"
              sourceInfo="Processing your content…"
              error={undefined}
            />
          )}

          {showResults && (
            <ResultsView job={job!} onReset={handleReset} />
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return <ContentRepurposer />;
}
