"use client";

/*
  TableOfContents

  A sticky sidebar (lg+ only) listing the article's h2/h3 headings. The
  heading currently in view is highlighted via IntersectionObserver, and
  clicking an entry smooth-scrolls to that section.

  Heading ids are produced on the server by getHeadings() in lib/blog.ts
  using github-slugger, matching the ids rehype-slug adds to the rendered
  headings (see components/MDXContent.tsx).
*/

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/blog";

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      // Trigger when a heading is near the top of the viewport.
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }
  };

  if (headings.length < 2) return null;

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs mb-3">
        On this page
      </p>
      <ul className="space-y-2 border-l border-slate-200 dark:border-slate-700">
        {headings.map((heading) => {
          const active = activeId === heading.id;
          return (
            <li
              key={heading.id}
              style={{ paddingLeft: heading.level === 3 ? "1.5rem" : "0.75rem" }}
            >
              <a
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading.id)}
                className={`-ml-px block border-l-2 pl-3 py-0.5 transition-colors ${
                  active
                    ? "border-primary-500 text-primary-600 dark:text-primary-400 font-medium"
                    : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
