import React, { useState } from 'react';
import ResultCard from './components/ResultCard';

interface CommitMessage {
  type: string;
  scope: string;
  description: string;
}

interface ApiResponse {
  commitMessage: CommitMessage;
}

const App: React.FC = () => {
  const [diff, setDiff] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateCommitMessage = async () => {
    if (!diff.trim()) {
      setError('Please enter a git diff');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        'https://commit-message-generator-nine.vercel.app/generate-commit',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: diff }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to generate commit message'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCommitMessage = (commit: CommitMessage): string => {
    return `${commit.type}${commit.scope ? `(${commit.scope})` : ''}: ${
      commit.description
    }`;
  };

  const exampleDiff = `diff --git a/src/utils/helper.js b/src/utils/helper.js
index 1234567..abcdefg 100644
--- a/src/utils/helper.js
+++ b/src/utils/helper.js
@@ -1,3 +1,8 @@
+export function validateEmail(email) {
+  const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
+  return regex.test(email);
+}
+
 export function formatDate(date) {
   return new Intl.DateTimeFormat('en-US').format(date);
 }`;

  return (
    <div className='min-h-screen bg-neutral-50/50'>
      {/* Header */}
      <header className='border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10'>
        <div className='max-w-6xl mx-auto px-4 py-4 flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center'>
              <svg
                className='w-4 h-4 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 10V3L4 14h7v7l9-11h-7z'
                />
              </svg>
            </div>
            <h1 className='text-xl font-semibold text-neutral-900'>CommitAI</h1>
          </div>
          <div className='flex items-center space-x-3'>
            <button className='text-sm text-neutral-600 hover:text-neutral-900 transition-colors'>
              About
            </button>
            <a
              href='https://conventionalcommits.org'
              target='_blank'
              rel='noopener noreferrer'
              className='text-sm text-neutral-600 hover:text-neutral-900 transition-colors flex items-center space-x-1'
            >
              <span>Conventional Commits</span>
              <svg
                className='w-3 h-3'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                />
              </svg>
            </a>
          </div>
        </div>
      </header>

      <main className='max-w-4xl mx-auto px-4 py-12'>
        {/* Hero Section */}
        <div className='text-center mb-12'>
          <div className='inline-flex items-center bg-violet-50 border border-violet-200 rounded-full px-4 py-2 text-sm text-violet-700 mb-6'>
            <svg
              className='w-4 h-4 mr-2'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z'
                clipRule='evenodd'
              />
            </svg>
            AI-Powered Git Workflow
          </div>
          <h2 className='text-4xl font-bold text-neutral-900 mb-4 tracking-tight'>
            Generate Perfect
            <span className='bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent'>
              {' '}
              Commit Messages
            </span>
          </h2>
          <p className='text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed'>
            Transform your git diffs into professional conventional commit
            messages instantly. Save time and maintain consistent commit history
            across your projects.
          </p>
        </div>

        {/* Main Card */}
        <div className='bg-white border border-neutral-200 rounded-xl shadow-sm'>
          <div className='p-6 border-b border-neutral-100'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-medium text-neutral-900'>
                Git Diff Input
              </h3>
              <button
                onClick={() => setDiff(exampleDiff)}
                className='text-sm text-violet-600 hover:text-violet-700 font-medium transition-colors'
              >
                Try Example
              </button>
            </div>
            <p className='text-sm text-neutral-500 mt-1'>
              Paste your git diff below to generate a conventional commit
              message
            </p>
          </div>

          <div className='p-6 space-y-6'>
            <div className='space-y-3'>
              <textarea
                value={diff}
                onChange={(e) => setDiff(e.target.value)}
                placeholder="diff --git a/src/components/Button.tsx b/src/components/Button.tsx
index 1234567..abcdefg 100644
--- a/src/components/Button.tsx
+++ b/src/components/Button.tsx
@@ -1,5 +1,10 @@
+import { forwardRef } from 'react';
+
 export interface ButtonProps {
   children: React.ReactNode;
+  variant?: 'primary' | 'secondary';
 }"
                rows={14}
                className='w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 resize-none font-mono text-sm leading-relaxed'
              />
            </div>

            <button
              onClick={generateCommitMessage}
              disabled={loading || !diff.trim()}
              className='w-full py-3 px-6 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 disabled:text-neutral-500 text-white font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2'
            >
              {loading ? (
                <>
                  <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                  <span>Generating commit message...</span>
                </>
              ) : (
                <>
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 10V3L4 14h7v7l9-11h-7z'
                    />
                  </svg>
                  <span>Generate Commit Message</span>
                </>
              )}
            </button>

            {error && (
              <div className='p-4 bg-red-50 border border-red-200 rounded-lg'>
                <div className='flex items-center space-x-2 text-red-800'>
                  <svg
                    className='w-5 h-5 text-red-500 flex-shrink-0'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <span className='text-sm font-medium'>{error}</span>
                </div>
              </div>
            )}

            {result && (
              <ResultCard
                commitMessage={formatCommitMessage(result.commitMessage)}
                structuredData={result.commitMessage}
              />
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white border border-neutral-200 rounded-lg p-6 text-center'>
            <div className='w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-6 h-6 text-violet-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <h3 className='font-medium text-neutral-900 mb-2'>
              Conventional Format
            </h3>
            <p className='text-sm text-neutral-600'>
              Follows conventional commit standards for consistent project
              history
            </p>
          </div>

          <div className='bg-white border border-neutral-200 rounded-lg p-6 text-center'>
            <div className='w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-6 h-6 text-emerald-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 10V3L4 14h7v7l9-11h-7z'
                />
              </svg>
            </div>
            <h3 className='font-medium text-neutral-900 mb-2'>AI-Powered</h3>
            <p className='text-sm text-neutral-600'>
              Intelligently analyzes your code changes to generate meaningful
              messages
            </p>
          </div>

          <div className='bg-white border border-neutral-200 rounded-lg p-6 text-center'>
            <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-6 h-6 text-blue-600'
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
            </div>
            <h3 className='font-medium text-neutral-900 mb-2'>
              One-Click Copy
            </h3>
            <p className='text-sm text-neutral-600'>
              Instantly copy generated messages to your clipboard for immediate
              use
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

