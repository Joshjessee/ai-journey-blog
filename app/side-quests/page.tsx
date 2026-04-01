/*
  Side Quests Page — Hobbies & Interests

  Rock climbing (photos coming soon), skydiving gallery,
  favorite books, video games, and movies.
*/

import { Metadata } from "next";
import { RockClimbingSection } from "@/components/side-quests/RockClimbingSection";
import { SkyDivingGallery } from "@/components/side-quests/SkyDivingGallery";
import { MediaGrid, MediaItem } from "@/components/side-quests/MediaGrid";

export const metadata: Metadata = {
  title: "Side Quests",
  description:
    "Rock climbing, skydiving, books, games, and movies — the adventures alongside the AI journey.",
};

// ─── Rock Climbing images ────────────────────────────────────────────────────
// Add your photos to /public/images/side-quests/rock-climbing/
// and name them rock-climbing-01.jpg through rock-climbing-05.jpg

const ROCK_CLIMBING_IMAGES = [
  {
    src: "/images/side-quests/rock-climbing/rock-climbing-01.jpg",
    alt: "Rock climbing on a sandstone cave overhang",
    caption: "Cave overhang",
  },
  {
    src: "/images/side-quests/rock-climbing/rock-climbing-02.jpg",
    alt: "Ice climbing on a blue ice wall",
    caption: "Ice climbing",
  },
  {
    src: "/images/side-quests/rock-climbing/rock-climbing-03.jpg",
    alt: "Bouldering on granite",
    caption: "Bouldering",
  },
  {
    src: "/images/side-quests/rock-climbing/rock-climbing-04.jpg",
    alt: "Sport climbing in a large cave arch",
    caption: "Cave arch sport route",
  },
  {
    src: "/images/side-quests/rock-climbing/rock-climbing-05.jpg",
    alt: "Fall climbing on a vertical face",
    caption: "Fall season climbing",
  },
];

// ─── Skydiving images ────────────────────────────────────────────────────────
// Add your photos to /public/images/side-quests/skydiving/
// and name them skydiving-01.jpg through skydiving-06.jpg

const SKYDIVING_IMAGES = [
  {
    src: "/images/side-quests/skydiving/skydiving-01.jpg",
    alt: "Skydiving in freefall",
    caption: "Freefall over the desert",
  },
  {
    src: "/images/side-quests/skydiving/skydiving-02.jpg",
    alt: "Exiting the aircraft",
    caption: "Exit from the Otter",
  },
  {
    src: "/images/side-quests/skydiving/skydiving-03.jpg",
    alt: "Formation skydiving with friends",
    caption: "3-way formation",
  },
  {
    src: "/images/side-quests/skydiving/skydiving-04.jpg",
    alt: "In the aircraft before the jump",
    caption: "Gearing up in the plane",
  },
  {
    src: "/images/side-quests/skydiving/skydiving-05.jpg",
    alt: "Selfie in freefall near a cloud",
    caption: "Above the clouds",
  },
  {
    src: "/images/side-quests/skydiving/skydiving-06.jpg",
    alt: "Skydiving action shot",
    caption: "Full send",
  },
];

// ─── Books ────────────────────────────────────────────────────────────────────
const BOOKS: MediaItem[] = [
  { title: "The Pragmatic Programmer", subtitle: "Hunt & Thomas", emoji: "💻", genre: "Tech" },
  { title: "Dune", subtitle: "Frank Herbert", emoji: "🏜️", genre: "Sci-Fi" },
  { title: "Atomic Habits", subtitle: "James Clear", emoji: "⚙️", genre: "Self-Help" },
  { title: "Project Hail Mary", subtitle: "Andy Weir", emoji: "🚀", genre: "Sci-Fi" },
  { title: "The Hitchhiker's Guide", subtitle: "Douglas Adams", emoji: "🌌", genre: "Humor" },
  { title: "Clean Code", subtitle: "Robert C. Martin", emoji: "✨", genre: "Tech" },
];

// ─── Video Games ─────────────────────────────────────────────────────────────
const GAMES: MediaItem[] = [
  { title: "Elden Ring", subtitle: "FromSoftware", emoji: "⚔️", genre: "Action RPG" },
  { title: "Zelda: BOTW", subtitle: "Nintendo", emoji: "🗡️", genre: "Adventure" },
  { title: "Hollow Knight", subtitle: "Team Cherry", emoji: "🦋", genre: "Metroidvania" },
  { title: "Stardew Valley", subtitle: "ConcernedApe", emoji: "🌾", genre: "Simulation" },
  { title: "Minecraft", subtitle: "Mojang", emoji: "⛏️", genre: "Sandbox" },
  { title: "Dark Souls", subtitle: "FromSoftware", emoji: "🔥", genre: "Action RPG" },
];

// ─── Movies ───────────────────────────────────────────────────────────────────
const MOVIES: MediaItem[] = [
  { title: "Interstellar", subtitle: "Christopher Nolan", emoji: "🪐", genre: "Sci-Fi" },
  { title: "The Matrix", subtitle: "The Wachowskis", emoji: "💊", genre: "Sci-Fi" },
  { title: "Mad Max: Fury Road", subtitle: "George Miller", emoji: "🔧", genre: "Action" },
  { title: "Arrival", subtitle: "Denis Villeneuve", emoji: "🛸", genre: "Sci-Fi" },
  { title: "Everything Everywhere", subtitle: "Daniels", emoji: "🥢", genre: "Drama" },
  { title: "Grand Budapest Hotel", subtitle: "Wes Anderson", emoji: "🏨", genre: "Comedy" },
];

export default function SideQuestsPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page header */}
        <div className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Side Quests
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Life beyond the terminal. The hobbies, adventures, and stories that
            fuel everything else.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-24">
          <RockClimbingSection images={ROCK_CLIMBING_IMAGES} />

          <SkyDivingGallery images={SKYDIVING_IMAGES} />

          <MediaGrid
            title="Favorite Books"
            headerEmoji="📚"
            items={BOOKS}
            accentColor="primary"
          />

          <MediaGrid
            title="Favorite Games"
            headerEmoji="🎮"
            items={GAMES}
            accentColor="accent"
          />

          <MediaGrid
            title="Favorite Movies"
            headerEmoji="🎬"
            items={MOVIES}
            accentColor="primary"
          />
        </div>
      </div>
    </div>
  );
}
