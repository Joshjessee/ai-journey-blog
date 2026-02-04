"use client";
/*
  AI News Aggregator Page

  Displays curated AI news from:
  - Research papers (arXiv, Nature, etc.)
  - Industry news (company blogs, announcements)
  - Tutorials and guides
  - Tools and libraries

  Features:
  - Category filtering
  - Tag filtering
  - Search functionality
  - Featured articles section
*/

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Newspaper,
  Filter,
  X,
  Sparkles,
  FlaskConical,
  Building2,
  Wrench,
  GraduationCap,
  MessageSquare,
  Megaphone,
} from "lucide-react";
import { NewsCard } from "@/components/NewsCard";
import {
  NEWS_DATA,
  getAllCategories,
  getAllTags,
  type NewsCategory,
} from "@/lib/news";

// Category icons mapping
const CATEGORY_ICONS: Record<NewsCategory, typeof FlaskConical> = {
  Research: FlaskConical,
  Industry: Building2,
  Tools: Wrench,
  Tutorial: GraduationCap,
  Opinion: MessageSquare,
  Announcement: Megaphone,
};

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | null>(
    null
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const categories = getAllCategories();
  const allTags = getAllTags();

  // Filter news based on search, category, and tags
  const filteredNews = useMemo(() => {
    return NEWS_DATA.filter((item) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          item.source.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory && item.category !== selectedCategory) {
        return false;
      }

      // Tags filter
      if (selectedTags.length > 0) {
        const hasMatchingTag = selectedTags.some((tag) =>
          item.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
        );
        if (!hasMatchingTag) return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedTags]);

  // Separate featured and regular news
  const featuredNews = filteredNews.filter((item) => item.featured);
  const regularNews = filteredNews.filter((item) => !item.featured);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedTags([]);
  };

  const hasActiveFilters =
    searchQuery || selectedCategory || selectedTags.length > 0;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full
              bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300
              text-sm font-medium mb-4"
          >
            <Sparkles className="w-4 h-4" />
            Curated AI News
          </motion.div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            AI News Aggregator
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Stay updated with the latest in AI research, industry news, tools,
            and tutorials from trusted sources
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search news, topics, or sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl
                  bg-white dark:bg-slate-800/50
                  border border-slate-200 dark:border-slate-700
                  text-slate-900 dark:text-white
                  placeholder-slate-400 dark:placeholder-slate-500
                  focus:outline-none focus:ring-2 focus:ring-primary-500
                  transition-all"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                px-4 py-3 rounded-xl font-medium flex items-center gap-2
                transition-colors
                ${
                  showFilters || hasActiveFilters
                    ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                    : "bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                }
              `}
            >
              <Filter className="w-5 h-5" />
              Filters
              {hasActiveFilters && (
                <span className="px-2 py-0.5 rounded-full bg-primary-500 text-white text-xs">
                  {(selectedCategory ? 1 : 0) + selectedTags.length}
                </span>
              )}
            </button>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  {/* Categories */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => {
                        const Icon = CATEGORY_ICONS[category];
                        const isSelected = selectedCategory === category;
                        return (
                          <button
                            key={category}
                            onClick={() =>
                              setSelectedCategory(isSelected ? null : category)
                            }
                            className={`
                              px-3 py-1.5 rounded-lg text-sm font-medium
                              flex items-center gap-1.5 transition-colors
                              ${
                                isSelected
                                  ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                                  : "bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                              }
                            `}
                          >
                            <Icon className="w-4 h-4" />
                            {category}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Popular Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {allTags.slice(0, 15).map((tag) => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`
                              px-2.5 py-1 rounded-md text-xs font-medium
                              transition-colors
                              ${
                                isSelected
                                  ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                                  : "bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                              }
                            `}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Clear all filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Showing{" "}
            <span className="font-medium text-slate-900 dark:text-white">
              {filteredNews.length}
            </span>{" "}
            {filteredNews.length === 1 ? "article" : "articles"}
          </p>
        </div>

        {/* Featured News */}
        {featuredNews.length > 0 && !hasActiveFilters && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Featured
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredNews.map((item, index) => (
                <NewsCard key={item.id} item={item} index={index} featured />
              ))}
            </div>
          </div>
        )}

        {/* News Grid */}
        {filteredNews.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(hasActiveFilters ? filteredNews : regularNews).map(
              (item, index) => (
                <NewsCard key={item.id} item={item} index={index} />
              )
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Newspaper className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No articles found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Try adjusting your search or filters
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
