/*
  MDX Content Renderer

  This component takes raw markdown content and renders it as HTML.
  We use next-mdx-remote to:
  - Parse markdown syntax
  - Support MDX features (React components in markdown)
  - Handle syntax highlighting for code blocks

  The rendering happens on the server for better performance.
*/

import { MDXRemote } from "next-mdx-remote/rsc";

// Custom components that can be used in MDX files
// For example, you could write <Callout>Note!</Callout> in your markdown
const components = {
  // Callout/Note component for highlighting important info
  Callout: ({ children, type = "info" }: { children: React.ReactNode; type?: "info" | "warning" | "tip" }) => {
    const styles = {
      info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200",
      warning: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200",
      tip: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200",
    };

    return (
      <div className={`p-4 my-4 rounded-lg border ${styles[type]}`}>
        {children}
      </div>
    );
  },

  // Code block with syntax highlighting (basic version)
  // For advanced highlighting, you'd integrate with a library like shiki or prism
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="bg-slate-900 dark:bg-slate-950 text-slate-100 p-4 rounded-lg overflow-x-auto my-4 text-sm"
      {...props}
    >
      {children}
    </pre>
  ),

  // Inline code
  code: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => {
    // Check if this is inside a pre tag (code block) vs inline
    const isInline = typeof children === "string" && !children.includes("\n");

    if (isInline) {
      return (
        <code
          className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-primary-600 dark:text-primary-400"
          {...props}
        >
          {children}
        </code>
      );
    }

    return <code {...props}>{children}</code>;
  },

  // Links with nice styling
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={href}
      className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline decoration-primary-500/30 hover:decoration-primary-500 transition-colors"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  ),

  // Headers with anchor links
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-8 mb-4" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-3" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-2" {...props}>
      {children}
    </h3>
  ),

  // Paragraphs
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="my-4 leading-relaxed text-slate-700 dark:text-slate-300" {...props}>
      {children}
    </p>
  ),

  // Lists
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-inside my-4 space-y-2 text-slate-700 dark:text-slate-300" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside my-4 space-y-2 text-slate-700 dark:text-slate-300" {...props}>
      {children}
    </ol>
  ),

  // Blockquotes
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-primary-500 pl-4 my-4 italic text-slate-600 dark:text-slate-400"
      {...props}
    >
      {children}
    </blockquote>
  ),

  // Images
  img: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || ""}
      className="rounded-lg shadow-md my-6 max-w-full"
      {...props}
    />
  ),

  // Horizontal rule
  hr: () => <hr className="my-8 border-slate-200 dark:border-slate-700" />,
};

interface MDXContentProps {
  content: string;
}

export function MDXContent({ content }: MDXContentProps) {
  return (
    <MDXRemote
      source={content}
      components={components}
    />
  );
}
