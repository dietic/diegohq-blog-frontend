'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onError?: (error: string) => void;
}

interface State {
  hasError: boolean;
  error: string | null;
}

export class MDXErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error: error.message || 'An error occurred while rendering',
    };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error.message);
  }

  componentDidUpdate(prevProps: Props) {
    // Reset error state when children change (user is editing)
    if (prevProps.children !== this.props.children && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mdx-preview__error">
          <p style={{ color: '#f87171', marginBottom: '0.5rem' }}>
            Runtime Error:
          </p>
          <pre
            style={{
              fontSize: '0.75rem',
              color: '#a1a1aa',
              whiteSpace: 'pre-wrap',
            }}
          >
            {this.state.error}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
