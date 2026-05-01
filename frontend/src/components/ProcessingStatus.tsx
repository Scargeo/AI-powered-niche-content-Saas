import React from 'react';
import type { JobStatus } from '../types';
import { CheckCircle, Circle, Loader2, XCircle } from 'lucide-react';

interface ProcessingStatusProps {
  status: JobStatus;
  sourceInfo: string;
  error?: string;
}

const steps: { key: JobStatus; label: string; description: string }[] = [
  { key: 'extracting', label: 'Extracting Content', description: 'Pulling text from your source...' },
  { key: 'analyzing', label: 'AI Analysis', description: 'Identifying high-value insights...' },
  { key: 'transforming', label: 'Transforming', description: 'Generating all content formats simultaneously...' },
  { key: 'completed', label: 'Complete!', description: 'Your content is ready' }
];

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ status, sourceInfo, error }) => {
  const currentStepIndex = steps.findIndex(s => s.key === status);
  
  if (status === 'failed') {
    return (
      <div className="text-center py-12">
        <XCircle className="mx-auto mb-4 text-red-400" size={48} />
        <h3 className="text-xl font-semibold text-red-400 mb-2">Processing Failed</h3>
        <p className="text-gray-400">{error || 'An unexpected error occurred'}</p>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <div className="mb-6">
        <div className="inline-block relative">
          <div className="w-20 h-20 rounded-full bg-brand-900/50 border-2 border-brand-500 flex items-center justify-center">
            <Loader2 className="text-brand-400 animate-spin" size={36} />
          </div>
          <div className="absolute -inset-2 rounded-full bg-brand-500/10 animate-pulse" />
        </div>
      </div>
      
      <p className="text-gray-400 text-sm mb-8 truncate max-w-md mx-auto">
        Processing: <span className="text-gray-200">{sourceInfo}</span>
      </p>

      <div className="max-w-sm mx-auto space-y-3">
        {steps.map((step, index) => {
          const isDone = currentStepIndex > index || status === 'completed';
          const isCurrent = step.key === status || (status === 'pending' && index === 0);
          
          return (
            <div
              key={step.key}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                isCurrent ? 'bg-brand-900/30 border border-brand-700' : ''
              }`}
            >
              {isDone ? (
                <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
              ) : isCurrent ? (
                <Loader2 className="text-brand-400 animate-spin flex-shrink-0" size={20} />
              ) : (
                <Circle className="text-gray-600 flex-shrink-0" size={20} />
              )}
              <div className="text-left">
                <p className={`text-sm font-medium ${isDone ? 'text-green-400' : isCurrent ? 'text-brand-300' : 'text-gray-600'}`}>
                  {step.label}
                </p>
                {isCurrent && (
                  <p className="text-xs text-gray-500">{step.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
