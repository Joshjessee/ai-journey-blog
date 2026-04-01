"use client";

import { motion } from "framer-motion";

export interface MediaItem {
  title: string;
  subtitle: string;
  emoji: string;
  genre?: string;
}

interface MediaGridProps {
  title: string;
  headerEmoji: string;
  items: MediaItem[];
  accentColor: "primary" | "accent";
}

const accentStyles = {
  primary: {
    wrapper: "bg-primary-500/10 dark:bg-primary-500/20",
    icon: "text-primary-500",
    genre: "text-primary-500 dark:text-primary-400",
    genreBg: "bg-primary-500/10 dark:bg-primary-500/20",
  },
  accent: {
    wrapper: "bg-accent-500/10 dark:bg-accent-500/20",
    icon: "text-accent-500",
    genre: "text-accent-500 dark:text-accent-400",
    genreBg: "bg-accent-500/10 dark:bg-accent-500/20",
  },
};

export function MediaGrid({ title, headerEmoji, items, accentColor }: MediaGridProps) {
  const styles = accentStyles[accentColor];

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${styles.wrapper}`}>
          <span className={`text-xl ${styles.icon}`} role="img" aria-label={title}>
            {headerEmoji}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {title}
        </h2>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {items.map((item, index) => (
          <motion.div
            key={item.title}
            className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-4 flex flex-col items-center text-center gap-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.35 }}
            whileHover={{ y: -4, scale: 1.03 }}
          >
            <span className="text-3xl" role="img" aria-hidden="true">
              {item.emoji}
            </span>
            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
              {item.title}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {item.subtitle}
            </p>
            {item.genre && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles.genre} ${styles.genreBg}`}>
                {item.genre}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
