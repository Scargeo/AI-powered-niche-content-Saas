import React, { useState } from 'react';
import type { ContentJob } from '../types';
import { CopyButton } from './CopyButton';
import { MessageSquare, Briefcase, Camera, Globe, Mail, Video, Film, Lightbulb, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

interface ResultsViewProps {
  job: ContentJob;
  onReset: () => void;
}

type Tab = 'nuggets' | 'social' | 'email' | 'blogvideo' | 'clips';

const platformIcons: Record<string, React.ReactNode> = {
  twitter: <MessageSquare size={14} />,
  linkedin: <Briefcase size={14} />,
  instagram: <Camera size={14} />,
  facebook: <Globe size={14} />
};

const platformColors: Record<string, string> = {
  twitter: 'bg-sky-500/10 text-sky-400 border-sky-800',
  linkedin: 'bg-blue-600/10 text-blue-400 border-blue-800',
  instagram: 'bg-pink-500/10 text-pink-400 border-pink-800',
  facebook: 'bg-blue-500/10 text-blue-300 border-blue-700'
};

const importanceColors = {
  high: 'bg-red-500/10 text-red-400 border-red-800',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-800',
  low: 'bg-green-500/10 text-green-400 border-green-800'
};

export const ResultsView: React.FC<ResultsViewProps> = ({ job, onReset }) => {
  const [activeTab, setActiveTab] = useState<Tab>('nuggets');
  const [expandedClip, setExpandedClip] = useState<number | null>(null);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const outputs = job.outputs!;

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: 'nuggets', label: 'Key Insights', icon: <Lightbulb size={16} />, count: job.nuggets?.length },
    { key: 'social', label: 'Social Posts', icon: <MessageSquare size={16} />, count: outputs.socialPosts?.length },
    { key: 'email', label: 'Email Newsletter', icon: <Mail size={16} /> },
    { key: 'blogvideo', label: 'Video Script', icon: <Video size={16} /> },
    { key: 'clips', label: 'Short Clips', icon: <Film size={16} />, count: outputs.shortVideoClips?.length }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">✨ Content Generated!</h2>
          <p className="text-gray-400 text-sm mt-1 truncate max-w-md">From: {job.sourceInfo}</p>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-sm text-gray-300 hover:text-white transition-all"
        >
          <RotateCcw size={14} />
          New Content
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-brand-400">{outputs.socialPosts?.length || 0}</div>
          <div className="text-xs text-gray-400">Social Posts</div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-purple-400">{outputs.shortVideoClips?.length || 0}</div>
          <div className="text-xs text-gray-400">Video Clips</div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-green-400">1</div>
          <div className="text-xs text-gray-400">Email</div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-yellow-400">1</div>
          <div className="text-xs text-gray-400">Video Script</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-800/50 p-1 rounded-xl mb-6 border border-gray-700 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              activeTab === tab.key
                ? 'bg-brand-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-white/20' : 'bg-gray-700'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">

        {/* NUGGETS */}
        {activeTab === 'nuggets' && (
          <div className="space-y-3">
            {job.nuggets?.map((nugget, i) => (
              <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-white">{nugget.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${importanceColors[nugget.importance]}`}>
                    {nugget.importance}
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{nugget.insight}</p>
              </div>
            ))}
          </div>
        )}

        {/* SOCIAL POSTS */}
        {activeTab === 'social' && (
          <div className="space-y-3">
            {['twitter', 'linkedin', 'instagram', 'facebook'].map(platform => {
              const posts = outputs.socialPosts?.filter(p => p.platform === platform) || [];
              if (!posts.length) return null;
              return (
                <div key={platform}>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className={`p-1 rounded ${platformColors[platform]}`}>{platformIcons[platform]}</span>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)} ({posts.length})
                  </h3>
                  <div className="space-y-2">
                    {posts.map((post, i) => (
                      <div key={i} className={`border rounded-xl p-4 ${platformColors[platform]}`}>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <p className="text-sm text-gray-200 leading-relaxed flex-1">{post.content}</p>
                          <CopyButton text={`${post.content}\n\n${post.hashtags.map(h => `#${h}`).join(' ')}`} />
                        </div>
                        {post.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {post.hashtags.slice(0, 6).map((tag, j) => (
                              <span key={j} className="text-xs opacity-70">#{tag}</span>
                            ))}
                          </div>
                        )}
                        <div className="text-xs opacity-50 mt-2">{post.characterCount || post.content?.length} chars</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* EMAIL NEWSLETTER */}
        {activeTab === 'email' && outputs.emailNewsletter && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-700 bg-gray-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white flex items-center gap-2"><Mail size={16} className="text-green-400" /> Email Newsletter</h3>
                <CopyButton text={`Subject: ${outputs.emailNewsletter.subject}\n\n${outputs.emailNewsletter.body}`} />
              </div>
              <div className="space-y-1.5">
                <div className="bg-gray-900 rounded-lg px-3 py-2">
                  <span className="text-xs text-gray-500">Subject: </span>
                  <span className="text-sm text-white font-medium">{outputs.emailNewsletter.subject}</span>
                </div>
                <div className="bg-gray-900 rounded-lg px-3 py-2">
                  <span className="text-xs text-gray-500">Preview: </span>
                  <span className="text-sm text-gray-300">{outputs.emailNewsletter.preheader}</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div
                className="prose prose-invert prose-sm max-w-none text-gray-300 [&_h2]:text-white [&_h2]:text-base [&_h2]:font-semibold [&_ul]:space-y-1 [&_li]:text-gray-300"
                dangerouslySetInnerHTML={{ __html: outputs.emailNewsletter.body }}
              />
              {outputs.emailNewsletter.ctaText && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <span className="inline-block px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-medium">
                    {outputs.emailNewsletter.ctaText}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BLOG TO VIDEO SCRIPT */}
        {activeTab === 'blogvideo' && outputs.blogToVideoScript && (
          <div className="space-y-3">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-bold text-white">{outputs.blogToVideoScript.title}</h2>
                <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
                  ⏱ {outputs.blogToVideoScript.estimatedDuration}
                </span>
              </div>
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-2">🎬 Intro</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{outputs.blogToVideoScript.intro}</p>
              <CopyButton text={outputs.blogToVideoScript.intro} className="mt-3" />
            </div>

            {outputs.blogToVideoScript.sections?.map((section, i) => (
              <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-700/30 transition-colors"
                >
                  <h3 className="font-semibold text-brand-300">Section {i + 1}: {section.heading}</h3>
                  {expandedSection === i ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </button>
                {expandedSection === i && (
                  <div className="px-4 pb-4 space-y-3 border-t border-gray-700">
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Script</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{section.script}</p>
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-lg p-3">
                      <p className="text-xs text-yellow-400 uppercase tracking-wider mb-1">📹 Visual Notes</p>
                      <p className="text-yellow-200/80 text-sm">{section.visualNotes}</p>
                    </div>
                    <CopyButton text={section.script} />
                  </div>
                )}
              </div>
            ))}

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">🎯 Outro & CTA</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{outputs.blogToVideoScript.outro}</p>
              <CopyButton text={outputs.blogToVideoScript.outro} className="mt-3" />
            </div>
          </div>
        )}

        {/* SHORT VIDEO CLIPS */}
        {activeTab === 'clips' && (
          <div className="space-y-3">
            {outputs.shortVideoClips?.map((clip, i) => (
              <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedClip(expandedClip === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-700/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-700 flex items-center justify-center text-purple-400 text-sm font-bold flex-shrink-0">
                      {clip.clipNumber}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{clip.title}</p>
                      <p className="text-xs text-gray-400">⏱ {clip.estimatedDuration}</p>
                    </div>
                  </div>
                  {expandedClip === i ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </button>
                {expandedClip === i && (
                  <div className="px-4 pb-4 space-y-3 border-t border-gray-700">
                    <div className="mt-3 bg-red-900/20 border border-red-800/50 rounded-lg p-3">
                      <p className="text-xs text-red-400 uppercase tracking-wider mb-1">🔥 Hook (first 3 seconds)</p>
                      <p className="text-red-200/90 text-sm font-medium">{clip.hook}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Main Content</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{clip.mainContent}</p>
                    </div>
                    <div className="bg-brand-900/20 border border-brand-800/50 rounded-lg p-3">
                      <p className="text-xs text-brand-400 uppercase tracking-wider mb-1">📣 Call to Action</p>
                      <p className="text-brand-200/90 text-sm">{clip.callToAction}</p>
                    </div>
                    <CopyButton text={`${clip.hook}\n\n${clip.mainContent}\n\n${clip.callToAction}`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
