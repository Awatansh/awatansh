import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
// no Chart import; no registerables; no chartCallback

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.join(__dirname, "..");
const assetsDir = path.join(repoRoot, "assets");
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

const usernames = JSON.parse(
  fs.readFileSync(path.join(assetsDir, "usernames.json"), "utf8")
);

const GH_TOKEN = process.env.GH_TOKEN || "";

// ---------- Helpers ----------
function writeJSON(file, data) {
  fs.writeFileSync(path.join(assetsDir, file), JSON.stringify(data, null, 2));
}

function safeNum(n, fallback = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
}

// ---------- Codeforces ----------
async function fetchCodeforcesSolvedByRating(handle) {
  if (!handle) {
    writeJSON("cf_stats.json", {});
    return;
  }
  try {
    const r = await fetch(
      `https://codeforces.com/api/user.status?handle=${encodeURIComponent(
        handle
      )}&from=1&count=10000`
    );
    const j = await r.json();
    if (j.status !== "OK") throw new Error("CF API error");
    const solved = {};
    for (const sub of j.result) {
      const ok = sub?.verdict === "OK";
      const rt = sub?.problem?.rating;
      if (ok && rt) {
        const key = String(rt);
        solved[key] = (solved[key] || 0) + 1;
      }
    }
    writeJSON("cf_stats.json", solved);
    await renderCFChart(solved);
  } catch (e) {
    console.error("CF fetch failed:", e?.message || e);
    writeJSON("cf_stats.json", {});
  }
}

async function renderCFChart(stats) {
  const width = 900,
    height = 420;
  const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width,
  height,
  backgroundColour: "white",
});


  const labels = Object.keys(stats)
    .map((x) => +x)
    .sort((a, b) => a - b)
    .map(String);
  const data = labels.map((l) => stats[l] || 0);

 const cfColors = [
  "#808080", // Gray for 800-999
  "#808080",
  "#808080",
  "#008000", // Green for 1200-1399
  "#008000",
  "#03A89E", // Cyan for 1400-1599
  "#03A89E",
  "#0000FF", // Blue for 1600-1799
  "#0000FF",
  "#AA00AA", // Purple for 1900-2099
  "#AA00AA",
  "#FF8C00", // Orange for 2200+
];

const config = {
  type: "bar",
  data: {
    labels,
    datasets: [
      {
        label: "Problems Solved",
        data,
        backgroundColor: labels.map((rating) => {
          const r = parseInt(rating, 10);
          if (r < 1200) return "#808080";   // Gray
          if (r < 1400) return "#008000";   // Green
          if (r < 1600) return "#03A89E";   // Cyan
          if (r < 1800) return "#0000FF";   // Blue
          if (r < 2100) return "#AA00AA";   // Purple
          return "#FF8C00";                 // Orange
        }),
        borderColor: "#000000",
        borderWidth: 1
      },
    ],
  },
  options: {
    plugins: { 
      legend: { display: false },
      title: { display: true, text: "Codeforces: Problems solved by rating" }
    },
    scales: {
      x: { title: { display: true, text: "Codeforces Rating" } },
      y: { title: { display: true, text: "Solved" }, beginAtZero: true },
    },
  },
};


  const buf = await chartJSNodeCanvas.renderToBuffer(config);
  fs.writeFileSync(path.join(assetsDir, "cf_rating_chart.png"), buf);
}

// ---------- LeetCode (GraphQL) ----------
async function fetchLeetCodeTotalSolved(username) {
  if (!username) {
    writeJSON("lc_stats.json", { totalSolved: 0 });
    return;
  }
  const body = {
    query: `
      query user($username: String!) {
        matchedUser(username: $username) {
          submitStats: submitStatsGlobal {
            acSubmissionNum { difficulty, count }
          }
        }
      }`,
    variables: { username },
  };

  try {
    const r = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        // LeetCode sometimes expects a browser-like referer
        referer: "https://leetcode.com",
        origin: "https://leetcode.com",
      },
      body: JSON.stringify(body),
    });
    const j = await r.json();
    const arr = j?.data?.matchedUser?.submitStats?.acSubmissionNum || [];
    const all = arr.find((x) => x.difficulty === "All");
    const total = safeNum(all?.count, 0);
    writeJSON("lc_stats.json", { totalSolved: total });
  } catch (e) {
    console.error("LC fetch failed:", e?.message || e);
    writeJSON("lc_stats.json", { totalSolved: 0 });
  }
}

// ---------- AtCoder (official endpoints) ----------
async function fetchAtCoderRating(username) {
  if (!username) {
    writeJSON("ac_stats.json", { latestRating: null });
    return;
  }
  try {
    const r = await fetch(
      `https://atcoder.jp/users/${encodeURIComponent(username)}/history/json`
    );
    const arr = await r.json();
    if (!Array.isArray(arr) || !arr.length) {
      writeJSON("ac_stats.json", { latestRating: null });
      return;
    }
    const last = arr[arr.length - 1];
    // handle different key casings seen in the wild
    const rating =
      safeNum(last.NewRating, NaN) ??
      safeNum(last.New_Rating, NaN) ??
      safeNum(last.newRating, NaN);
    writeJSON("ac_stats.json", {
      latestRating: Number.isFinite(rating) ? rating : null,
    });
  } catch (e) {
    console.error("AtCoder fetch failed:", e?.message || e);
    writeJSON("ac_stats.json", { latestRating: null });
  }
}

// ---------- GitHub: language distribution (REST) ----------
async function fetchGitHubLangs(user) {
  if (!user) {
    writeJSON("gh_langs.json", {});
    return;
  }
  try {
    const r = await fetch(
      `https://api.github.com/users/${encodeURIComponent(
        user
      )}/repos?per_page=100&type=owner&sort=updated`,
      {
        headers: GH_TOKEN ? { Authorization: `Bearer ${GH_TOKEN}` } : {},
      }
    );
    const repos = await r.json();
    const counts = {};
    for (const repo of Array.isArray(repos) ? repos : []) {
      if (repo?.language) counts[repo.language] = (counts[repo.language] || 0) + 1;
    }
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    const dist = Object.fromEntries(
      Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([k, v]) => [k, +(100 * (v / total)).toFixed(1)])
    );
    writeJSON("gh_langs.json", dist);
  } catch (e) {
    console.error("GitHub langs failed:", e?.message || e);
    writeJSON("gh_langs.json", {});
  }
}

// ---------- GitHub: pinned repositories (GraphQL, optional) ----------
async function fetchGitHubPinned(user) {
  if (!user || !GH_TOKEN) {
    writeJSON("gh_pins.json", { pins: [] });
    return;
  }
  const body = {
    query: `
      query($login: String!) {
        user(login: $login) {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                name
                description
                stargazerCount
                primaryLanguage { name }
                url
              }
            }
          }
        }
      }`,
    variables: { login: user },
  };
  try {
    const r = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${GH_TOKEN}`,
      },
      body: JSON.stringify(body),
    });
    const j = await r.json();
    const nodes = j?.data?.user?.pinnedItems?.nodes || [];
    const pins = nodes.map((n) => ({
      name: n.name,
      description: n.description || "",
      stars: n.stargazerCount || 0,
      language: n.primaryLanguage?.name || "",
      url: n.url,
    }));
    writeJSON("gh_pins.json", { pins });
  } catch (e) {
    console.error("GitHub pins failed:", e?.message || e);
    writeJSON("gh_pins.json", { pins: [] });
  }
}

// ---------- Run all ----------
(async () => {
  await fetchCodeforcesSolvedByRating(usernames.codeforces);
  await fetchLeetCodeTotalSolved(usernames.leetcode);
  await fetchAtCoderRating(usernames.atcoder);
  await fetchGitHubLangs(usernames.github);
  await fetchGitHubPinned(usernames.github);
  console.log("✅ fetched all stats");
})();
