import React, { useState } from 'react';

interface CommitMessage {
  type: string;
  scope: string;
  description: string;
}

interface ResultCardProps {
  commitMessage: string;
  structuredData: CommitMessage;
}

const ResultCard: React.FC<ResultCardProps> = ({
  commitMessage,
  structuredData,
}) => {
  const [showStructured, setShowStructured] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className='space-y-4 animate-fade-in'>
      <div className='bg-green-500/90 border border-green-500/30 rounded-xl p-6 transition-all duration-300'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold text-green-300 flex items-center space-x-2'>
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
            <span className='text-white'>Generated Commit Message</span>
          </h3>
          <button
            onClick={() => setShowStructured(!showStructured)}
            className='text-sm text-slate-300 hover:text-white transition-colors duration-200 flex items-center space-x-1'
          >
            <span>{showStructured ? 'Hide' : 'Show'} JSON</span>
            <svg
              className={`w-4 h-4 transform transition-transform duration-200 ${
                showStructured ? 'rotate-180' : ''
              }`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </button>
        </div>

        <div className='space-y-4'>
          <div className='relative'>
            <div className='bg-black/30 backdrop-blur-sm rounded-lg p-4 font-mono text-white border border-white/10'>
              <code className='text-sm break-all'>{commitMessage}</code>
            </div>
            <button
              onClick={() => copyToClipboard(commitMessage)}
              className='absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 group'
              title='Copy to clipboard'
            >
              {copied ? (
                <svg
                  className='w-4 h-4 text-green-400'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
              ) : (
                <svg
                  className='w-4 h-4 text-slate-300 group-hover:text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                  />
                </svg>
              )}
            </button>
          </div>

          {showStructured && (
            <div className='relative overflow-hidden'>
              <div className='bg-black/30 backdrop-blur-sm rounded-lg p-4 font-mono text-sm border border-white/10 transition-all duration-300'>
                <pre className='text-slate-200 whitespace-pre-wrap break-all'>
                  {JSON.stringify({ commitMessage: structuredData }, null, 2)}
                </pre>
              </div>
              <button
                onClick={() =>
                  copyToClipboard(
                    JSON.stringify({ commitMessage: structuredData }, null, 2)
                  )
                }
                className='absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 group'
                title='Copy JSON to clipboard'
              >
                <svg
                  className='w-4 h-4 text-slate-300 group-hover:text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className='mt-4 flex flex-wrap gap-2'>
          <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30'>
            {structuredData.type}
          </span>
          {structuredData.scope && (
            <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30'>
              {structuredData.scope}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
