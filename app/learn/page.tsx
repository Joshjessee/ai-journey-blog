"use client";
/*
  Learning Hub Page

  The main page for:
  - Viewing topics you've learned
  - Adding new topics and flashcards
  - Taking quizzes
  - Tracking progress
*/

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Brain,
  BookOpen,
  Trophy,
  Play,
  Sparkles,
  LayoutGrid,
  List,
} from "lucide-react";
import { LearningTracker } from "@/components/LearningTracker";
import { FlashcardQuiz } from "@/components/FlashcardQuiz";
import { AddTopicModal } from "@/components/AddTopicModal";
import { AddFlashcardModal } from "@/components/AddFlashcardModal";
import {
  loadTopics,
  loadFlashcards,
  saveTopics,
  saveFlashcards,
  getCardsForReview,
  calculateStats,
  type LearningTopic,
  type Flashcard,
} from "@/lib/learning";

// Tabs for the learning page
type Tab = "topics" | "quiz";

export default function LearnPage() {
  // State for topics and flashcards
  const [topics, setTopics] = useState<LearningTopic[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // UI state
  const [activeTab, setActiveTab] = useState<Tab>("topics");
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [showAddFlashcard, setShowAddFlashcard] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTopics = loadTopics();
    const savedFlashcards = loadFlashcards();
    setTopics(savedTopics);
    setFlashcards(savedFlashcards);
    setIsLoaded(true);
  }, []);

  // Calculate stats
  const stats = calculateStats(topics, flashcards);
  const cardsToReview = getCardsForReview(flashcards);

  // Handlers
  const handleAddTopic = (topic: LearningTopic) => {
    const newTopics = [...topics, topic];
    setTopics(newTopics);
    saveTopics(newTopics);
    setShowAddTopic(false);
  };

  const handleUpdateTopic = (updatedTopic: LearningTopic) => {
    const newTopics = topics.map((t) =>
      t.id === updatedTopic.id ? updatedTopic : t
    );
    setTopics(newTopics);
    saveTopics(newTopics);
  };

  const handleDeleteTopic = (topicId: string) => {
    const newTopics = topics.filter((t) => t.id !== topicId);
    const newFlashcards = flashcards.filter((f) => f.topicId !== topicId);
    setTopics(newTopics);
    setFlashcards(newFlashcards);
    saveTopics(newTopics);
    saveFlashcards(newFlashcards);
  };

  const handleAddFlashcard = (card: Flashcard) => {
    const newFlashcards = [...flashcards, card];
    setFlashcards(newFlashcards);
    saveFlashcards(newFlashcards);
    setShowAddFlashcard(false);
  };

  const handleUpdateFlashcards = (updatedCards: Flashcard[]) => {
    setFlashcards(updatedCards);
    saveFlashcards(updatedCards);
  };

  const handleOpenAddFlashcard = (topicId: string) => {
    setSelectedTopicId(topicId);
    setShowAddFlashcard(true);
  };

  // Don't render until data is loaded (prevents hydration mismatch)
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Learning Hub
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Track what you&apos;ve learned and quiz yourself with spaced repetition
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Topics", value: stats.totalTopics, icon: BookOpen, color: "blue" },
            { label: "Flashcards", value: stats.totalCards, icon: Brain, color: "purple" },
            { label: "To Review", value: stats.cardsToReview, icon: Sparkles, color: "amber" },
            { label: "Mastery", value: `${stats.averageMastery}%`, icon: Trophy, color: "green" },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                    <Icon className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("topics")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === "topics"
                  ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Topics
            </button>
            <button
              onClick={() => setActiveTab("quiz")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === "quiz"
                  ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Play className="w-4 h-4" />
              Quiz
              {cardsToReview.length > 0 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                  {cardsToReview.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === "topics" && (
              <>
                {/* View mode toggle */}
                <div className="flex border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-slate-100 dark:bg-slate-800"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${
                      viewMode === "list"
                        ? "bg-slate-100 dark:bg-slate-800"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <List className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </button>
                </div>

                {/* Add topic button */}
                <button
                  onClick={() => setShowAddTopic(true)}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Topic
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "topics" ? (
            <motion.div
              key="topics"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <LearningTracker
                topics={topics}
                flashcards={flashcards}
                viewMode={viewMode}
                onUpdateTopic={handleUpdateTopic}
                onDeleteTopic={handleDeleteTopic}
                onAddFlashcard={handleOpenAddFlashcard}
              />
            </motion.div>
          ) : (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <FlashcardQuiz
                flashcards={flashcards}
                topics={topics}
                onUpdateFlashcards={handleUpdateFlashcards}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modals */}
        <AddTopicModal
          isOpen={showAddTopic}
          onClose={() => setShowAddTopic(false)}
          onAdd={handleAddTopic}
        />
        <AddFlashcardModal
          isOpen={showAddFlashcard}
          onClose={() => {
            setShowAddFlashcard(false);
            setSelectedTopicId(null);
          }}
          onAdd={handleAddFlashcard}
          topics={topics}
          defaultTopicId={selectedTopicId}
        />
      </div>
    </div>
  );
}
