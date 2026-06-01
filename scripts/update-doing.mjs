import fs from "fs";
import path from "path";
import yaml from "js-yaml";

// ---------------------------------------------------------------------------
// Sync "What I'm Doing" from GitHub public activity across ALL public repos.
//
// Instead of reading a single push event, this polls the GitHub public events
// API for the user and turns recent Push / Pull Request activity into entries
// in content/doing/updates.yaml.
//
// Runs on a schedule (see .github/workflows/update-doing.yml). A small state
// file (.sync-state.json) records which events have already been processed so
// re-runs never create duplicates. The first run "seeds" that state without
// backfilling, so existing hand/auto-curated history is left untouched.
// ---------------------------------------------------------------------------

const USER = process.env.GITHUB_USER || "Joshjessee";
const TOKEN = process.env.GITHUB_TOKEN;
const MAX_PAGES = 10;

const CONTENT_DIR = path.join(process.cwd(), "content", "doing");
const YAML_PATH = path.join(CONTENT_DIR, "updates.yaml");
const STATE_PATH = path.join(CONTENT_DIR, ".sync-state.json");

// --- Fetch public events (reverse-chronological, paginated) ----------------

async function fetchEvents() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": `${USER}-doing-sync`,
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

  const all = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = `https://api.github.com/users/${USER}/events/public?per_page=100&page=${page}`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.error(`GitHub API returned ${res.status} ${res.statusText}`);
      const body = await res.text();
      console.error(body.slice(0, 500));
      process.exit(1);
    }
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    // No "next" link means we've reached the end of the available feed.
    const link = res.headers.get("link") || "";
    if (!link.includes('rel="next"')) break;
  }
  return all;
}

// --- State (processed event ids) -------------------------------------------

function loadState() {
  if (fs.existsSync(STATE_PATH)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
      return {
        processedIds: Array.isArray(parsed.processedIds)
          ? parsed.processedIds
          : [],
      };
    } catch {
      // Fall through to fresh state.
    }
  }
  return { processedIds: null }; // null => first run (seed mode)
}

function saveState(processedIds) {
  // Keep the most recent ids only so the file stays small.
  const capped = processedIds.slice(0, 1000);
  fs.writeFileSync(
    STATE_PATH,
    JSON.stringify({ processedIds: capped }, null, 2) + "\n"
  );
}

// --- Turning events into doing entries -------------------------------------

const BOT_RE = /^\[auto\]|^Merge branch|^Merge remote-tracking/;

function repoShort(fullName) {
  return fullName.includes("/") ? fullName.split("/")[1] : fullName;
}

function detectTags(text, repoName) {
  const tags = new Set();
  const t = text.toLowerCase();

  if (/blog|post|content\/blog/.test(t)) tags.add("blog");
  if (/claude/.test(t)) tags.add("claude-code");
  if (/fix|bug/.test(t)) tags.add("bugfix");
  if (/style|css|tailwind|design|layout/.test(t)) tags.add("design");
  if (/deploy|ci|workflow|action/.test(t)) tags.add("devops");
  if (/docs|readme/.test(t)) tags.add("docs");

  // Always tag with the repo name so entries can be filtered by project.
  tags.add(repoShort(repoName));
  return Array.from(tags);
}

function dayOf(isoString) {
  return new Date(isoString).toISOString().split("T")[0];
}

// Collect new, unprocessed Push / PullRequest events grouped by repo + day.
function groupEvents(events, processedIds) {
  const seen = new Set(processedIds);
  const groups = new Map(); // key: `${date}__${repo}` -> group

  // Walk oldest-first so descriptions read chronologically within a day.
  for (const ev of [...events].reverse()) {
    if (seen.has(ev.id)) continue;
    if (ev.type !== "PushEvent" && ev.type !== "PullRequestEvent") continue;

    const repo = ev.repo?.name;
    if (!repo) continue;
    const date = dayOf(ev.created_at);
    const key = `${date}__${repo}`;
    if (!groups.has(key)) {
      groups.set(key, { date, repo, lines: [], commits: [], prs: [] });
    }
    const g = groups.get(key);

    if (ev.type === "PushEvent") {
      const commits = (ev.payload?.commits || []).filter(
        (c) => c.message && !BOT_RE.test(c.message)
      );
      for (const c of commits) {
        const subject = c.message.split("\n")[0];
        g.lines.push(`- ${subject}`);
        g.commits.push({ sha: c.sha, subject });
      }
    } else if (ev.type === "PullRequestEvent") {
      const action = ev.payload?.action;
      const pr = ev.payload?.pull_request;
      if (!pr) continue;
      if (action === "opened") {
        g.lines.push(`- Opened PR: ${pr.title}`);
        g.prs.push({ url: pr.html_url, verb: "Opened", title: pr.title });
      } else if (action === "closed" && pr.merged) {
        g.lines.push(`- Merged PR: ${pr.title}`);
        g.prs.push({ url: pr.html_url, verb: "Merged", title: pr.title });
      }
    }
  }

  // Drop groups that ended up with nothing meaningful (e.g. only bot commits).
  for (const [key, g] of groups) {
    if (g.lines.length === 0) groups.delete(key);
  }
  return groups;
}

function buildTitle(g) {
  const short = repoShort(g.repo);
  const total = g.commits.length + g.prs.length;
  if (total === 1) {
    if (g.commits.length === 1) {
      const s = g.commits[0].subject;
      return s.length > 72 ? s.slice(0, 69) + "..." : s;
    }
    const pr = g.prs[0];
    return `${pr.verb} PR in ${short}: ${pr.title}`.slice(0, 90);
  }
  return `${total} updates to ${short}`;
}

function buildLink(g) {
  if (g.commits.length === 1 && g.prs.length === 0) {
    return `https://github.com/${g.repo}/commit/${g.commits[0].sha}`;
  }
  if (g.prs.length === 1 && g.commits.length === 0) {
    return g.prs[0].url;
  }
  return `https://github.com/${g.repo}`;
}

// --- Main ------------------------------------------------------------------

async function main() {
  const events = await fetchEvents();
  console.log(`Fetched ${events.length} public event(s) for ${USER}.`);

  const state = loadState();

  // First run: seed the state with everything we currently see and exit
  // without backfilling, so existing curated history is preserved.
  if (state.processedIds === null) {
    const ids = events.map((e) => e.id);
    saveState(ids);
    console.log(
      `Seeded sync state with ${ids.length} event id(s). No backfill on first run.`
    );
    return;
  }

  const groups = groupEvents(events, state.processedIds);
  if (groups.size === 0) {
    console.log("No new push/PR activity to add.");
    // Still record any newly-seen event ids so the feed window stays fresh.
    const merged = [...events.map((e) => e.id), ...state.processedIds];
    saveState([...new Set(merged)]);
    return;
  }

  // Load existing YAML.
  let existing = [];
  if (fs.existsSync(YAML_PATH)) {
    existing = yaml.load(fs.readFileSync(YAML_PATH, "utf8")) || [];
  }
  if (!Array.isArray(existing)) existing = [];

  for (const g of groups.values()) {
    const short = repoShort(g.repo);
    const description = g.lines.join("\n");
    const tags = detectTags(g.lines.join(" "), g.repo);
    const link = buildLink(g);

    // Merge into an existing entry for the same day + same repo if present.
    const idx = existing.findIndex(
      (e) => e.date === g.date && (e.tags || []).includes(short)
    );

    if (idx !== -1) {
      const entry = existing[idx];
      entry.description = `${entry.description}\n${description}`;
      entry.tags = Array.from(new Set([...(entry.tags || []), ...tags]));
      entry.link = link;
    } else {
      existing.push({
        date: g.date,
        title: buildTitle(g),
        description,
        tags,
        status: "completed",
        link,
      });
    }
    console.log(`Added activity for ${short} on ${g.date}.`);
  }

  // Sort newest-first (the page also sorts, but keep the file tidy).
  existing.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  fs.writeFileSync(
    YAML_PATH,
    yaml.dump(existing, { lineWidth: -1, flowLevel: 2 })
  );

  // Record all currently-seen event ids as processed.
  const merged = [...events.map((e) => e.id), ...state.processedIds];
  saveState([...new Set(merged)]);

  console.log(`Wrote ${groups.size} group(s) to ${path.relative(process.cwd(), YAML_PATH)}.`);
}

// Only auto-run when invoked directly (allows importing helpers in tests).
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

export { groupEvents, buildTitle, buildLink, detectTags, repoShort };
