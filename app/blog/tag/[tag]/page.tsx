/*
  Tag Page

  Lists all posts carrying a given tag. Linked from the tag pills on the
  blog index and on individual posts, which emit `/blog/tag/<lowercased tag>`
  (spaces become %20 in the URL; params arrive decoded).
*/

import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllTags, getPostsByTag } from "@/lib/blog";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag: tag.toLowerCase() }));
}

function decodeTag(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

// Recover the tag's canonical casing (e.g. "machine learning" -> "Machine Learning")
function displayName(tag: string): string {
  return getAllTags().find((t) => t.toLowerCase() === tag.toLowerCase()) ?? tag;
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const name = displayName(decodeTag(tag));
  return {
    title: `Posts tagged "${name}"`,
    description: `All blog posts tagged ${name}.`,
  };
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const decoded = decodeTag(tag);
  const posts = getPostsByTag(decoded);

  if (posts.length === 0) {
    notFound();
  }

  const name = displayName(decoded);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all posts
        </Link>

        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-4">
            <Tag className="w-4 h-4" />
            {name}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Posts tagged &quot;{name}&quot;
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </p>
        </header>

        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <article className="p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/5">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                  {post.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(post.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readingTime}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
