/*
  Blog Utilities

  This file contains functions for reading and parsing markdown blog posts.
  It uses:
  - fs (Node.js file system) to read files
  - gray-matter to parse frontmatter (metadata at the top of markdown files)
  - path to handle file paths

  IMPORTANT: These functions only work on the server side (during build time
  or in Server Components), not in the browser.
*/

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

// Define the structure of a blog post's frontmatter (metadata)
export interface BlogPost {
  slug: string;           // URL-friendly identifier (e.g., "my-first-post")
  title: string;          // Post title
  description: string;    // Short description for previews
  date: string;           // Publication date (YYYY-MM-DD format)
  tags: string[];         // Categories/tags (e.g., ["ML", "Python"])
  readingTime: string;    // Estimated reading time
  content: string;        // The actual markdown content
  featured?: boolean;     // Whether to feature this post
}

// Path to the content/blog directory
const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/*
  Convert a filename into a URL-safe slug
  e.g., "Post 2 Company Inspiration" -> "post-2-company-inspiration"
*/
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/*
  Calculate estimated reading time
  Average reading speed is about 200-250 words per minute
*/
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

/*
  Get all blog posts, sorted by date (newest first)
  This is used for the blog listing page
*/
export function getAllPosts(): BlogPost[] {
  // Check if the blog directory exists
  if (!fs.existsSync(BLOG_DIR)) {
    // Create the directory and return empty array
    fs.mkdirSync(BLOG_DIR, { recursive: true });
    return [];
  }

  // Get all .md and .mdx files in the blog directory
  const files = fs.readdirSync(BLOG_DIR).filter(
    (file) => file.endsWith(".md") || file.endsWith(".mdx")
  );

  // Parse each file and extract post data
  const posts = files.map((filename) => {
    // Read the file contents
    const filePath = path.join(BLOG_DIR, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");

    // Parse frontmatter and content using gray-matter
    const { data, content } = matter(fileContents);

    // Create URL-safe slug from filename (remove extension, normalize)
    const slug = slugify(filename.replace(/\.mdx?$/, ""));

    return {
      slug,
      title: data.title || "Untitled",
      description: data.description || "",
      date: data.date || new Date().toISOString().split("T")[0],
      tags: data.tags || [],
      readingTime: calculateReadingTime(content),
      content,
      featured: data.featured || false,
    } as BlogPost;
  });

  // Sort by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/*
  Get a single post by its slug
  This is used for individual post pages
*/
export function getPostBySlug(slug: string): BlogPost | null {
  if (!fs.existsSync(BLOG_DIR)) return null;

  // Find the file whose slugified name matches the requested slug
  const files = fs.readdirSync(BLOG_DIR).filter(
    (file) => file.endsWith(".md") || file.endsWith(".mdx")
  );

  for (const filename of files) {
    const fileSlug = slugify(filename.replace(/\.mdx?$/, ""));
    if (fileSlug === slug) {
      const filePath = path.join(BLOG_DIR, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || "Untitled",
        description: data.description || "",
        date: data.date || new Date().toISOString().split("T")[0],
        tags: data.tags || [],
        readingTime: calculateReadingTime(content),
        content,
        featured: data.featured || false,
      };
    }
  }

  return null;
}

/*
  Get all unique tags from all posts
  Useful for creating a tag filter
*/
export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagSet = new Set<string>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
}

/*
  Get posts filtered by tag
*/
export function getPostsByTag(tag: string): BlogPost[] {
  return getAllPosts().filter((post) =>
    post.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

// A single entry in a post's table of contents.
export interface Heading {
  id: string;    // slug id (matches rehype-slug output)
  text: string;  // heading text
  level: number; // 2 for h2, 3 for h3
}

/*
  Extract h2/h3 headings from raw markdown for a table of contents.
  Uses github-slugger so the generated ids match those produced by
  rehype-slug when the markdown is rendered (see components/MDXContent.tsx).
  Skips fenced code blocks so "# comments" inside code aren't treated as
  headings.
*/
export function getHeadings(content: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let inCodeBlock = false;

  for (const line of content.split("\n")) {
    if (/^\s*```/.test(line)) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = /^(#{2,3})\s+(.*)$/.exec(line.trim());
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/#+\s*$/, "").trim();
      headings.push({ id: slugger.slug(text), text, level });
    }
  }

  return headings;
}

/*
  Get the previous (newer) and next (older) posts relative to a slug,
  based on the date-sorted list. Used for prev/next navigation.
*/
export function getAdjacentPosts(slug: string): {
  prev: BlogPost | null;
  next: BlogPost | null;
} {
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? posts[index - 1] : null,
    next: index < posts.length - 1 ? posts[index + 1] : null,
  };
}

/*
  Get related posts by shared-tag overlap, most overlap first.
  Falls back to the most recent other posts when nothing shares a tag.
*/
export function getRelatedPosts(slug: string, limit = 2): BlogPost[] {
  const posts = getAllPosts();
  const current = posts.find((p) => p.slug === slug);
  if (!current) return [];

  const currentTags = new Set(current.tags.map((t) => t.toLowerCase()));

  const scored = posts
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      score: p.tags.filter((t) => currentTags.has(t.toLowerCase())).length,
    }))
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.post);
}

/*
  Get all post slugs for static generation
  Used with generateStaticParams in Next.js
*/
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  return fs.readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .map((file) => slugify(file.replace(/\.mdx?$/, "")));
}
