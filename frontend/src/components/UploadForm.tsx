import React, { useState, useRef } from 'react';
import { Link2, Upload, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

interface UploadFormProps {
  onSubmitUrl: (url: string, options: { niche?: string; tone?: string; targetAudience?: string }) => Promise<void>;
  onSubmitFile: (file: File, options: { niche?: string; tone?: string; targetAudience?: string }) => Promise<void>;
  isLoading: boolean;
}

export const UploadForm: React.FC<UploadFormProps> = ({ onSubmitUrl, onSubmitFile, isLoading }) => {
  const [mode, setMode] = useState<'url' | 'file'>('url');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [niche, setNiche] = useState('');
  const [tone, setTone] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const opts = {
      niche: niche || undefined,
      tone: tone || undefined,
      targetAudience: targetAudience || undefined
    };
    if (mode === 'url') {
      await onSubmitUrl(url, opts);
    } else if (file) {
      await onSubmitFile(file, opts);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const toneOptions = ['Professional', 'Casual', 'Educational', 'Inspirational', 'Humorous', 'Authoritative'];

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      {/* Mode Toggle */}
      <div className="flex rounded-xl bg-gray-800/50 p-1 mb-6 border border-gray-700">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
            mode === 'url'
              ? 'bg-brand-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Link2 size={16} />
          Paste URL
        </button>
        <button
          type="button"
          onClick={() => setMode('file')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
            mode === 'file'
              ? 'bg-brand-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Upload size={16} />
          Upload File
        </button>
      </div>

      {/* Input Area */}
      {mode === 'url' ? (
        <div className="relative mb-4">
          <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com/your-article"
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-11 pr-4 py-3.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
          />
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`mb-4 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-brand-500 bg-brand-500/10'
              : file
              ? 'border-green-500 bg-green-500/10'
              : 'border-gray-700 bg-gray-800/30 hover:border-gray-500 hover:bg-gray-800/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,.md"
            className="hidden"
            onChange={e => setFile(e.target.files?.[0] || null)}
          />
          <Upload className={`mx-auto mb-3 ${file ? 'text-green-400' : 'text-gray-400'}`} size={32} />
          {file ? (
            <div>
              <p className="text-green-400 font-medium">{file.name}</p>
              <p className="text-gray-500 text-sm mt-1">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-300 font-medium">Drop your file here or click to browse</p>
              <p className="text-gray-500 text-sm mt-1">PDF, DOCX, TXT, MD — up to 10MB</p>
            </div>
          )}
        </div>
      )}

      {/* Options Toggle */}
      <button
        type="button"
        onClick={() => setShowOptions(!showOptions)}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 mb-4 transition-colors"
      >
        {showOptions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        Advanced Options
      </button>

      {showOptions && (
        <div className="grid grid-cols-1 gap-3 mb-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
          <input
            type="text"
            placeholder="Niche (e.g. SaaS, Fitness, Finance)"
            value={niche}
            onChange={e => setNiche(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <select
            value={tone}
            onChange={e => setTone(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none"
          >
            <option value="">Select tone...</option>
            {toneOptions.map(t => <option key={t} value={t.toLowerCase()}>{t}</option>)}
          </select>
          <input
            type="text"
            placeholder="Target audience (e.g. startup founders, marketers)"
            value={targetAudience}
            onChange={e => setTargetAudience(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading || (mode === 'url' && !url) || (mode === 'file' && !file)}
        className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-900/30"
      >
        {isLoading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <span>✨</span>
            Repurpose Content
          </>
        )}
      </button>
    </form>
  );
};
