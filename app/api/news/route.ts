import { NextResponse } from "next/server";
import Parser from "rss-parser";
import type { NewsCategory, NewsItem } from "@/lib/news";

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "AI-Journey-Blog-NewsAggregator/1.0",
  },
});

// AI news RSS feeds with their source metadata
const RSS_FEEDS: {
  url: string;
  source: string;
  defaultCategory: NewsCategory;
}[] = [
  {
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    source: "TechCrunch",
    defaultCategory: "Industry",
  },
  {
    url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    source: "The Verge",
    defaultCategory: "Industry",
  },
  {
    url: "https://venturebeat.com/category/ai/feed/",
    source: "VentureBeat",
    defaultCategory: "Industry",
  },
  {
    url: "https://feeds.arstechnica.com/arstechnica/technology-lab",
    source: "Ars Technica",
    defaultCategory: "Industry",
  },
  {
    url: "https://blog.google/technology/ai/rss/",
    source: "Google AI Blog",
    defaultCategory: "Research",
  },
  {
    url: "https://openai.com/blog/rss.xml",
    source: "OpenAI",
    defaultCategory: "Announcement",
  },
];

// Simple keyword-based category detection
function detectCategory(
  title: string,
  description: string
): NewsCategory | null {
  const text = `${title} ${description}`.toLowerCase();

  if (
    text.includes("paper") ||
    text.includes("study") ||
    text.includes("researchers") ||
    text.includes("arxiv") ||
    text.includes("breakthrough")
  ) {
    return "Research";
  }
  if (
    text.includes("tutorial") ||
    text.includes("how to") ||
    text.includes("guide") ||
    text.includes("learn")
  ) {
    return "Tutorial";
  }
  if (
    text.includes("release") ||
    text.includes("launch") ||
    text.includes("announce") ||
    text.includes("introduces") ||
    text.includes("unveil")
  ) {
    return "Announcement";
  }
  if (
    text.includes("open source") ||
    text.includes("github") ||
    text.includes("library") ||
    text.includes("framework") ||
    text.includes("sdk") ||
    text.includes("api")
  ) {
    return "Tools";
  }
  if (
    text.includes("opinion") ||
    text.includes("editorial") ||
    text.includes("think") ||
    text.includes("should") ||
    text.includes("future of")
  ) {
    return "Opinion";
  }

  return null;
}

// Extract tags from title and description
function extractTags(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const tagMap: Record<string, string> = {
    "openai": "OpenAI",
    "gpt": "GPT",
    "chatgpt": "ChatGPT",
    "claude": "Claude",
    "anthropic": "Anthropic",
    "google": "Google",
    "gemini": "Gemini",
    "meta": "Meta",
    "llama": "Llama",
    "mistral": "Mistral",
    "llm": "LLM",
    "large language model": "LLM",
    "transformer": "Transformers",
    "diffusion": "Diffusion",
    "stable diffusion": "Stable Diffusion",
    "midjourney": "Midjourney",
    "image generation": "Image Generation",
    "video generation": "Video Generation",
    "machine learning": "Machine Learning",
    "deep learning": "Deep Learning",
    "neural network": "Neural Networks",
    "computer vision": "Computer Vision",
    "nlp": "NLP",
    "natural language": "NLP",
    "robotics": "Robotics",
    "autonomous": "Autonomous",
    "ai safety": "AI Safety",
    "alignment": "Alignment",
    "nvidia": "NVIDIA",
    "gpu": "GPU",
    "training": "AI Training",
    "fine-tun": "Fine-tuning",
    "rag": "RAG",
    "agent": "AI Agents",
    "multimodal": "Multimodal",
    "open source": "Open Source",
    "regulation": "AI Regulation",
    "copyright": "AI & Copyright",
  };

  const tags = new Set<string>();
  for (const [keyword, tag] of Object.entries(tagMap)) {
    if (text.includes(keyword)) {
      tags.add(tag);
    }
  }

  // Ensure at least one tag
  if (tags.size === 0) {
    tags.add("AI");
  }

  return Array.from(tags).slice(0, 5);
}

// Strip HTML tags from description
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchFeed(feed: (typeof RSS_FEEDS)[number]): Promise<NewsItem[]> {
  try {
    const result = await parser.parseURL(feed.url);
    return (result.items || []).slice(0, 10).map((item, i) => {
      const title = item.title || "Untitled";
      const rawDescription =
        item.contentSnippet || item.content || item.summary || "";
      const description = stripHtml(rawDescription).slice(0, 300);
      const category =
        detectCategory(title, description) || feed.defaultCategory;
      const date = item.isoDate || item.pubDate || new Date().toISOString();

      return {
        id: `${feed.source.replace(/\s+/g, "-").toLowerCase()}-${i}-${Date.parse(date) || Date.now()}`,
        title,
        description: description || `Latest from ${feed.source}`,
        source: feed.source,
        sourceUrl: item.link || feed.url,
        category,
        date,
        tags: extractTags(title, description),
      };
    });
  } catch (error) {
    console.error(`Failed to fetch RSS feed from ${feed.source}:`, error);
    return [];
  }
}

export async function GET() {
  const feedPromises = RSS_FEEDS.map((feed) => fetchFeed(feed));
  const results = await Promise.allSettled(feedPromises);

  const allNews: NewsItem[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      allNews.push(...result.value);
    }
  }

  // Sort by date, newest first
  allNews.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Mark the top 2 most recent as featured
  for (let i = 0; i < Math.min(2, allNews.length); i++) {
    allNews[i].featured = true;
  }

  return NextResponse.json(
    {
      news: allNews,
      fetchedAt: new Date().toISOString(),
      sourceCount: RSS_FEEDS.length,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}
