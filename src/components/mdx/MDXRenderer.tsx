import { compileMDX } from 'next-mdx-remote/rsc';
import { mdxComponents } from './MDXComponents';
import './mdx.scss';

interface MDXRendererProps {
  source: string;
}

export async function MDXRenderer({ source }: MDXRendererProps) {
  if (!source.trim()) {
    return (
      <p className="mdx-p" style={{ color: '#71717a', fontStyle: 'italic' }}>
        No content to display.
      </p>
    );
  }

  try {
    const { content } = await compileMDX({
      source,
      components: mdxComponents,
      options: {
        parseFrontmatter: false,
      },
    });

    return <div className="mdx-content">{content}</div>;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to render content';
    return (
      <div className="mdx-error">
        <p style={{ color: '#f87171' }}>Error rendering MDX:</p>
        <pre style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>{message}</pre>
      </div>
    );
  }
}
