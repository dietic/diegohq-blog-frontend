import type { ReactNode, ComponentType } from 'react';
import './mdx.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MDXComponents = Record<string, ComponentType<any>>;

// ============================================
// Custom MDX Components
// ============================================

interface CalloutProps {
  type?: 'info' | 'warning' | 'success' | 'error';
  title?: string;
  children: ReactNode;
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  return (
    <div className={`mdx-callout mdx-callout--${type}`}>
      {title && <div className="mdx-callout__title">{title}</div>}
      <div className="mdx-callout__content">{children}</div>
    </div>
  );
}

interface CardProps {
  title?: string;
  children: ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    <div className="mdx-card">
      {title && <div className="mdx-card__title">{title}</div>}
      <div className="mdx-card__content">{children}</div>
    </div>
  );
}

interface ButtonProps {
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  children: ReactNode;
}

export function Button({ href, variant = 'primary', children }: ButtonProps) {
  const className = `mdx-button mdx-button--${variant}`;

  if (href) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return <span className={className}>{children}</span>;
}

interface GridProps {
  cols?: 2 | 3 | 4;
  children: ReactNode;
}

export function Grid({ cols = 2, children }: GridProps) {
  return (
    <div className={`mdx-grid mdx-grid--${cols}`}>
      {children}
    </div>
  );
}

interface BadgeProps {
  color?: 'teal' | 'purple' | 'yellow' | 'red' | 'gray';
  children: ReactNode;
}

export function Badge({ color = 'teal', children }: BadgeProps) {
  return <span className={`mdx-badge mdx-badge--${color}`}>{children}</span>;
}

interface DividerProps {
  label?: string;
}

export function Divider({ label }: DividerProps) {
  return (
    <div className="mdx-divider">
      {label && <span className="mdx-divider__label">{label}</span>}
    </div>
  );
}

// ============================================
// Base HTML Element Overrides
// ============================================

export function useMDXComponents(): MDXComponents {
  return {
    // Custom components
    Callout,
    Card,
    Button,
    Grid,
    Badge,
    Divider,

    // HTML element overrides with proper styling
    h1: ({ children }) => <h1 className="mdx-h1">{children}</h1>,
    h2: ({ children }) => <h2 className="mdx-h2">{children}</h2>,
    h3: ({ children }) => <h3 className="mdx-h3">{children}</h3>,
    p: ({ children }) => <p className="mdx-p">{children}</p>,
    a: ({ href, children }) => (
      <a href={href} className="mdx-a" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
    ul: ({ children }) => <ul className="mdx-ul">{children}</ul>,
    ol: ({ children }) => <ol className="mdx-ol">{children}</ol>,
    li: ({ children }) => <li className="mdx-li">{children}</li>,
    blockquote: ({ children }) => <blockquote className="mdx-blockquote">{children}</blockquote>,
    code: ({ children }) => <code className="mdx-code">{children}</code>,
    pre: ({ children }) => <pre className="mdx-pre">{children}</pre>,
    strong: ({ children }) => <strong className="mdx-strong">{children}</strong>,
    em: ({ children }) => <em className="mdx-em">{children}</em>,
    hr: () => <hr className="mdx-hr" />,
    img: ({ src, alt }) => (
      <img src={src} alt={alt || ''} className="mdx-img" />
    ),
  };
}

// Export components map for MDXRemote
export const mdxComponents = useMDXComponents();
