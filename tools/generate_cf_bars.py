#!/usr/bin/env python3
"""
generate_cf_bars.py
Fetches Codeforces solved problems for username `x2.0` and updates README.md
(creates a markdown table between markers <!-- CF-BAR-CHART:START --> and <!-- CF-BAR-CHART:END -->)
"""

import requests, sys, os, re
from collections import defaultdict

USERNAME = "x2.0"
README = "README.md"
START = "<!-- CF-BAR-CHART:START -->"
END = "<!-- CF-BAR-CHART:END -->"

# rating buckets (inclusive low, exclusive high except last)
BUCKETS = [
    (0, 1000, "800–999"),
    (1000, 1200, "1000–1199"),
    (1200, 1400, "1200–1399"),
    (1400, 1600, "1400–1599"),
    (1600, 1800, "1600–1799"),
    (1800, 2000, "1800–1999"),
    (2000, 2200, "2000–2199"),
    (2200, 10000, "2200+"),
]

def get_solved_problems(username):
    url = f"https://codeforces.com/api/user.status?handle={username}"
    r = requests.get(url, timeout=10)
    r.raise_for_status()
    js = r.json()
    if js["status"] != "OK":
        raise RuntimeError("CF API error")
    subs = js["result"]
    solved = {}
    for s in subs:
        if s.get("verdict") != "OK": continue
        prob = s["problem"]
        pid = f'{prob.get("contestId","")}-{prob.get("index","")}'
        # prefer max rating if not present
        if pid not in solved:
            solved[pid] = prob
    return list(solved.values())

def bucket_counts(problems):
    counts = defaultdict(int)
    for p in problems:
        rating = p.get("rating")
        if rating is None:
            # treat unknown as lowest
            rating = 0
        for low, high, label in BUCKETS:
            if low <= rating < high:
                counts[label] += 1
                break
    return counts

def render_markdown_table(counts):
    # normalize to max 20 blocks
    max_count = max(counts.values()) if counts else 1
    lines = []
    lines.append("| Rating bucket | Count | Visual |")
    lines.append("|---:|:---:|:---|")
    for low, high, label in BUCKETS:
        c = counts.get(label, 0)
        blocks = 0 if max_count == 0 else int((c / max_count) * 20)
        blocks = max(blocks, 1) if c>0 else 0
        visual = "▉" * blocks
        lines.append(f"|{label} | {c:3d} | {visual} |")
    return "\n".join(lines)

def replace_block(readme_text, new_block):
    pattern = re.compile(re.escape(START) + ".*?" + re.escape(END), re.S)
    repl = START + "\n" + new_block + "\n" + END
    if not pattern.search(readme_text):
        raise RuntimeError("Markers not found in README.md")
    return pattern.sub(repl, readme_text)

def main():
    print("Fetching solved problems from Codeforces...")
    problems = get_solved_problems(USERNAME)
    print(f"Unique solved problems fetched: {len(problems)}")
    counts = bucket_counts(problems)
    md_table = render_markdown_table(counts)
    # read README
    with open(README, "r", encoding="utf-8") as f:
        txt = f.read()
    new_txt = replace_block(txt, md_table)
    with open(README, "w", encoding="utf-8") as f:
        f.write(new_txt)
    print("README.md updated with new CF distribution table.")

if __name__ == "__main__":
    main()
