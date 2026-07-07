import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/blog";

const SITE_URL = "https://ai-journey-blog-iota.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const newestPostDate = posts[0] ? new Date(posts[0].date) : new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: newestPostDate, priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: newestPostDate, priority: 0.9 },
    { url: `${SITE_URL}/news`, priority: 0.6 },
    { url: `${SITE_URL}/doing`, priority: 0.6 },
    { url: `${SITE_URL}/side-quests`, priority: 0.5 },
    { url: `${SITE_URL}/about`, priority: 0.5 },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    priority: 0.8,
  }));

  const tagRoutes: MetadataRoute.Sitemap = getAllTags().map((tag) => ({
    url: `${SITE_URL}/blog/tag/${encodeURIComponent(tag.toLowerCase())}`,
    priority: 0.4,
  }));

  return [...staticRoutes, ...postRoutes, ...tagRoutes];
}
