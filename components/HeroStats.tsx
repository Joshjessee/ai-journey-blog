"use client";

/*
  HeroStats

  A row of "live" stat cards shown under the homepage hero. Numbers count up
  from 0 on mount using Framer Motion's animate() (already a dependency).
  Respects prefers-reduced-motion by snapping straight to the final value.

  The final "Latest activity" card is a link to /doing.
*/

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";
import { FileText, Sparkles, Clock, Activity } from "lucide-react";

export interface HeroStatsData {
  postCount: number;
  topicCount: number;
  readingMinutes: number;
  daysOnJourney: number;
  latestActivity: { title: string; date: string } | null;
}

function CountUp({ value, reduced }: { value: number; reduced: boolean }) {
  const [display, setDisplay] = useState(reduced ? value : 0);
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [value, reduced]);

  return <span ref={nodeRef}>{display.toLocaleString()}</span>;
}

export function HeroStats({ stats }: { stats: HeroStatsData }) {
  const reduced = useReducedMotion() ?? false;

  const numberCards = [
    { icon: FileText, label: "Posts written", value: stats.postCount },
    { icon: Sparkles, label: "Topics explored", value: stats.topicCount },
    {
      icon: Clock,
      label: "Minutes of reading",
      value: stats.readingMinutes,
    },
    { icon: Activity, label: "Days on the journey", value: stats.daysOnJourney },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {numberCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="rounded-xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 px-4 py-4"
          >
            <Icon className="w-4 h-4 text-primary-500 mb-2" />
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
              <CountUp value={card.value} reduced={reduced} />
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {card.label}
            </div>
          </div>
        );
      })}

      {stats.latestActivity && (
        <Link
          href="/doing"
          className="col-span-2 lg:col-span-4 group rounded-xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:border-accent-300 dark:hover:border-accent-700 px-4 py-3 flex items-center gap-3 transition-colors"
        >
          <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-500" />
          </span>
          <span className="text-xs font-medium uppercase tracking-wider text-accent-600 dark:text-accent-400 flex-shrink-0">
            Latest
          </span>
          <span className="text-sm text-slate-700 dark:text-slate-300 truncate group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
            {stats.latestActivity.title}
          </span>
        </Link>
      )}
    </div>
  );
}
