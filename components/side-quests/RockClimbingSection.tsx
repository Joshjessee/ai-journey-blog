"use client";

import { motion } from "framer-motion";
import { Mountain, Camera } from "lucide-react";

export function RockClimbingSection() {
  // Placeholder cards — swap out for real images once available
  const placeholderSlots = Array.from({ length: 4 });

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-primary-500/10 dark:bg-primary-500/20">
          <Mountain className="w-6 h-6 text-primary-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Rock Climbing
        </h2>
      </div>
      <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl">
        From bouldering in the gym to sport routes outdoors — climbing is the
        puzzle that never gets old. Every problem is unique, every send is earned.
        Photos coming soon.
      </p>

      {/* Photo placeholder grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {placeholderSlots.map((_, i) => (
          <motion.div
            key={i}
            className="aspect-square rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center gap-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.4 }}
            >
              <Camera className="w-7 h-7 text-slate-300 dark:text-slate-600" />
            </motion.div>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              Coming Soon
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
