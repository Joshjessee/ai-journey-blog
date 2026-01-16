"use client";
/*
  Add Flashcard Modal

  A modal form for adding new flashcards with:
  - Topic selection
  - Question and answer fields
  - Preview of how the card will look
*/

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Brain, HelpCircle, Lightbulb } from "lucide-react";
import { createFlashcard, type Flashcard, type LearningTopic } from "@/lib/learning";

interface AddFlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (card: Flashcard) => void;
  topics: LearningTopic[];
  defaultTopicId?: string | null;
}

export function AddFlashcardModal({
  isOpen,
  onClose,
  onAdd,
  topics,
  defaultTopicId,
}: AddFlashcardModalProps) {
  const [topicId, setTopicId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // Set default topic when modal opens
  useEffect(() => {
    if (isOpen && defaultTopicId) {
      setTopicId(defaultTopicId);
    } else if (isOpen && topics.length > 0) {
      setTopicId(topics[0].id);
    }
  }, [isOpen, defaultTopicId, topics]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!topicId || !question.trim() || !answer.trim()) return;

    const newCard = createFlashcard(topicId, question.trim(), answer.trim());
    onAdd(newCard);

    // Reset form
    setQuestion("");
    setAnswer("");
    setShowPreview(false);
  };

  // Get topic name
  const getTopicName = (id: string) => {
    const topic = topics.find((t) => t.id === id);
    return topic?.title || "Unknown";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-[5%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-lg z-50 max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Add Flashcard
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                {/* Topic selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Topic *
                  </label>
                  {topics.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">
                      No topics yet. Add a topic first!
                    </p>
                  ) : (
                    <select
                      value={topicId}
                      onChange={(e) => setTopicId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      {topics.map((topic) => (
                        <option key={topic.id} value={topic.id}>
                          {topic.title} ({topic.category})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Question */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    <span className="flex items-center gap-1">
                      <HelpCircle className="w-4 h-4" />
                      Question *
                    </span>
                  </label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="What is gradient descent?"
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                {/* Answer */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    <span className="flex items-center gap-1">
                      <Lightbulb className="w-4 h-4" />
                      Answer *
                    </span>
                  </label>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="An optimization algorithm that minimizes the loss function by iteratively moving in the direction of steepest descent."
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                {/* Preview toggle */}
                {question && answer && (
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    {showPreview ? "Hide Preview" : "Show Preview"}
                  </button>
                )}

                {/* Preview */}
                <AnimatePresence>
                  {showPreview && question && answer && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 space-y-3">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">
                          Preview
                        </p>
                        <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600">
                          <p className="text-xs text-slate-500 mb-1">Question</p>
                          <p className="text-slate-900 dark:text-white">{question}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                          <p className="text-xs text-primary-600 dark:text-primary-400 mb-1">
                            Answer
                          </p>
                          <p className="text-primary-900 dark:text-primary-100">{answer}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tips */}
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Tip:</strong> Write questions that test understanding, not just memorization.
                    Ask &quot;why&quot; and &quot;how&quot; questions!
                  </p>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={topics.length === 0}
                    className="px-4 py-2 text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Flashcard
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
