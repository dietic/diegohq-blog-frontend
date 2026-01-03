'use client';

import { useState, useCallback } from 'react';
import { useMDXCompiler } from './useMDXCompiler';
import { MDXErrorBoundary } from './MDXErrorBoundary';
import './mdx.scss';

interface MDXPreviewClientProps {
  content: string;
  title?: string;
}

export function MDXPreviewClient({ content, title }: MDXPreviewClientProps) {
  const { Content, error, isCompiling } = useMDXCompiler(content);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);

  // Clear runtime error when content changes
  const handleError = useCallback((err: string) => {
    setRuntimeError(err);
  }, []);

  // Display either compile error or runtime error
  const displayError = error || runtimeError;

  return (
    <div className="mdx-preview">
      <div className="mdx-preview__header">
        <span className="mdx-preview__label">
          {isCompiling ? 'Compiling...' : 'Preview'}
        </span>
        {title && <span className="mdx-preview__title">{title}</span>}
      </div>
      <div className="mdx-preview__content">
        {displayError ? (
          <div className="mdx-preview__error">
            <p style={{ color: '#f87171', marginBottom: '0.5rem' }}>
              {error ? 'MDX Error:' : 'Runtime Error:'}
            </p>
            <pre
              style={{
                fontSize: '0.75rem',
                color: '#a1a1aa',
                whiteSpace: 'pre-wrap',
              }}
            >
              {displayError}
            </pre>
          </div>
        ) : Content ? (
          <MDXErrorBoundary key={content} onError={handleError}>
            <div className="mdx-preview__body">
              <Content />
            </div>
          </MDXErrorBoundary>
        ) : (
          <p className="mdx-preview__empty">Start typing to see preview...</p>
        )}
      </div>
    </div>
  );
}
