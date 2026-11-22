<h1 align="center">Awatansh Singh</h1>

<p align="center">
  <b>Applied AI · Backend · Systems</b><br/>
  <sub>I build verifiable agents and the infrastructure behind them.</sub>
</p>

<p align="center">
  <a href="https://awatansh.vercel.app"><img src="https://img.shields.io/badge/PORTFOLIO-0D1117?style=for-the-badge&logo=vercel&logoColor=white" alt="Portfolio" /></a>
  <a href="https://www.linkedin.com/in/awatansh-singh-9a0abb27b/"><img src="https://img.shields.io/badge/LINKEDIN-0D1117?style=for-the-badge&logo=linkedin&logoColor=67E8F9" alt="LinkedIn" /></a>
  <a href="mailto:awatanshsingh1@gmail.com"><img src="https://img.shields.io/badge/EMAIL-0D1117?style=for-the-badge&logo=gmail&logoColor=F472B6" alt="Email" /></a>
  <a href="https://x.com/AwatanshSingh"><img src="https://img.shields.io/badge/@AWATANSH-0D1117?style=for-the-badge&logo=x&logoColor=white" alt="X" /></a>
</p>

```console
awatansh@github:~$ profile --status
focus      verifiable agents / retrieval / evaluation / infrastructure
education  B.Tech Data Science @ IIIT Naya Raipur · 2027 · CGPA 9.1
background former Project Intern, Samsung PRISM · ICPC Asia West 2026 Regionalist
status     open to SDE / AI / ML internships
```

## What I build

I work where **applied AI meets backend engineering**. My projects are usually an agent or ML pipeline on top, with the less-visible parts underneath: retrieval, verification, queues, rate limits, observability and sandboxes.

| AI / ML | Backend | Systems |
|:---|:---|:---|
| RAG, tool-using agents, evaluation, OCR, tabular ML | FastAPI, Go, NestJS, PostgreSQL, Redis, WebSockets | asyncio, Redis Streams, cgroups, seccomp, Kubernetes, observability |

## Selected systems

<table>
<tr>
<td width="50%" valign="top">

### [Aegis Clinical Agent](https://github.com/Awatansh/aegis-clinical-agent)

**Clinical documents in. Verified claims out.**

```text
PDF → OCR → facts → ReAct → verify → summary
```

- Native extraction with 300-DPI OCR fallback
- Tools unlock in stages inside the agent loop
- Deterministic claim checks retain source provenance
- 72 drug-interaction checks · 133 tests

[**source**](https://github.com/Awatansh/aegis-clinical-agent) · [**live demo**](https://x2-0-aegis-clinical-agent.hf.space/)

`Python` `FastAPI` `Pydantic` `Tesseract`

</td>
<td width="50%" valign="top">

### [Incident Commander](https://github.com/Awatansh/meta-rl-hack)

**An incident-response environment for training agents.**

```text
incident → telemetry → action → deterministic score
```

- FastAPI environment across 5 Kubernetes services
- Prometheus metrics and Loki logs for investigation
- 381 evaluation scenarios with curriculum analytics
- Reported 50–66% lower model-training loss

[**source**](https://github.com/Awatansh/meta-rl-hack) · [**live demo**](https://x2-0-incident-commander.hf.space/showcase)

`Python` `Kubernetes` `Prometheus` `Loki`

</td>
</tr>
<tr>
<td width="50%" valign="top">

### [Meeting Pilot](https://github.com/Awatansh/Meeting-Pilot)

**Research before a meeting, assembled into a brief.**

```text
calendar → OSINT + Workspace MCP → RAG → brief
```

- 11-step async workflow on a Redis job queue
- OSINT and Google Workspace MCP subprocesses
- pgvector retrieval over email and document context
- Chrome extension checklist inside Google Meet

[**source**](https://github.com/Awatansh/Meeting-Pilot)

`Python` `FastAPI` `MCP` `pgvector` `Redis`

</td>
<td width="50%" valign="top">

### [AgentMEM](https://github.com/Awatansh/AgentMEM--Multi-agent-Event-Multiplexer)

**Shared memory and conflict detection for coding agents.**

```text
file edit → AST diff → conflict scan → MCP context
```

- asyncio daemon emits structural change events
- Detects same-symbol, shared-callee and dependency conflicts
- TTL locks, handoffs and token-budgeted context
- 101 tests across regression and scenario suites

[**source**](https://github.com/Awatansh/AgentMEM--Multi-agent-Event-Multiplexer)

`Python` `MCP` `tree-sitter` `FastAPI`

</td>
</tr>
</table>

<details>
<summary><b>+ 04 more builds — expand</b></summary>
<br/>

| Project | Engineering point |
|---|---|
| **[Relay](https://github.com/Awatansh/Relay-Agentic-Assistant)** | Cited PDF Q&A that predicts rate-limit wait before choosing a full, lean or zero-call path. 60/60 replies inside 15 s under a measured 10× overload. |
| **[CPJudge](https://github.com/Awatansh/CPJudge)** | Go online judge with Redis Streams workers, stale-job reclaim, cgroup v2 + seccomp sandboxing and live verdicts. |
| **[SecureFL-Q](https://github.com/Awatansh/SecureFL-Q)** | Federated learning with ML-KEM + AES-GCM updates, Shamir sharing written from scratch and Byzantine-client detection. |
| **[BrowserHigh](https://github.com/Awatansh/BrowserHigh---AI-Browser-Activity-Intelligence-Platform)** | Chrome event capture into ClickHouse through BullMQ, queried by a tenant-scoped tool-calling agent. |

</details>

## Experience

| When | Work |
|---|---|
| **2025–26** | **Samsung PRISM · Project Intern**<br/>Predicted compressibility of OS memory pages for zram/zswap. Used fast entropy and pattern features first, then sampled compression for uncertain decisions. **Reported 97% accuracy.** |
| **2025** | **IIIT Naya Raipur · Software Development Intern**<br/>Built and deployed the [Alumni Portal](https://alumni.iiitnr.ac.in/) with React, Express and PostgreSQL: role-based access, encrypted real-time messaging and Google OAuth. |

## Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=py,go,cpp,ts,react,nextjs,nodejs,nestjs,fastapi,postgres,redis,docker,kubernetes,prometheus,linux,pytorch,sklearn,git&perline=9" alt="Python, Go, C++, TypeScript, React, Next.js, Node.js, NestJS, FastAPI, PostgreSQL, Redis, Docker, Kubernetes, Prometheus, Linux, PyTorch, scikit-learn and Git" />
</p>

<p align="center">
  <code>RAG</code> · <code>MCP</code> · <code>ClickHouse</code> · <code>WebSockets</code> · <code>cgroup v2</code> · <code>seccomp</code> · <code>OCR</code>
</p>

## Checkpoints

🏁 **ICPC Asia West 2026 Regionalist** &nbsp;·&nbsp; 🥇 **Winner, NITS HACK 8.0** &nbsp;·&nbsp; 🏆 **OpenEnv Hackathon finalist**

🎯 **Flipkart GRID 8.0 semi-finalist** &nbsp;·&nbsp; 🌍 **Meta Hacker Cup 2025 Round 2 — global rank 1972**

<p align="center">
  <a href="https://codeforces.com/profile/x2.0"><img src="https://img.shields.io/badge/Codeforces-Expert%20·%201641-1F8ACB?style=flat-square&logo=codeforces&logoColor=white" alt="Codeforces Expert 1641" /></a>
  <a href="https://www.codechef.com/users/notawatansh"><img src="https://img.shields.io/badge/CodeChef-4★%20·%201889-5B4638?style=flat-square&logo=codechef&logoColor=white" alt="CodeChef 4 star 1889" /></a>
  <a href="https://leetcode.com/u/X2-0/"><img src="https://img.shields.io/badge/LeetCode-Guardian%20·%202160-FFA116?style=flat-square&logo=leetcode&logoColor=black" alt="LeetCode Guardian 2160" /></a>
</p>

<br/>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/Awatansh/awatansh/output/github-snake-dark.svg" />
  <img src="https://raw.githubusercontent.com/Awatansh/awatansh/output/github-snake.svg" alt="Contribution graph animation" />
</picture>

<p align="center">
  <sub><code>build → measure → break → fix → ship</code></sub>
</p>
