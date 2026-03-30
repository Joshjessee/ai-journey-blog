import fs from "fs";
import path from "path";
import yaml from "js-yaml";

// Load push event payload
const event = JSON.parse(
  fs.readFileSync(process.env.GITHUB_EVENT_PATH, "utf8")
);

// Filter out bot commits
const commits = (event.commits || []).filter(
  (c) => !c.message.startsWith("[auto]")
);

if (commits.length === 0) {
  console.log("No non-bot commits found, skipping update.");
  process.exit(0);
}

const repo = process.env.GITHUB_REPOSITORY || "Joshjessee/ai-journey-blog";
const today = new Date().toISOString().split("T")[0];

// Auto-detect tags from commit messages
function detectTags(commits) {
  const tags = new Set();
  const text = commits.map((c) => c.message).join(" ").toLowerCase();

  if (/blog|post|content\/blog/.test(text)) tags.add("blog");
  if (/claude/.test(text)) tags.add("claude-code");
  if (/fix|bug/.test(text)) tags.add("bugfix");
  if (/style|css|tailwind|design|layout/.test(text)) tags.add("design");
  if (/deploy|ci|workflow|action/.test(text)) tags.add("devops");
  if (/docs|readme/.test(text)) tags.add("docs");

  return tags.size > 0 ? Array.from(tags) : ["github"];
}

// Build title from commits
function buildTitle(commits) {
  if (commits.length === 1) {
    const firstLine = commits[0].message.split("\n")[0];
    return firstLine.length > 72 ? firstLine.slice(0, 69) + "..." : firstLine;
  }
  return `${commits.length} updates to ai-journey-blog`;
}

// Build description as bullet list of commit first lines
function buildDescription(commits) {
  return commits.map((c) => `- ${c.message.split("\n")[0]}`).join("\n");
}

// Generate link
function buildLink(commits, event) {
  if (commits.length === 1) {
    return `https://github.com/${repo}/commit/${commits[0].id}`;
  }
  return `https://github.com/${repo}/compare/${event.before.slice(0, 7)}...${event.after.slice(0, 7)}`;
}

// Read existing YAML
const yamlPath = path.join(process.cwd(), "content", "doing", "updates.yaml");
let existing = [];

if (fs.existsSync(yamlPath)) {
  const content = fs.readFileSync(yamlPath, "utf8");
  existing = yaml.load(content) || [];
}

if (!Array.isArray(existing)) {
  existing = [];
}

const newTags = detectTags(commits);
const newDescription = buildDescription(commits);
const link = buildLink(commits, event);

// Check if entry for today already exists
const todayIndex = existing.findIndex((entry) => entry.date === today);

if (todayIndex !== -1) {
  // Update existing entry
  const entry = existing[todayIndex];
  entry.description = entry.description + "\n" + newDescription;
  // Merge tags (deduplicate)
  const mergedTags = new Set([...(entry.tags || []), ...newTags]);
  entry.tags = Array.from(mergedTags);
  entry.link = link;
} else {
  // Prepend new entry
  existing.unshift({
    date: today,
    title: buildTitle(commits),
    description: newDescription,
    tags: newTags,
    status: "completed",
    link: link,
  });
}

// Auto-complete stale in-progress entries with overlapping tags (older than 3 days)
const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split("T")[0];

for (const entry of existing) {
  if (
    entry.status === "in-progress" &&
    entry.date < threeDaysAgo &&
    entry.tags?.some((t) => newTags.includes(t))
  ) {
    console.log(`Auto-completing stale entry: "${entry.title}" (${entry.date})`);
    entry.status = "completed";
  }
}

// Write back
fs.writeFileSync(
  yamlPath,
  yaml.dump(existing, {
    lineWidth: -1,
    flowLevel: 2,
  })
);

console.log(`Updated doing log for ${today} with ${commits.length} commit(s).`);
