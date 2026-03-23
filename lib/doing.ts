import fs from "fs";
import path from "path";
import yaml from "js-yaml";

export interface DoingItem {
  date: string;
  title: string;
  description: string;
  tags: string[];
  status: "in-progress" | "completed" | "paused";
  link?: string;
}

const DOING_FILE = path.join(process.cwd(), "content", "doing", "updates.yaml");

export function getAllDoingItems(): DoingItem[] {
  if (!fs.existsSync(DOING_FILE)) {
    return [];
  }

  const fileContents = fs.readFileSync(DOING_FILE, "utf8");
  const items = yaml.load(fileContents) as DoingItem[] | null;

  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => ({
      date: item.date || new Date().toISOString().split("T")[0],
      title: item.title || "Untitled",
      description: item.description || "",
      tags: item.tags || [],
      status: item.status || "completed",
      link: item.link,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllDoingTags(): string[] {
  const items = getAllDoingItems();
  const tagSet = new Set<string>();
  items.forEach((item) => {
    item.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}
