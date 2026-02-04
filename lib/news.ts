/*
  AI News Types and Data

  This file defines the data structures and sample data for the AI news aggregator.
  News is curated from research papers, reputable AI news sources, and industry updates.
*/

// A news article/item
export interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  sourceUrl: string;
  category: NewsCategory;
  date: string; // ISO date string
  imageUrl?: string;
  tags: string[];
  featured?: boolean;
}

// News categories
export type NewsCategory =
  | "Research"
  | "Industry"
  | "Tools"
  | "Tutorial"
  | "Opinion"
  | "Announcement";

// Category metadata for display
export const CATEGORY_INFO: Record<
  NewsCategory,
  { color: string; bgColor: string; darkBgColor: string }
> = {
  Research: {
    color: "text-purple-700 dark:text-purple-300",
    bgColor: "bg-purple-100",
    darkBgColor: "dark:bg-purple-900/30",
  },
  Industry: {
    color: "text-blue-700 dark:text-blue-300",
    bgColor: "bg-blue-100",
    darkBgColor: "dark:bg-blue-900/30",
  },
  Tools: {
    color: "text-green-700 dark:text-green-300",
    bgColor: "bg-green-100",
    darkBgColor: "dark:bg-green-900/30",
  },
  Tutorial: {
    color: "text-amber-700 dark:text-amber-300",
    bgColor: "bg-amber-100",
    darkBgColor: "dark:bg-amber-900/30",
  },
  Opinion: {
    color: "text-rose-700 dark:text-rose-300",
    bgColor: "bg-rose-100",
    darkBgColor: "dark:bg-rose-900/30",
  },
  Announcement: {
    color: "text-cyan-700 dark:text-cyan-300",
    bgColor: "bg-cyan-100",
    darkBgColor: "dark:bg-cyan-900/30",
  },
};

// Sample news data - curated AI news from various sources
export const NEWS_DATA: NewsItem[] = [
  {
    id: "1",
    title: "Claude 3.5 Sonnet Achieves New Benchmarks in Reasoning Tasks",
    description:
      "Anthropic's latest model demonstrates significant improvements in complex reasoning, coding, and mathematical problem-solving, setting new standards for AI assistants.",
    source: "Anthropic Blog",
    sourceUrl: "https://www.anthropic.com",
    category: "Announcement",
    date: "2026-02-03",
    tags: ["LLM", "Anthropic", "Claude", "Benchmarks"],
    featured: true,
  },
  {
    id: "2",
    title: "Attention Is All You Need: Transformer Architecture Turns 9",
    description:
      "A retrospective on the groundbreaking paper that introduced the Transformer architecture, which now powers virtually all modern language models.",
    source: "arXiv",
    sourceUrl: "https://arxiv.org/abs/1706.03762",
    category: "Research",
    date: "2026-02-02",
    tags: ["Transformers", "Deep Learning", "NLP", "Research Paper"],
    featured: true,
  },
  {
    id: "3",
    title: "OpenAI Introduces GPT-5 with Enhanced Multimodal Capabilities",
    description:
      "The latest iteration of GPT brings improved vision understanding, audio processing, and seamless integration across modalities.",
    source: "OpenAI",
    sourceUrl: "https://openai.com",
    category: "Announcement",
    date: "2026-02-01",
    tags: ["GPT-5", "OpenAI", "Multimodal", "LLM"],
  },
  {
    id: "4",
    title: "Google DeepMind's AlphaFold 3 Revolutionizes Drug Discovery",
    description:
      "New protein structure predictions enable faster identification of potential drug candidates, accelerating pharmaceutical research timelines.",
    source: "Nature",
    sourceUrl: "https://www.nature.com",
    category: "Research",
    date: "2026-01-30",
    tags: ["AlphaFold", "DeepMind", "Biology", "Drug Discovery"],
  },
  {
    id: "5",
    title: "Hugging Face Releases Transformers 5.0 with Native GGUF Support",
    description:
      "The popular ML library now includes built-in support for quantized models, making it easier to run large models on consumer hardware.",
    source: "Hugging Face",
    sourceUrl: "https://huggingface.co",
    category: "Tools",
    date: "2026-01-28",
    tags: ["Hugging Face", "Transformers", "Quantization", "Open Source"],
  },
  {
    id: "6",
    title: "The Rise of Small Language Models: Efficiency Over Scale",
    description:
      "Researchers are finding that smaller, well-trained models can match larger models on specific tasks while using a fraction of the compute.",
    source: "MIT Technology Review",
    sourceUrl: "https://www.technologyreview.com",
    category: "Opinion",
    date: "2026-01-26",
    tags: ["SLM", "Efficiency", "AI Research", "Sustainability"],
  },
  {
    id: "7",
    title: "Building Production RAG Systems: Lessons from the Field",
    description:
      "A comprehensive guide to implementing Retrieval-Augmented Generation systems that scale, covering embedding strategies, vector databases, and evaluation.",
    source: "Towards Data Science",
    sourceUrl: "https://towardsdatascience.com",
    category: "Tutorial",
    date: "2026-01-24",
    tags: ["RAG", "Vector Database", "LLM", "Production"],
  },
  {
    id: "8",
    title: "Meta Releases Llama 4 Under Open Source License",
    description:
      "The next generation of Meta's open-source LLM family brings 400B parameters and competitive performance with proprietary models.",
    source: "Meta AI",
    sourceUrl: "https://ai.meta.com",
    category: "Announcement",
    date: "2026-01-22",
    tags: ["Llama", "Meta", "Open Source", "LLM"],
  },
  {
    id: "9",
    title: "Constitutional AI: Training Models to Be Helpful, Harmless, and Honest",
    description:
      "Deep dive into Anthropic's approach to AI safety through constitutional training methods and RLHF refinements.",
    source: "arXiv",
    sourceUrl: "https://arxiv.org",
    category: "Research",
    date: "2026-01-20",
    tags: ["AI Safety", "Anthropic", "RLHF", "Alignment"],
  },
  {
    id: "10",
    title: "NVIDIA Announces Blackwell Ultra GPUs for AI Training",
    description:
      "New GPU architecture promises 4x improvement in AI training efficiency with enhanced memory bandwidth and tensor core performance.",
    source: "NVIDIA",
    sourceUrl: "https://www.nvidia.com",
    category: "Industry",
    date: "2026-01-18",
    tags: ["NVIDIA", "GPU", "Hardware", "AI Training"],
  },
  {
    id: "11",
    title: "Understanding Chain-of-Thought Prompting in LLMs",
    description:
      "New research reveals why step-by-step reasoning improves model performance and how to optimize prompts for complex tasks.",
    source: "Google Research",
    sourceUrl: "https://research.google",
    category: "Research",
    date: "2026-01-16",
    tags: ["Prompting", "CoT", "LLM", "Research"],
  },
  {
    id: "12",
    title: "Stable Diffusion 4.0 Brings Photorealistic Video Generation",
    description:
      "Stability AI's latest release enables high-quality video generation from text prompts with temporal consistency and style control.",
    source: "Stability AI",
    sourceUrl: "https://stability.ai",
    category: "Announcement",
    date: "2026-01-14",
    tags: ["Stable Diffusion", "Video Generation", "Generative AI"],
  },
];

// Get all unique tags from news items
export function getAllTags(): string[] {
  const tags = new Set<string>();
  NEWS_DATA.forEach((item) => item.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}

// Get all categories
export function getAllCategories(): NewsCategory[] {
  return ["Research", "Industry", "Tools", "Tutorial", "Opinion", "Announcement"];
}

// Filter news by category
export function getNewsByCategory(category: NewsCategory): NewsItem[] {
  return NEWS_DATA.filter((item) => item.category === category);
}

// Filter news by tag
export function getNewsByTag(tag: string): NewsItem[] {
  return NEWS_DATA.filter((item) =>
    item.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

// Get featured news
export function getFeaturedNews(): NewsItem[] {
  return NEWS_DATA.filter((item) => item.featured);
}

// Search news by title or description
export function searchNews(query: string): NewsItem[] {
  const lowerQuery = query.toLowerCase();
  return NEWS_DATA.filter(
    (item) =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      item.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

// Format date for display
export function formatNewsDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
