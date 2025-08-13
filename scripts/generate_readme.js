import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.join(__dirname, "..");
const assetsDir = path.join(repoRoot, "assets");
const templatePath = path.join(repoRoot, "README_template.md");
const outputPath = path.join(repoRoot, "README.md");

function safeReadJSON(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

const tmpl = fs.readFileSync(templatePath, "utf8");

// usernames.json is required; fall back to empty strings but don't crash
const usernames = safeReadJSON(path.join(assetsDir, "usernames.json"), {
  codeforces: "",
  codechef: "",
  leetcode: "",
  atcoder: "",
  github: ""
});

const lc = safeReadJSON(path.join(assetsDir, "lc_stats.json"), { totalSolved: 0 });
const ac = safeReadJSON(path.join(assetsDir, "ac_stats.json"), { latestRating: null });
const ghLangs = safeReadJSON(path.join(assetsDir, "gh_langs.json"), {});
const ghPins = safeReadJSON(path.join(assetsDir, "gh_pins.json"), { pins: [] });

function langsTable(dist) {
  const entries = Object.entries(dist);
  if (!entries.length) return "_(no data)_";
  const header = "| Language | % |\n|---|---|\n";
  const rows = entries.map(([k, v]) => `| ${k} | ${v}% |`).join("\n");
  return header + rows;
}

function pinsList(pins) {
  if (!pins?.pins?.length) return "_(no pinned repos or missing GH_TOKEN)_";
  return pins.pins
    .map((p) => {
      const bits = [];
      if (p.language) bits.push(p.language);
      if (Number.isFinite(p.stars)) bits.push(`⭐ ${p.stars}`);
      const meta = bits.length ? ` • ${bits.join(" • ")}` : "";
      const desc = p.description ? `\n  - ${p.description}` : "";
      return `- [**${p.name}**](${p.url})${meta}${desc}`;
    })
    .join("\n");
}

const out = tmpl
  .replaceAll("${cf}", encodeURIComponent(usernames.codeforces || ""))
  .replaceAll("${cc}", encodeURIComponent(usernames.codechef || ""))
  .replaceAll("${lc}", encodeURIComponent(usernames.leetcode || ""))
  .replaceAll("${ac}", encodeURIComponent(usernames.atcoder || ""))
  .replaceAll("${lc_total_solved}", String(lc.totalSolved ?? 0))
  .replaceAll(
    "${ac_latest_rating}",
    ac.latestRating === null ? "_" : String(ac.latestRating)
  )
  .replaceAll("${gh_langs_table}", langsTable(ghLangs))
  .replaceAll("${gh_pins_list}", pinsList(ghPins))
  .replaceAll(
    "${updated_at}",
    new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
  );

fs.writeFileSync(outputPath, out);
console.log("✅ README.md generated");
