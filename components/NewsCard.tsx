"use client";
/*
  NewsCard Component

  Displays a single news item with:
  - Title and description
  - Source and date
  - Category badge
  - Tags
  - Link to original source
*/

import { motion } from "framer-motion";
import { ExternalLink, Calendar, Tag } from "lucide-react";
import { NewsItem, CATEGORY_INFO, formatNewsDate } from "@/lib/news";

interface NewsCardProps {
  item: NewsItem;
  index?: number;
  featured?: boolean;
}

export function NewsCard({ item, index = 0, featured = false }: NewsCardProps) {
  const categoryStyle = CATEGORY_INFO[item.category];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`
        group relative overflow-hidden rounded-xl
        bg-white dark:bg-slate-800/50
        border border-slate-200 dark:border-slate-700
        hover:border-primary-300 dark:hover:border-primary-700
        transition-all duration-300
        ${featured ? "md:col-span-2" : ""}
      `}
    >
      <a
        href={item.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-6"
      >
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`
              px-3 py-1 rounded-full text-xs font-medium
              ${categoryStyle.bgColor} ${categoryStyle.darkBgColor} ${categoryStyle.color}
            `}
          >
            {item.category}
          </span>
          <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            {formatNewsDate(item.date)}
          </div>
        </div>

        {/* Title */}
        <h3
          className={`
            font-semibold text-slate-900 dark:text-white
            group-hover:text-primary-600 dark:group-hover:text-primary-400
            transition-colors mb-2
            ${featured ? "text-xl" : "text-lg"}
          `}
        >
          {item.title}
        </h3>

        {/* Description */}
        <p
          className={`
            text-slate-600 dark:text-slate-400 mb-4
            ${featured ? "text-base" : "text-sm"}
            line-clamp-3
          `}
        >
          {item.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {item.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs
                bg-slate-100 dark:bg-slate-700/50
                text-slate-600 dark:text-slate-400"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>

        {/* Source */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {item.source}
          </span>
          <span className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 group-hover:underline">
            Read more
            <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </div>
      </a>

      {/* Hover gradient effect */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5
          opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
      />
    </motion.article>
  );
}
