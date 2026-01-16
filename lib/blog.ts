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

    // Create slug from filename (remove .md or .mdx extension)
    const slug = filename.replace(/\.mdx?$/, "");

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
  // Try both .md and .mdx extensions
  const extensions = [".md", ".mdx"];

  for (const ext of extensions) {
    const filePath = path.join(BLOG_DIR, `${slug}${ext}`);

    if (fs.existsSync(filePath)) {
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
    .map((file) => file.replace(/\.mdx?$/, ""));
}
