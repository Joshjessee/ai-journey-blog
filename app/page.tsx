import { getAllPosts, getAllTags } from "@/lib/blog";
import { getAllDoingItems } from "@/lib/doing";
import { HomeContent } from "@/components/HomeContent";
import type { HeroStatsData } from "@/components/HeroStats";

// Pull the leading number out of a "X min read" string.
function parseReadingMinutes(readingTime: string): number {
  const match = readingTime.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

export default function HomePage() {
  const posts = getAllPosts();
  const doingItems = getAllDoingItems();

  const readingMinutes = posts.reduce(
    (sum, post) => sum + parseReadingMinutes(post.readingTime),
    0
  );

  // Earliest date across posts + activity marks the start of the journey.
  const allDates = [
    ...posts.map((p) => p.date),
    ...doingItems.map((d) => d.date),
  ]
    .map((d) => new Date(d).getTime())
    .filter((t) => !Number.isNaN(t));

  const startTime = allDates.length ? Math.min(...allDates) : Date.now();
  const daysOnJourney = Math.max(
    1,
    Math.round((Date.now() - startTime) / (1000 * 60 * 60 * 24))
  );

  const latest = doingItems[0];

  const stats: HeroStatsData = {
    postCount: posts.length,
    topicCount: getAllTags().length,
    readingMinutes,
    daysOnJourney,
    latestActivity: latest
      ? { title: latest.title, date: latest.date }
      : null,
  };

  return <HomeContent posts={posts} stats={stats} />;
}
