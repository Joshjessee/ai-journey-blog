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
  { title: "Words of Radiance", subtitle: "Brandon Sanderson", emoji: "💨", genre: "Fantasy" },
  { title: "Faith of the Fallen", subtitle: "Terry Goodkind", emoji: "⚔️", genre: "Fantasy" },
  { title: "Frankenstein", subtitle: "Mary Shelley", emoji: "⚡", genre: "Gothic" },
  { title: "Emperor's Soul", subtitle: "Brandon Sanderson", emoji: "🪄", genre: "Fantasy" },
  { title: "Rant", subtitle: "Chuck Palahniuk", emoji: "🦷", genre: "Fiction" },
  { title: "American Gods", subtitle: "Neil Gaiman", emoji: "🌑", genre: "Fantasy" },
];

// ─── Video Games ─────────────────────────────────────────────────────────────
const GAMES: MediaItem[] = [
  { title: "Half-Life 2", subtitle: "Valve", emoji: "🔴", genre: "FPS" },
  { title: "Kingdom Hearts", subtitle: "Square Enix", emoji: "🗝️", genre: "Action RPG" },
  { title: "God of War Ragnarök", subtitle: "Santa Monica", emoji: "🪓", genre: "Action" },
  { title: "Red Dead Redemption 2", subtitle: "Rockstar", emoji: "🤠", genre: "Open World" },
  { title: "Blue Prince", subtitle: "Dogubomb", emoji: "🔵", genre: "Puzzle" },
  { title: "BioShock", subtitle: "2K Games", emoji: "🌊", genre: "FPS" },
];

// ─── Movies ───────────────────────────────────────────────────────────────────
const MOVIES: MediaItem[] = [
  { title: "The Dark Knight", subtitle: "Christopher Nolan", emoji: "🦇", genre: "Action" },
  { title: "Jurassic Park", subtitle: "Steven Spielberg", emoji: "🦕", genre: "Sci-Fi" },
  { title: "Spider-Man: ATSV", subtitle: "Lord & Miller", emoji: "🕷️", genre: "Animation" },
  { title: "Lucky Number Slevin", subtitle: "Paul McGuigan", emoji: "🃏", genre: "Thriller" },
  { title: "The Hateful Eight", subtitle: "Quentin Tarantino", emoji: "❄️", genre: "Western" },
  { title: "The Prestige", subtitle: "Christopher Nolan", emoji: "🎩", genre: "Thriller" },
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
