"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { DoingItem } from "@/lib/doing";

interface DoingListProps {
  items: DoingItem[];
  tags: string[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const statusConfig = {
  "in-progress": {
    label: "In Progress",
    dot: "bg-accent-500",
    badge: "bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300",
  },
  completed: {
    label: "Completed",
    dot: "bg-primary-500",
    badge: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300",
  },
  paused: {
    label: "Paused",
    dot: "bg-slate-400",
    badge: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  },
};

export function DoingList({ items, tags }: DoingListProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    const matchesTag = !activeTag || item.tags.includes(activeTag);
    const matchesStatus = !activeStatus || item.status === activeStatus;
    return matchesTag && matchesStatus;
  });

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 space-y-3">
        {/* Status filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveStatus(null)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              activeStatus === null
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            All
          </button>
          {(["in-progress", "completed", "paused"] as const).map((status) => (
            <button
              key={status}
              onClick={() =>
                setActiveStatus(activeStatus === status ? null : status)
              }
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                activeStatus === status
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {statusConfig[status].label}
            </button>
          ))}
        </div>

        {/* Tag filters */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  activeTag === tag
                    ? "bg-primary-600 text-white dark:bg-primary-500"
                    : "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/50"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-3 top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-700" />

        <div className="space-y-8">
          {filteredItems.map((item, index) => {
            const config = statusConfig[item.status];

            return (
              <motion.div
                key={`${item.date}-${item.title}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="relative pl-10"
              >
                {/* Timeline dot */}
                <div
                  className={`absolute left-1.5 top-1.5 w-3 h-3 rounded-full ring-4 ring-white dark:ring-slate-900 ${config.dot}`}
                />

                {/* Card */}
                <div className="p-5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.badge}`}
                      >
                        {config.label}
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatDate(item.date)}
                      </span>
                    </div>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 p-1 text-slate-400 hover:text-primary-500 transition-colors"
                        aria-label="View on GitHub"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Empty state */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">
            No updates match the current filters.
          </p>
        </div>
      )}
    </div>
  );
}
