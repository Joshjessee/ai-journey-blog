/*
  Blog Listing Page

  Displays all blog posts with:
  - Search functionality
  - Tag filtering
  - Clean card layout
  - Animations
*/

import Link from "next/link";
import { getAllPosts, getAllTags } from "@/lib/blog";
import { BlogList } from "@/components/BlogList";
import { Calendar, Tag } from "lucide-react";

// This tells Next.js to render this page at build time (Static Generation)
// Great for performance since blog posts don't change frequently
export const dynamic = "force-static";

export default function BlogPage() {
  // Get all posts and tags at build time
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Blog
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Thoughts, learnings, and insights from my journey into AI.
            Documenting everything so you can learn from my experiences.
          </p>
        </div>

        {/* Tags filter (shown as pills) */}
        {tags.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 justify-center">
              <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Tag className="w-4 h-4" />
                Topics:
              </span>
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${tag.toLowerCase()}`}
                  className="px-3 py-1 text-sm rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Blog posts list - this is a client component for interactivity */}
        <BlogList posts={posts} />

        {/* Empty state */}
        {posts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No posts yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Check back soon! I&apos;m working on my first post.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
