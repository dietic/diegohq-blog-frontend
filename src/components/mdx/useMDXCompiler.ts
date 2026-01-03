'use client';

import { useState, useEffect, useCallback } from 'react';
import { compile, run } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import type { ComponentType } from 'react';
import {
  Callout,
  Card,
  Button,
  Grid,
  Badge,
  Divider,
} from './MDXComponents';

// Default components available in MDX
const defaultComponents = {
  Callout,
  Card,
  Button,
  Grid,
  Badge,
  Divider,
};

interface UseMDXCompilerResult {
  Content: ComponentType | null;
  error: string | null;
  isCompiling: boolean;
}

export function useMDXCompiler(source: string, debounceMs = 300): UseMDXCompilerResult {
  const [Content, setContent] = useState<ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);

  const compileSource = useCallback(async (mdxSource: string) => {
    if (!mdxSource.trim()) {
      setContent(null);
      setError(null);
      setIsCompiling(false);
      return;
    }

    setIsCompiling(true);

    try {
      // Compile MDX to JavaScript
      const compiled = await compile(mdxSource, {
        outputFormat: 'function-body',
        development: false,
      });

      // Run the compiled code with the runtime
      const result = await run(String(compiled), {
        ...runtime,
        baseUrl: import.meta.url,
        useMDXComponents: () => defaultComponents,
      });

      setContent(() => result.default);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to compile MDX';
      // Clean up the error message
      const cleanError = message
        .replace(/^.*?Error:\s*/i, '')
        .split('\n')[0];
      setError(cleanError);
      setContent(null);
    } finally {
      setIsCompiling(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      compileSource(source);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [source, debounceMs, compileSource]);

  return { Content, error, isCompiling };
}
