"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
          From Restaurant Tables to{" "}
          <span className="gradient-text">Neural Networks</span>
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-10">
          I spent years in the restaurant industry before deciding to teach
          myself AI and machine learning. This is where I document everything —
          the wins, the confusion, and what I&apos;m figuring out along the way.
        </p>

        <nav className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            Read the Blog
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-600 text-slate-700 dark:text-slate-300 hover:text-primary-700 dark:hover:text-primary-400 rounded-lg font-medium transition-colors"
          >
            Latest AI News
          </Link>
          <Link
            href="/side-quests"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-200 dark:border-slate-700 hover:border-accent-400 dark:hover:border-accent-600 text-slate-700 dark:text-slate-300 hover:text-accent-600 dark:hover:text-accent-400 rounded-lg font-medium transition-colors"
          >
            Side Quests
          </Link>
        </nav>
      </motion.div>
    </div>
  );
}
