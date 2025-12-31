import matter from 'gray-matter';

export interface ParsedMdx<T> {
  frontmatter: T;
  content: string;
}

export const parseMdx = <T>(fileContent: string): ParsedMdx<T> => {
  const { data, content } = matter(fileContent);

  return {
    frontmatter: data as T,
    content: content.trim(),
  };
};

export const serializeMdx = <T extends Record<string, unknown>>(
  frontmatter: T,
  content: string
): string => {
  return matter.stringify(content, frontmatter);
};
