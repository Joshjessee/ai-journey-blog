import { getAllDoingItems, getAllDoingTags } from "@/lib/doing";
import { DoingList } from "@/components/DoingList";

export const metadata = {
  title: "What I'm Doing | AI Journey",
  description:
    "A daily log of what I'm working on — GitHub commits, Claude Code sessions, and everything in between.",
};

export default function DoingPage() {
  const items = getAllDoingItems();
  const tags = getAllDoingTags();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3 text-balance">
          What I&apos;m Doing
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          This is where I try to show what I'm working on. I had Claude connect my github so it automatically
          posts my commits everyday, I'm still very new to Github but I'm trying to use it everyday so I
          understand how it works.
        </p>
      </div>

      <DoingList items={items} tags={tags} />
    </div>
  );
}
