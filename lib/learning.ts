/*
  Learning System Types and Utilities

  This file defines the data structures for:
  - Topics you've learned
  - Flashcards for quizzing
  - Spaced repetition algorithm (SM-2 variant)

  The data is stored in localStorage for persistence.
*/

// A topic/concept you've learned
export interface LearningTopic {
  id: string;
  title: string;
  description: string;
  category: string;
  dateAdded: string;
  mastery: number; // 0-100 percentage
  notes?: string;
}

// A flashcard for quizzing
export interface Flashcard {
  id: string;
  topicId: string;
  question: string;
  answer: string;
  // Spaced repetition fields
  easeFactor: number; // How easy the card is (starts at 2.5)
  interval: number; // Days until next review
  repetitions: number; // Number of successful reviews
  nextReview: string; // ISO date string
  lastReview?: string;
}

// Quiz result for a single card
export interface QuizResult {
  cardId: string;
  quality: number; // 0-5 rating (0=complete blackout, 5=perfect)
  timestamp: string;
}

// Learning progress statistics
export interface LearningStats {
  totalTopics: number;
  totalCards: number;
  cardsToReview: number;
  averageMastery: number;
  streakDays: number;
}

/*
  Spaced Repetition Algorithm (SM-2 variant)

  This is a simplified version of the SuperMemo 2 algorithm.
  It calculates when to next review a card based on how well you knew it.

  Quality ratings:
  0 - Complete blackout, didn't know at all
  1 - Incorrect, but recognized the answer
  2 - Incorrect, but answer seemed easy to recall
  3 - Correct with serious difficulty
  4 - Correct with some hesitation
  5 - Perfect response
*/
export function calculateNextReview(
  card: Flashcard,
  quality: number // 0-5
): { interval: number; easeFactor: number; repetitions: number } {
  let { easeFactor, interval, repetitions } = card;

  // If quality < 3, restart learning (card was forgotten)
  if (quality < 3) {
    repetitions = 0;
    interval = 1; // Review tomorrow
  } else {
    // Successful recall
    if (repetitions === 0) {
      interval = 1; // First success: review tomorrow
    } else if (repetitions === 1) {
      interval = 6; // Second success: review in 6 days
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Update ease factor (minimum 1.3)
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  return { interval, easeFactor, repetitions };
}

/*
  Get cards that are due for review
*/
export function getCardsForReview(cards: Flashcard[]): Flashcard[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return cards.filter((card) => {
    const reviewDate = new Date(card.nextReview);
    reviewDate.setHours(0, 0, 0, 0);
    return reviewDate <= today;
  });
}

/*
  LocalStorage keys
*/
export const STORAGE_KEYS = {
  topics: "ai-journey-topics",
  flashcards: "ai-journey-flashcards",
  quizHistory: "ai-journey-quiz-history",
  lastVisit: "ai-journey-last-visit",
};

/*
  Load data from localStorage
*/
export function loadTopics(): LearningTopic[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.topics);
  return data ? JSON.parse(data) : [];
}

export function loadFlashcards(): Flashcard[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.flashcards);
  return data ? JSON.parse(data) : [];
}

/*
  Save data to localStorage
*/
export function saveTopics(topics: LearningTopic[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.topics, JSON.stringify(topics));
}

export function saveFlashcards(cards: Flashcard[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.flashcards, JSON.stringify(cards));
}

/*
  Generate a unique ID
*/
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/*
  Create a new flashcard with default spaced repetition values
*/
export function createFlashcard(
  topicId: string,
  question: string,
  answer: string
): Flashcard {
  return {
    id: generateId(),
    topicId,
    question,
    answer,
    easeFactor: 2.5, // Default ease factor
    interval: 0,
    repetitions: 0,
    nextReview: new Date().toISOString(), // Due immediately
  };
}

/*
  Calculate learning statistics
*/
export function calculateStats(
  topics: LearningTopic[],
  cards: Flashcard[]
): LearningStats {
  const cardsToReview = getCardsForReview(cards).length;
  const averageMastery =
    topics.length > 0
      ? topics.reduce((sum, t) => sum + t.mastery, 0) / topics.length
      : 0;

  return {
    totalTopics: topics.length,
    totalCards: cards.length,
    cardsToReview,
    averageMastery: Math.round(averageMastery),
    streakDays: 0, // TODO: implement streak tracking
  };
}

/*
  Categories for organizing topics
*/
export const CATEGORIES = [
  "Python",
  "Machine Learning",
  "Deep Learning",
  "NLP",
  "Computer Vision",
  "Math",
  "Data Science",
  "Prompt Engineering",
  "Tools & Libraries",
  "Other",
];
