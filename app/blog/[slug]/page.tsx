/*
  Individual Blog Post Page

  Dynamic route that renders a single blog post based on the slug.
  For example: /blog/my-first-post loads content/blog/my-first-post.md

  Features:
  - MDX rendering (Markdown with React components)
  - Reading progress indicator
  - Table of contents with active-section highlighting
  - Related posts + previous/next navigation
*/

import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllPostSlugs,
  getPostBySlug,
  getHeadings,
  getAdjacentPosts,
  getRelatedPosts,
} from "@/lib/blog";
import { MDXContent } from "@/components/MDXContent";
import { ReadingProgress } from "@/components/ReadingProgress";
import { TableOfContents } from "@/components/TableOfContents";
import { ArrowLeft, ArrowRight, Calendar, Clock, Tag } from "lucide-react";

// Generate static pages for all blog posts at build time
// This creates /blog/post-1, /blog/post-2, etc.
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

// Format date to be more readable
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);

  // If post doesn't exist, show 404
  if (!post) {
    notFound();
  }

  const headings = getHeadings(post.content);
  const { prev, next } = getAdjacentPosts(post.slug);
  const relatedPosts = getRelatedPosts(post.slug, 2);

  return (
    <>
      <ReadingProgress />
      <article className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex gap-10">
          {/* Main column */}
          <div className="max-w-3xl w-full mx-auto">
            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all posts
            </Link>

            {/* Post header */}
            <header className="mb-8">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${tag.toLowerCase()}`}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </Link>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                {post.title}
              </h1>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.date)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readingTime}
                </span>
              </div>
            </header>

            {/* Post content */}
            <div className="prose-custom">
              <MDXContent content={post.content} />
            </div>

            {/* Related posts */}
            {relatedPosts.length > 0 && (
              <section className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
                <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">
                  Keep reading
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {relatedPosts.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/blog/${related.slug}`}
                      className="group block h-full"
                    >
                      <div className="h-full p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/5">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {related.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {related.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
                          {related.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Prev / next navigation */}
            {(prev || next) && (
              <nav className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prev ? (
                  <Link
                    href={`/blog/${prev.slug}`}
                    className="group p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
                  >
                    <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Previous
                    </span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                      {prev.title}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}
                {next && (
                  <Link
                    href={`/blog/${next.slug}`}
                    className="group p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors sm:text-right"
                  >
                    <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-1 sm:justify-end">
                      Next
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                      {next.title}
                    </span>
                  </Link>
                )}
              </nav>
            )}

            {/* Post footer */}
            <footer className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to all posts
                </Link>

                {/* Share section - you can expand this */}
                <div className="text-sm text-slate-500 dark:text-slate-500">
                  Thanks for reading!
                </div>
              </div>
            </footer>
          </div>

          {/* Table of contents (desktop only) */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}
