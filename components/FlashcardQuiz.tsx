"use client";
/*
  Flashcard Quiz Component

  Interactive quiz with spaced repetition:
  - Shows cards due for review
  - Flip animation to reveal answers
  - Quality rating buttons (Again, Hard, Good, Easy)
  - Updates card intervals based on performance
*/

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  Check,
  X,
  Brain,
  Sparkles,
  ArrowRight,
  Trophy,
} from "lucide-react";
import {
  getCardsForReview,
  calculateNextReview,
  type Flashcard,
  type LearningTopic,
} from "@/lib/learning";

interface FlashcardQuizProps {
  flashcards: Flashcard[];
  topics: LearningTopic[];
  onUpdateFlashcards: (cards: Flashcard[]) => void;
}

// Rating options with their quality scores
const RATINGS = [
  { label: "Again", quality: 0, color: "red", description: "Completely forgot" },
  { label: "Hard", quality: 2, color: "amber", description: "Remembered with difficulty" },
  { label: "Good", quality: 4, color: "green", description: "Remembered correctly" },
  { label: "Easy", quality: 5, color: "blue", description: "Too easy" },
];

export function FlashcardQuiz({
  flashcards,
  topics,
  onUpdateFlashcards,
}: FlashcardQuizProps) {
  // Get cards due for review
  const cardsToReview = useMemo(() => getCardsForReview(flashcards), [flashcards]);

  // Quiz state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [quizMode, setQuizMode] = useState<"review" | "all">("review");

  // Get the current deck based on quiz mode
  const deck = quizMode === "review" ? cardsToReview : flashcards;
  const currentCard = deck[currentIndex];

  // Get topic name for current card
  const getTopicName = (topicId: string) => {
    const topic = topics.find((t) => t.id === topicId);
    return topic?.title || "Unknown";
  };

  // Handle rating selection
  const handleRate = (quality: number) => {
    if (!currentCard) return;

    // Calculate next review
    const { interval, easeFactor, repetitions } = calculateNextReview(
      currentCard,
      quality
    );

    // Calculate next review date
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    // Update the card
    const updatedCard: Flashcard = {
      ...currentCard,
      easeFactor,
      interval,
      repetitions,
      nextReview: nextReview.toISOString(),
      lastReview: new Date().toISOString(),
    };

    // Update flashcards array
    const updatedFlashcards = flashcards.map((card) =>
      card.id === currentCard.id ? updatedCard : card
    );
    onUpdateFlashcards(updatedFlashcards);

    // Move to next card
    setReviewedCount((prev) => prev + 1);
    setIsFlipped(false);

    // Check if we've reviewed all cards
    if (currentIndex >= deck.length - 1) {
      // Stay on last card to show completion
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Reset quiz
  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewedCount(0);
  };

  // Empty state - no cards
  if (flashcards.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <Brain className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
          No flashcards yet
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Add some flashcards to your topics to start quizzing yourself!
        </p>
      </div>
    );
  }

  // Completion state
  if (reviewedCount > 0 && currentIndex >= deck.length - 1 && !isFlipped) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <Trophy className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Great job!
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          You&apos;ve reviewed {reviewedCount} card{reviewedCount !== 1 ? "s" : ""} today.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleRestart}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Review Again
          </button>
        </div>
      </motion.div>
    );
  }

  // No cards due for review
  if (quizMode === "review" && cardsToReview.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
          All caught up!
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          No cards are due for review right now. Check back later!
        </p>
        <button
          onClick={() => setQuizMode("all")}
          className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg font-medium hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
        >
          Practice all cards anyway
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
          <span>
            Card {currentIndex + 1} of {deck.length}
          </span>
          <span>{reviewedCount} reviewed</span>
        </div>
        <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => {
            setQuizMode("review");
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            quizMode === "review"
              ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Due for Review ({cardsToReview.length})
        </button>
        <button
          onClick={() => {
            setQuizMode("all");
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            quizMode === "all"
              ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          All Cards ({flashcards.length})
        </button>
      </div>

      {/* Flashcard */}
      {currentCard && (
        <div className="perspective-1000">
          <motion.div
            className="relative w-full aspect-[3/2] cursor-pointer preserve-3d"
            onClick={() => setIsFlipped(!isFlipped)}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front (Question) */}
            <div
              className="absolute inset-0 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg p-8 flex flex-col items-center justify-center backface-hidden"
              style={{ backfaceVisibility: "hidden" }}
            >
              <span className="text-xs text-slate-500 mb-4 px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700">
                {getTopicName(currentCard.topicId)}
              </span>
              <p className="text-xl text-center font-medium text-slate-900 dark:text-white">
                {currentCard.question}
              </p>
              <p className="text-sm text-slate-500 mt-6 flex items-center gap-1">
                Click to reveal answer
                <ArrowRight className="w-4 h-4" />
              </p>
            </div>

            {/* Back (Answer) */}
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg p-8 flex flex-col items-center justify-center backface-hidden"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <span className="text-xs text-primary-200 mb-4 px-2 py-1 rounded-full bg-white/20">
                Answer
              </span>
              <p className="text-xl text-center font-medium text-white">
                {currentCard.answer}
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Rating buttons (show after flip) */}
      <AnimatePresence>
        {isFlipped && currentCard && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-8"
          >
            <p className="text-center text-sm text-slate-600 dark:text-slate-400 mb-4">
              How well did you know this?
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {RATINGS.map((rating) => (
                <button
                  key={rating.label}
                  onClick={() => handleRate(rating.quality)}
                  className={`
                    p-3 rounded-xl border-2 transition-all hover:scale-105
                    ${
                      rating.color === "red"
                        ? "border-red-200 dark:border-red-800 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        : rating.color === "amber"
                        ? "border-amber-200 dark:border-amber-800 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                        : rating.color === "green"
                        ? "border-green-200 dark:border-green-800 hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                        : "border-blue-200 dark:border-blue-800 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    }
                  `}
                >
                  <span
                    className={`
                      font-medium block mb-1
                      ${
                        rating.color === "red"
                          ? "text-red-600 dark:text-red-400"
                          : rating.color === "amber"
                          ? "text-amber-600 dark:text-amber-400"
                          : rating.color === "green"
                          ? "text-green-600 dark:text-green-400"
                          : "text-blue-600 dark:text-blue-400"
                      }
                    `}
                  >
                    {rating.label}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {rating.description}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard shortcuts hint */}
      <p className="text-center text-xs text-slate-400 mt-8">
        Press Space to flip • 1-4 to rate
      </p>
    </div>
  );
}
