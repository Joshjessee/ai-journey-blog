"use client";
/*
  Learning Tracker Component

  Displays all topics you've learned with:
  - Grid or list view
  - Mastery progress bars
  - Edit and delete functionality
  - Flashcard counts
*/

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Brain,
  Edit2,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  X,
  Check,
} from "lucide-react";
import type { LearningTopic, Flashcard } from "@/lib/learning";
import { CATEGORIES } from "@/lib/learning";

interface LearningTrackerProps {
  topics: LearningTopic[];
  flashcards: Flashcard[];
  viewMode: "grid" | "list";
  onUpdateTopic: (topic: LearningTopic) => void;
  onDeleteTopic: (topicId: string) => void;
  onAddFlashcard: (topicId: string) => void;
}

export function LearningTracker({
  topics,
  flashcards,
  viewMode,
  onUpdateTopic,
  onDeleteTopic,
  onAddFlashcard,
}: LearningTrackerProps) {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [editingTopic, setEditingTopic] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<LearningTopic>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Group topics by category
  const topicsByCategory = topics.reduce((acc, topic) => {
    const category = topic.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(topic);
    return acc;
  }, {} as Record<string, LearningTopic[]>);

  // Get flashcard count for a topic
  const getFlashcardCount = (topicId: string) =>
    flashcards.filter((f) => f.topicId === topicId).length;

  // Handle edit
  const handleStartEdit = (topic: LearningTopic) => {
    setEditingTopic(topic.id);
    setEditForm(topic);
  };

  const handleSaveEdit = () => {
    if (editingTopic && editForm.title) {
      onUpdateTopic(editForm as LearningTopic);
      setEditingTopic(null);
      setEditForm({});
    }
  };

  const handleCancelEdit = () => {
    setEditingTopic(null);
    setEditForm({});
  };

  // Handle delete
  const handleDelete = (topicId: string) => {
    onDeleteTopic(topicId);
    setDeleteConfirm(null);
  };

  // Empty state
  if (topics.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
          No topics yet
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Start by adding something you&apos;ve learned!
        </p>
      </div>
    );
  }

  // Grid view
  if (viewMode === "grid") {
    return (
      <div className="space-y-8">
        {Object.entries(topicsByCategory).map(([category, categoryTopics]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-500" />
              {category}
              <span className="text-sm font-normal text-slate-500">
                ({categoryTopics.length})
              </span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryTopics.map((topic, index) => {
                const cardCount = getFlashcardCount(topic.id);
                const isEditing = editingTopic === topic.id;
                const isDeleting = deleteConfirm === topic.id;

                return (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all"
                  >
                    {/* Delete confirmation overlay */}
                    <AnimatePresence>
                      {isDeleting && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 z-10 rounded-xl bg-white dark:bg-slate-800 flex flex-col items-center justify-center p-4"
                        >
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 text-center">
                            Delete &quot;{topic.title}&quot; and its {cardCount} flashcards?
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleDelete(topic.id)}
                              className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {isEditing ? (
                      // Edit form
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editForm.title || ""}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Topic title"
                        />
                        <textarea
                          value={editForm.description || ""}
                          onChange={(e) =>
                            setEditForm({ ...editForm, description: e.target.value })
                          }
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Description"
                          rows={2}
                        />
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-slate-600 dark:text-slate-400">
                            Mastery:
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={editForm.mastery || 0}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                mastery: parseInt(e.target.value),
                              })
                            }
                            className="flex-1"
                          />
                          <span className="text-sm font-medium text-slate-900 dark:text-white w-10">
                            {editForm.mastery}%
                          </span>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={handleCancelEdit}
                            className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleSaveEdit}
                            className="p-1.5 text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Display view
                      <>
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-slate-900 dark:text-white">
                            {topic.title}
                          </h4>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button
                              onClick={() => handleStartEdit(topic)}
                              className="p-1 text-slate-400 hover:text-primary-600 rounded transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(topic.id)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                          {topic.description}
                        </p>

                        {/* Mastery bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>Mastery</span>
                            <span>{topic.mastery}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${topic.mastery}%` }}
                              transition={{ duration: 0.5, delay: index * 0.05 }}
                              className={`h-full rounded-full ${
                                topic.mastery >= 80
                                  ? "bg-green-500"
                                  : topic.mastery >= 50
                                  ? "bg-amber-500"
                                  : "bg-primary-500"
                              }`}
                            />
                          </div>
                        </div>

                        {/* Flashcard count and add button */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Brain className="w-3.5 h-3.5" />
                            {cardCount} card{cardCount !== 1 ? "s" : ""}
                          </span>
                          <button
                            onClick={() => onAddFlashcard(topic.id)}
                            className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add card
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-2">
      {topics.map((topic, index) => {
        const cardCount = getFlashcardCount(topic.id);
        const isExpanded = expandedTopic === topic.id;

        return (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <div
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">
                    {topic.title}
                  </h4>
                  <p className="text-sm text-slate-500">
                    {topic.category} • {cardCount} cards
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        topic.mastery >= 80
                          ? "bg-green-500"
                          : topic.mastery >= 50
                          ? "bg-amber-500"
                          : "bg-primary-500"
                      }`}
                      style={{ width: `${topic.mastery}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-500 w-10">
                    {topic.mastery}%
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-slate-200 dark:border-slate-700"
                >
                  <div className="p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      {topic.description}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddFlashcard(topic.id);
                        }}
                        className="px-3 py-1.5 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add Flashcard
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(topic);
                        }}
                        className="px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm(topic.id);
                        }}
                        className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
