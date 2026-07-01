"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import type { BlogPost } from "@/lib/blog";
import { NeuralBackground } from "./NeuralBackground";
import { HeroStats, type HeroStatsData } from "./HeroStats";

interface HomeContentProps {
  posts: BlogPost[];
  stats: HeroStatsData;
}

// Phrases that rotate under the hero title.
const TAGLINES = [
  "Learning AI in public, one post at a time.",
  "From restaurant tables to neural networks.",
  "Building, breaking, and writing it all down.",
  "Notes, experiments, and the occasional side quest.",
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function RotatingTagline() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % TAGLINES.length),
      3500
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-7 mb-6" aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="text-lg text-primary-600 dark:text-primary-400 font-medium"
        >
          {TAGLINES[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export function HomeContent({ posts, stats }: HomeContentProps) {
  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const recentPosts = posts
    .filter((p) => p.slug !== featuredPost?.slug)
    .slice(0, 4);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 sm:py-24">
      {/* Animated Hero */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-16 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-primary-50/60 via-white to-accent-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/60 px-6 py-12 sm:px-10 sm:py-14"
      >
        <NeuralBackground />
        <div className="relative">
          <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-3 text-balance">
            <span className="gradient-text">AI Journey</span>
          </h1>
          <RotatingTagline />
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-8">
            This is my website, that I had Claude build, to share what I&apos;m doing
            and thinking. It&apos;s a place for me to practice and come up with new
            ideas to continue to learn and build.
          </p>
          <HeroStats stats={stats} />
        </div>
      </motion.section>

      {/* Featured Post */}
      {featuredPost && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <Link href={`/blog/${featuredPost.slug}`} className="group block">
            <article className="p-8 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/5 border-l-4 border-l-primary-500">
              <div className="flex flex-wrap gap-2 mb-4">
                {featuredPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {featuredPost.title}
              </h2>

              <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg leading-relaxed line-clamp-3">
                {featuredPost.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(featuredPost.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readingTime}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Read more
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </article>
          </Link>
        </motion.div>
      )}

      {/* Recent Posts Grid */}
      {recentPosts.length > 0 && (
        <div className="mb-16">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">
            Recent Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <article className="h-full p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/5">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {post.title}
                    </h3>

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
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex flex-wrap gap-6 pt-8 border-t border-slate-200 dark:border-slate-800"
      >
        {[
          { href: "/blog", label: "All Posts" },
          { href: "/news", label: "AI News" },
          { href: "/doing", label: "What I'm Doing" },
          { href: "/side-quests", label: "Side Quests" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {link.label}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
