import React, { useMemo } from 'react';
import { marked } from 'marked';
import katex from 'katex';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const renderedHtml = useMemo(() => {
    if (!content) return '';

    const mathPlaceholders: { id: string; html: string }[] = [];

    // 1. Extract Display Math: $$...$$ or \[...\]
    let processed = content.replace(/(?:\$\$([\s\S]*?)\$\$|\\\[([\s\S]*?)\\\])/g, (_, m1, m2) => {
      const math = (m1 || m2 || '').trim();
      const id = `KATEXDISP${mathPlaceholders.length}Z`;
      try {
        const html = katex.renderToString(math, { displayMode: true, throwOnError: false });
        mathPlaceholders.push({
          id,
          html: `<div class="my-2.5 overflow-x-auto py-1 text-center">${html}</div>`
        });
      } catch (e) {
        mathPlaceholders.push({
          id,
          html: `<div class="font-mono text-emerald-400 p-2">${math}</div>`
        });
      }
      return id;
    });

    // 2. Extract Inline Math: $...$ or \(...\)
    // Matches $non-space...non-space$ to avoid matching solitary dollar signs ($100)
    processed = processed.replace(/(?:\$([^\$\n\r]+?)\$|\\\(([\s\S]*?)\\\))/g, (_, m1, m2) => {
      const math = (m1 || m2 || '').trim();
      const id = `KATEXINL${mathPlaceholders.length}Z`;
      try {
        const html = katex.renderToString(math, { displayMode: false, throwOnError: false });
        mathPlaceholders.push({
          id,
          html: `<span class="inline-block px-0.5">${html}</span>`
        });
      } catch (e) {
        mathPlaceholders.push({
          id,
          html: `<span class="font-mono text-emerald-400">${math}</span>`
        });
      }
      return id;
    });

    // 3. Configure marked options
    marked.setOptions({
      gfm: true,
      breaks: true
    });

    // 4. Parse markdown
    let html = marked.parse(processed) as string;

    // 5. Restore math placeholders
    for (const item of mathPlaceholders) {
      html = html.split(item.id).join(item.html);
    }

    return html;
  }, [content]);

  return (
    <div
      className={`markdown-content text-xs sm:text-sm leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};
