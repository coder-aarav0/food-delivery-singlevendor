# 🚀 Universal AI Agent Stack: Master Setup & Reuse Playbook

> **Master Template**: This playbook is designed to be **100% portable and reusable**. Whenever you start a new software project (web app, backend, AI agent, or full-stack platform), follow this guide to replicate the complete MCP, CLI, and Agent Skills environment in minutes.

---

## ⚡ 1. One-Click Bootstrap Scripts

You can bootstrap this entire environment in any new repository with a single terminal command.

### 🪟 Windows (PowerShell)
Run from the root of any new project:
```powershell
# 1. Initialize npm & install project dev dependencies
npm init -y
npm install agentation -D

# 2. Install global CLI engines & memory tools
npm install -g memvid-cli
uv tool install graphify-mcp

# 3. Install all 11 curated Skill packs (169 skills total)
npx skills add nextlevelbuilder/ui-ux-pro-max-skill
npx skills add ibelick/ui-skills
npx skills add Jakubantalik/transitions.dev
npx skills add anthropics/skills
npx skills add cosai-oasis/project-codeguard
npx skills add UnitOneAI/SecuritySkills
npx skills add OWASP/secure-agent-playbook
npx skills add olanokhin/agent-security-skill
npx skills add proyecto26/system-design-skills
npx add-skill https://github.com/Jeffallan/claude-skills/tree/main/skills/architecture-designer
npx skills add softaworks/agent-toolkit

# 4. Initialize Agent Instruction Markdown Files (AGENTS.md / GEMINI.md)
if (-not (Test-Path "AGENTS.md")) { New-Item -ItemType File -Name "AGENTS.md" }
if (-not (Test-Path "GEMINI.md")) { New-Item -ItemType File -Name "GEMINI.md" }
```

### 🐧 macOS / Linux (Bash)
```bash
# 1. Initialize npm & install project dev dependencies
npm init -y
npm install agentation -D

# 2. Install global CLI engines & memory tools
npm install -g memvid-cli
uv tool install graphify-mcp

# 3. Install all 11 curated Skill packs
npx skills add nextlevelbuilder/ui-ux-pro-max-skill
npx skills add ibelick/ui-skills
npx skills add Jakubantalik/transitions.dev
npx skills add anthropics/skills
npx skills add cosai-oasis/project-codeguard
npx skills add UnitOneAI/SecuritySkills
npx skills add OWASP/secure-agent-playbook
npx skills add olanokhin/agent-security-skill
npx skills add proyecto26/system-design-skills
npx add-skill https://github.com/Jeffallan/claude-skills/tree/main/skills/architecture-designer
npx skills add softaworks/agent-toolkit

# 4. Initialize Agent Instruction Markdown Files (AGENTS.md / GEMINI.md)
[ ! -f "AGENTS.md" ] && touch AGENTS.md
[ ! -f "GEMINI.md" ] && touch GEMINI.md
```

---

## 🔌 2. Configured MCP (Model Context Protocol) Servers

MCP servers provide AI agents with direct superpowers: interacting with GitHub (without Docker), querying UI libraries, extracting typography from images, checking visual annotations, managing databases, and deploying code.

### Summary Table

| Server | Type | GitHub / Official URL | Installation / Execution Command | Required Secrets / Config |
| :--- | :--- | :--- | :--- | :--- |
| **`github`** | Local Node | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers/tree/main/src/github) | `npx -y @modelcontextprotocol/server-github` | `GITHUB_PERSONAL_ACCESS_TOKEN` (Fine-grained or Classic PAT) |
| **`agentation`** | Local Node | [agentation.com](https://www.agentation.com/) / [Docs](https://www.agentation.com/install) | `npx -y agentation-mcp server` | Client component: `npm install agentation -D` |
| **`21st`** | Remote SSE | [21st.dev](https://21st.dev/) | Remote: `https://21st.dev/api/mcp` | Header: `x-api-key: <21ST_API_KEY>` |
| **`ui-skills`** | Remote HTTP | [ui-skills.com](https://www.ui-skills.com/) / [GitHub](https://github.com/ibelick/ui-skills) | Remote: `https://www.ui-skills.com/mcp` | None (Public HTTP endpoint) |
| **`whatfontis`** | Local Node | [@whatfontis/mcp](https://www.npmjs.com/package/@whatfontis/mcp) | `npx -y @whatfontis/mcp` | `WFI_API_KEY` (Free from WhatFontIs.com) |
| **`supabase`** | Remote SSE | [supabase.com/docs](https://supabase.com/docs/guides/ai/mcp) | Remote: `https://mcp.supabase.com/mcp` | Supabase OAuth / Personal Access Token |
| **`vercel`** | Remote SSE | [vercel.com](https://vercel.com/) | Remote: `https://mcp.vercel.com` | Vercel Token |
| **`posthog`** | Local Node | [@posthog/mcp-server](https://www.npmjs.com/package/@posthog/mcp-server) | `npx -y @posthog/mcp-server` | `POSTHOG_API_KEY`, `POSTHOG_HOST` |
| **`brainsync`** | Local Node | [BrainSync Extension](https://marketplace.visualstudio.com/items?itemName=dawoodahmad.brainsync) | `node <extension_path>/dist/mcp-server.js` | `BRAINSYNC_ENV_FILE` |

---

### Project-Level MCP Configuration (`.mcp.json`)
Place this `.mcp.json` in the root of any new repository. Make sure `.mcp.json` is added to `.gitignore` so your API keys remain private!

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT"
      }
    },
    "agentation": {
      "command": "npx",
      "args": ["-y", "agentation-mcp", "server"]
    },
    "21st": {
      "url": "https://21st.dev/api/mcp",
      "headers": {
        "x-api-key": "YOUR_21ST_API_KEY"
      }
    },
    "ui-skills": {
      "url": "https://www.ui-skills.com/mcp"
    },
    "whatfontis": {
      "command": "npx",
      "args": ["-y", "@whatfontis/mcp"],
      "env": {
        "WFI_API_KEY": ""
      }
    }
  }
}
```

### Global MCP Configuration (`~/.gemini/config/mcp_config.json`)
Available across all workspaces in your IDE:

```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp"
    },
    "vercel": {
      "url": "https://mcp.vercel.com"
    },
    "posthog": {
      "command": "npx",
      "args": ["-y", "@posthog/mcp-server"]
    },
    "agentation": {
      "command": "npx",
      "args": ["-y", "agentation-mcp", "server"]
    }
  }
}
```

---

## 🛠️ 3. CLI & Local Engines Setup

### A. Agentation (Visual Feedback & Browser Annotation)
- **Official Website**: [https://www.agentation.com](https://www.agentation.com)
- **Install in App**:
  ```bash
  npm install agentation -D
  ```
- **Health Check & Diagnostic**:
  ```bash
  npx -y agentation-mcp doctor
  ```
- **How to Embed in React / Next.js / Vite**:
  ```tsx
  import { Agentation } from "agentation";

  export default function App() {
    return (
      <>
        {process.env.NODE_ENV === "development" && (
          <Agentation endpoint="http://localhost:4747" />
        )}
        <YourWebsite />
      </>
    );
  }
  ```
- **When & Why to Use**:
  - Click anywhere on your live webpage to leave visual notes, highlight layout bugs, or request tweaks.
  - The AI agent reads your notes via `agentation_get_all_pending` and fixes the code automatically.

### B. Graphify / Graphify-MCP (AST Knowledge Graph & GraphRAG)
- **GitHub Repository**: [safwank/graphify](https://github.com/safwank/graphify)
- **Installation**:
  ```bash
  uv tool install graphify-mcp
  # or
  pip install graphify
  ```
- **Execution**:
  ```bash
  graphify ./
  ```
- **When & Why to Use**:
  - Builds an AST knowledge graph of the entire codebase, grouping functions and classes into Louvain/Leiden communities.
  - Generates interactive `graph.html` and GraphRAG knowledge files so agents understand complex architectures instantly without token bloat.

### C. Memvid CLI & SDK (Sub-5ms Timeline Memory Engine)
- **GitHub Repository**: [memvid/memvid](https://github.com/memvid/memvid)
- **Installation**:
  ```bash
  npm install -g memvid-cli
  pip install memvid-sdk
  ```
- **Execution**:
  ```bash
  memvid init
  memvid ask "What were the architectural decisions made for the auth system?"
  ```
- **When & Why to Use**:
  - Persistent, single-file (`.mv2`) memory engine across agent sessions with sub-5ms vector recall.

---

## 📚 4. Complete Agent Skills Library (169 Skills Across 11 Repositories)

All skills are installed into `.agents/skills/` and are automatically discovered by Antigravity, Gemini, Codex, Cursor, and Claude Code.

---

### Pack 1: UI & Modern Visual Design
#### 🔗 Repository: [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- **Install Command**: `npx skills add nextlevelbuilder/ui-ux-pro-max-skill`
- **Included Skills**:
  - `banner-design`: High-conversion banners, visual hierarchy, responsive hero elements.
  - `brand`: Brand guidelines, visual identity frameworks, and color tone adherence.
  - `design`: General aesthetic guidance, visual rhythm, modern layouts.
  - `ui-styling`: Advanced CSS/SCSS design patterns, custom token variables.
  - `ui-ux-pro-max`: End-to-end design thinking, user flow design, state transitions.

#### 🔗 Repository: [ibelick/ui-skills](https://github.com/ibelick/ui-skills)
- **Install Command**: `npx skills add ibelick/ui-skills`
- **Included Skills**:
  - `anti-slop-web-design`: **Critical Anti-Default Rule**. Bans generic AI statistical defaults (Inter font, generic purple gradients, identical cards). Enforces 5 strict decisions: paired display typography, tokenized color palette, asymmetric layout, orchestrated micro-motion, and real media assets.
  - `baseline-ui`: Fast de-slop pass for spacing, padding, typography scales, and visual alignment.
  - `create-design-md`: Reconstructs and documents design tokens and systems into a persistent `DESIGN.md`.
  - `fixing-accessibility`: Full WCAG compliance check: ARIA roles, focus rings, contrast ratios, and screen readers.
  - `fixing-metadata`: SEO meta tags, OpenGraph previews, Twitter cards, JSON-LD structured schemas.
  - `fixing-motion-performance`: Prevents layout jank, forces hardware-accelerated transforms (`transform`, `opacity`), reduces paint thrashing.
  - `improve-ui`: Audits existing UI against design tokens without breaking identity.

#### 🔗 Repository: [Jakubantalik/transitions.dev](https://github.com/Jakubantalik/transitions.dev)
- **Install Command**: `npx skills add Jakubantalik/transitions.dev`
- **Included Skills**:
  - `transitions-dev`: Page transitions, layout animations, framer-motion patterns.
  - `transitions-polish`: Fluid spring physics, easing curves, responsive micro-interactions.

---

### Pack 2: Anthropic Official Creative & Design Suite
#### 🔗 Repository: [anthropics/skills](https://github.com/anthropics/skills)
- **Install Command**: `npx skills add anthropics/skills`
- **Included Skills (20 total)**:
  - `frontend-design`: Purposeful aesthetic direction avoiding templated defaults.
  - `design-system`: Three-layer token architecture (primitive → semantic → component).
  - `brand-guidelines`: Applies high-end visual formatting and brand standards.
  - `algorithmic-art`: Interactive generative art using p5.js and particle systems.
  - `canvas-design`: High-resolution canvas poster and static visual generation.
  - `slides`: Professional HTML/Chart.js presentation slides.
  - `marp-slide`: Markdown-based slide presentation formatting across 7 themes.
  - `web-artifacts-builder`: Multi-component interactive React and Tailwind prototypes.
  - `webapp-testing`: Browser automation testing with Playwright, screenshots, and logs.
  - `pdf`: Full PDF lifecycle (generation, OCR, text extraction, splitting, merging).
  - `internal-comms`: Executive updates, project retrospectives, and internal reports.
  - `meme-factory`: Contextual visual memes for communication.

---

### Pack 3: Enterprise Security & Threat Auditing
#### 🔗 Repository: [cosai-oasis/project-codeguard](https://github.com/cosai-oasis/project-codeguard)
- **Install Command**: `npx skills add cosai-oasis/project-codeguard`
- **Included Skills**:
  - `codeguard`: AI code review skill ensuring secure-by-default implementations and preventing injection, auth bypasses, and data leaks.

#### 🔗 Repository: [UnitOneAI/SecuritySkills](https://github.com/UnitOneAI/SecuritySkills)
- **Install Command**: `npx skills add UnitOneAI/SecuritySkills`
- **Included Skills (44 total)**:
  - **AppSec**: `owasp-top-10-web`, `api-security`, `code-review-security`, `secure-code-review`, `secrets-scan`, `sast-config`, `dast-config`, `sca-audit`, `dependency-scanning`.
  - **Cloud & Infrastructure**: `aws-review`, `azure-review`, `gcp-review`, `iac-security-review`, `firewall-review`, `segmentation`.
  - **Identity & Access**: `access-review`, `iam-review`, `privileged-access`, `rbac-design`.
  - **Compliance & Audits**: `iso27001-gap`, `soc2-gap`, `pci-dss-review`, `cve-triage`, `patch-prioritization`, `zero-trust-assessment`.
  - **AI & Agent Security**: `agentic-top-10`, `ai-data-privacy`, `llm-top-10`.
  - **SecOps & Incident Response**: `alert-triage`, `containment`, `forensics-checklist`, `siem-rules`.

#### 🔗 Repository: [OWASP/secure-agent-playbook](https://github.com/OWASP/secure-agent-playbook)
- **Install Command**: `npx skills add OWASP/secure-agent-playbook`
- **Included Skills (19 total)**:
  - `agent-security-audit`: Audits AI agent tool permissions, prompt surfaces, and data paths.
  - `agentic-ai-risk-assess`: Assesses multi-agent systems against OWASP Top 10 for Agentic Applications.
  - `ai-security-verification`: OWASP AISVS verification covering ML training to inference.
  - `prompt-injection-test`: Validates system prompts against evasion, jailbreaking, and injection.
  - `llm-risk-assess`: Full threat modeling for RAG pipelines and autonomous agents.
  - `mcp-server-review`: Security review of custom MCP server configurations and privilege levels.
  - `multi-agentic-threat-model`: 7-layer CSA MAESTRO framework threat modeling.

#### 🔗 Repository: [olanokhin/agent-security-skill](https://github.com/olanokhin/agent-security-skill)
- **Install Command**: `npx skills add olanokhin/agent-security-skill`
- **Included Skills**:
  - `agent-security`: OWASP-aligned review for LLM tools, MCP servers, and autonomous workflows.

---

### Pack 4: System Design & Distributed Architecture
#### 🔗 Repository: [proyecto26/system-design-skills](https://github.com/proyecto26/system-design-skills)
- **Install Command**: `npx skills add proyecto26/system-design-skills`
- **Included Skills (22 total)**:
  - `system-design`: End-to-end distributed system blueprints with trade-off matrices.
  - `architecture-diagram`: Visual system architecture diagrams and topology mapping.
  - `api-design`: RESTful, gRPC, and GraphQL API specifications and versioning models.
  - `database-schema-designer`: Relational and NoSQL schemas, indexing, and migration planning.
  - `caching`: Invalidation strategies (cache-aside, write-through, TTL, eviction policies).
  - `load-balancing`: L4/L7 load balancing, global DNS routing, and health checks.
  - `resilience-failure`: Circuit breakers, bulkheads, retries, and graceful degradation.
  - `scaling-evolution`: Horizontal scaling, sharding, and database partition keys.
  - `messaging-streaming`: Kafka/RabbitMQ semantics, deduplication, and dead-letter queues.
  - `consistency-coordination`: Distributed consensus, CAP theorem, and distributed locking.
  - `distributed-logging`: Structured log aggregation and distributed trace IDs.
  - `distributed-search`: Elasticsearch/OpenSearch indexing and search cluster topologies.
  - `observability`: OpenTelemetry instrumentation, metrics, and SLO/SLI definition.
  - `service-decomposition`: Monolith to microservice decomposition boundaries.
  - `sharded-counters`: Atomic distributed counting patterns under extreme concurrency.
  - `back-of-the-envelope`: Capacity estimation (QPS, IOPS, storage requirements).

#### 🔗 Repository: [Jeffallan/claude-skills](https://github.com/Jeffallan/claude-skills)
- **Install Command**: `npx add-skill https://github.com/Jeffallan/claude-skills/tree/main/skills/architecture-designer`
- **Included Skills**:
  - `architecture-designer`: Microservice architecture decision records (ADRs), trade-off analysis, and component specifications.

---

### Pack 5: Developer Productivity, Coordination & Maintenance
#### 🔗 Repository: [softaworks/agent-toolkit](https://github.com/softaworks/agent-toolkit)
- **Install Command**: `npx skills add softaworks/agent-toolkit`
- **Included Skills (43 total)**:
  - `c4-architecture`: C4 model diagrams (Context, Container, Component, Code).
  - `backend-to-frontend-handoff-docs`: Standardized API handoff documentation for frontend devs.
  - `frontend-to-backend-requirements`: Translates UI data needs into backend endpoint requirements.
  - `qa-test-planner`: Generates test matrices, regression suites, and edge-case checklists.
  - `crafting-effective-readmes`: Tailored README templates matched to project audiences.
  - `jira`: Jira issue creation, ticket tracking, and sprint backlog coordination.
  - `daily-meeting-update`: Standup generator pulling commits, PRs, and active blockers.
  - `game-changing-features`: Strategic 10x feature brainstorming and high-leverage product bets.
  - `mcp-builder`: Authoring custom MCP servers in Python (FastMCP) or TypeScript.
  - `plugin-forge`: Packaging and distributing agent plugins and tool manifests.
  - `skill-creator`: Creating, benchmarking, and evaluating new agent skills.
  - `skill-judge`: Grading agent skill design against official specifications.
  - `commit-work`: Staging logical git diffs and writing Conventional Commit messages.
  - `dependency-updater`: Smart multi-language dependency manager and diagnostic solver.
  - `naming-analyzer`: Context-aware variable, function, and class naming suggestions.
  - `reducing-entropy`: Dead-code deletion and codebase minimalism passes.
  - `session-handoff`: Seamless session summaries for multi-agent handoffs.

---

## 🤖 5. Agent Instruction Files Architecture & Setup Protocol

### The "Read First" Universal Execution Principle
Every modern AI coding assistant (Google Antigravity, Gemini CLI, Anthropic Claude Code, Cursor, Windsurf, Codex) operates under a strict **Precedence Rule**:
> **When a user provides a prompt, the AI agent reads the project's agent markdown instruction file FIRST before inspecting code, designing architecture, or modifying any file.**

These instruction files act as the **constitution and operating system** of the AI agent within the repository. Without them, the agent falls back to generic statistical defaults, misses installed skills, and makes uncoordinated modifications.

### Agent File Naming Matrix (Who Reads What)

| File Name | Primary Target Agent | Fallback / Compatibility | Purpose |
| :--- | :--- | :--- | :--- |
| **`AGENTS.md`** | Universal Standard | Google Antigravity, Gemini, Claude Code, Cursor, Windsurf, Codex | Defines global repository invariants, tech stack rules, anti-slop guidelines, MCP server tools, and master skill orchestration matrix. |
| **`GEMINI.md`** | Google Gemini / Antigravity | Antigravity IDE | Specific instructions tailored to Gemini models, Antigravity tool calling conventions, and quick skill triggers. |
| **`CLAUDE.md`** | Anthropic Claude Code | Claude CLI | Specific slash commands, terminal tool preferences, and memory context for Claude Code. |
| **`.cursorrules`** / `.cursor/rules/*.mdc` | Cursor IDE | Cursor Agent | Cursor-specific project guidelines, code styling, and prompt overrides. |
| **`.windsurfrules`** | Windsurf IDE | Windsurf Cascade | Cascade memory and project boundary guidelines. |

---

### 🚨 Mandatory Setup Rule for Every New Project

Whenever initializing or cloning a new project, you **MUST** follow this 3-step agent instructions workflow:

1. **Step 1: Configure & Identify AI Agents Used**
   - Determine which AI tools your team or pair-programming workflow uses (Antigravity, Gemini, Cursor, Claude Code, etc.).
2. **Step 2: Inspect & Create Missing Files**
   - Check if `AGENTS.md` (and agent-specific files like `GEMINI.md` or `CLAUDE.md`) exist in the project root.
   - **If NOT present**: You **MUST CREATE THEM** immediately during bootstrap.
3. **Step 3: Update & Project-Specialize Existing Files**
   - If present (e.g. copied over from another template), you **MUST UPDATE** them:
     - Replace repository name and framework stack (e.g., React 19 + Tailwind, Next.js 15, Vite + Express).
     - Configure the active MCP servers and secrets for this project.
     - Review and activate the **Skill Decision Matrix** so every skill in `.agents/skills/` is mapped to prompt triggers.
     - Embed the **Anti-Slop Design Tokens** (custom fonts, semantic color properties).

---

### 🏛️ The 5 Mandatory Content Pillars of Every Agent Instruction File

Every `AGENTS.md` or `GEMINI.md` file you create or update must contain these 5 structural sections:

1. **Core Architectural & Safety Rules**:
   - **Docker-Free GitHub**: Use Node/NPX-based `@modelcontextprotocol/server-github` via `.mcp.json`. Never prompt or spawn Docker containers.
   - **Strict Git Safety**: Never run `git clean -fd` or `git reset --hard` blindly. Always verify `git status`.
   - **Strict TypeScript**: Zero `any` types. Strongly-typed interfaces for all component props, API payloads, and state.
   - **Unhandled States**: Always handle loading, empty, and retryable error states.
2. **Frontend Design Standard ("Anti-Slop" Protocol)**:
   - **Named Typography Pairing**: Never use unstyled browser fallbacks. Pair a distinctive display font (e.g. Plus Jakarta Sans, Outfit, Playfair) with a crisp body font (Inter, DM Sans).
   - **Tokenized Color System**: Define semantic CSS custom properties (`--primary`, `--accent`, `--bg-surface`, `--text-ink`). Ban generic purple/rainbow gradients.
   - **Asymmetric Grid Layout**: Intentional 12-column grids with offset hero elements and full-bleed image crops; ban repetitive identical 3-card rows.
   - **Orchestrated Motion**: Single-coordinated load entrances with fluid spring physics.
   - **Real Media Assets**: Embed high-resolution photography, SVG graphics, or AI-generated visual assets instead of empty gray placeholder boxes.
3. **MCP Server Usage Protocols**:
   - Explicit instructions on when to call `github`, `agentation`, `21st`, `ui-skills`, `whatfontis`, `supabase`, `vercel`, and `posthog`.
4. **Skill Orchestration Decision Matrix**:
   - Explicit trigger mapping connecting user prompt keywords to installed agent skills (see Section 6).
5. **Live Visual Feedback Loop**:
   - Step-by-step instructions on embedding `<Agentation />` in dev mode, calling `agentation_get_all_pending()`, fixing code, and resolving annotations via `agentation_resolve()`.

---

### 📋 Ready-to-Copy Master Template: `AGENTS.md`

Place this complete, production-ready template in your new repository's root as `AGENTS.md`:

```markdown
# 🤖 Universal AI Agent System Instructions (AGENTS.md)

> **Authority**: This document defines universal operating guidelines, architectural constraints, tool execution protocols, and skill orchestration rules for all AI coding agents working in this repository (Antigravity, Gemini, Claude Code, Codex, Cursor, Windsurf). Read this before analyzing, writing, or modifying any code.

---

## 🏛️ 1. Core Architectural & Safety Rules
1. **Strict Docker-Free Operations**:
   - Never spawn or require Docker containers for GitHub operations or Git sync. All GitHub MCP interactions use `@modelcontextprotocol/server-github` via standard Node/NPX.
2. **Strict Git Safety Protocols**:
   - NEVER run `git clean -fd` or `git reset --hard` blindly without checking `git status`.
   - NEVER delete untracked files or directories without backing up or asking the user.
   - Always protect credentials and tokens (`.gitignore` must protect `.mcp.json`, `node_modules/`, and private keys).
3. **TypeScript & Code Quality Standards**:
   - **No any Types**: Always define strict TypeScript interfaces or types.
   - **No Unhandled States**: Always provide explicit loading, empty, and retryable error states.
   - **Modern APIs Only**: Never introduce deprecated APIs or legacy class components.
   - **API Versioning**: All backend routes must follow clean versioning (e.g. `/api/v1/`).

---

## 🎨 2. Frontend Design Standard: "Anti-Slop" Protocol
When designing or coding web interfaces, you are strictly prohibited from generating generic AI statistical defaults (interchangeable hero sections, random purple gradients, 3 identical cards, rounded-xl everywhere).

Before writing any UI code, enforce the **Five Mandatory Design Decisions**:
1. **Named Typography Pairing**: Pair a distinctive display font with a crisp body font. Never use unstyled browser fallbacks.
2. **Tokenized Color System (No Default Gradients)**: Define semantic CSS custom properties (`--primary`, `--accent`, `--bg-surface`, `--text-ink`). Ban generic rainbow/purple gradients.
3. **Asymmetric Structural Layout**: Use an intentional 12-column grid with offset hero copy and full-bleed media crops rather than repetitive stacked cards.
4. **Orchestrated Motion**: Use single-coordinated load entrances (e.g. 80ms stagger fade-up) and fluid spring transitions.
5. **Real Visual Assets**: Integrate actual, high-resolution media and photography rather than gray blank placeholder boxes.

---

## 🔌 3. MCP (Model Context Protocol) Server Usage Protocols
Always prioritize using specialized MCP tools over generic terminal commands:

| MCP Server | When to Call | What Tool to Use |
| :--- | :--- | :--- |
| **`github`** | Managing PRs, reviewing branches, opening issues, and syncing repositories. | `mcp_github_*` (create_or_update_file, create_pull_request, search_repositories) |
| **`agentation`** | Visual feedback and on-page browser annotations left by the user. | `agentation_get_all_pending`, `agentation_resolve`, `agentation_reply` |
| **`21st`** | Searching production-ready UI components, templates, and color palettes. | `video_search_blocks`, `get_component`, `get_theme` |
| **`ui-skills`** | Fetching live design guidelines, accessibility checklists, and layout rules. | `get_skill`, `list_skills` |
| **`whatfontis`** | Reverse-engineering typography and fonts from images or screenshots. | `identify_font` |
| **`supabase`** | Managing databases, applying migrations, and deploying Edge Functions. | `list_tables`, `execute_sql`, `apply_migration` |
| **`vercel`** | Checking deployments, project domains, and live server logs. | Remote deployment tools |
| **`posthog`** | Product analytics, event schemas, feature flags, and funnels. | Analytics query tools |

---

## 🧭 4. Skill Orchestration Decision Matrix
This workspace contains 169 curated skills across 11 repositories located in `.agents/skills/`.
You MUST consult and trigger the appropriate skill before executing tasks:
- **UI & Landing Pages**: Activate `anti-slop-web-design`, `ui-ux-pro-max`, `transitions-dev`.
- **System Architecture**: Activate `system-design`, `architecture-designer`, `c4-architecture`.
- **Database & Schemas**: Activate `database-schema-designer`, `caching`.
- **Security Audits**: Activate `codeguard`, `secure-code-review`, `secrets-scan`, `owasp-top-10-web`.
- **Agent / MCP Security**: Activate `agent-security-audit`, `agentic-ai-risk-assess`, `prompt-injection-test`.
- **Git & Workflows**: Activate `commit-work`, `reducing-entropy`, `naming-analyzer`.

---

## 🔄 5. Live Feedback Workflow (Agentation Integration)
1. The user navigates to their running dev app with `<Agentation />` embedded.
2. The user clicks on any element to leave visual feedback or mark bugs.
3. The AI agent executes: `agentation_get_all_pending()`.
4. The AI inspects the element selector, screenshot, and user comment.
5. The AI modifies the relevant component using `replace_file_content`.
6. The AI resolves the annotation: `agentation_resolve({ "id": "<annotation_id>" })`.
```

---

### 📋 Ready-to-Copy Master Template: `GEMINI.md`

Place this file in your root as `GEMINI.md`:

```markdown
# 🤖 Gemini & Antigravity Operating Instructions (GEMINI.md)

> **Antigravity Rule**: Automatically loaded by Google Antigravity and Gemini agents operating within this repository.

---

## 🛡️ Core Rules & Invariants
1. **Docker-Free GitHub**: Use Node/NPX-based `@modelcontextprotocol/server-github` via project `.mcp.json`. Never prompt or run Docker containers.
2. **Git Integrity**: Never execute `git clean -fd` or destructive resets without verifying clean backups.
3. **No Any Types**: All TypeScript code must have explicit, strongly-typed interfaces.
4. **Anti-Slop Web Design**:
   - Distinctive typography pair (Display + Crisp text font).
   - Token-based semantic CSS properties; no generic purple gradients.
   - Asymmetric layout rhythm with real media assets.
   - Orchestrated transitions using spring physics (`transitions-dev`).

---

## 🔌 Primary MCP Tools
- **`github`**: Repository synchronization, PRs, branch management.
- **`agentation`**: Read live visual feedback via `agentation_get_all_pending()`.
- **`21st`**: Retrieve modern React / Tailwind / shadcn components via `video_search_blocks` and `get_component`.
- **`ui-skills`**: Query design and accessibility standards via `get_skill`.
- **`whatfontis`**: Identify fonts from images via `identify_font`.
- **`supabase`**: Database queries, migrations, edge functions.
- **`vercel`**: Deployment inspection and live logs.

---

## 🧭 Skill Decision Matrix (Quick Triggers)
- **Architecture & System Design**: `system-design`, `architecture-designer`, `c4-architecture`, `api-design`, `database-schema-designer`.
- **UI/UX & Design**: `anti-slop-web-design`, `ui-ux-pro-max`, `transitions-dev`, `fixing-accessibility`, `fixing-metadata`.
- **Security & Vulnerability Auditing**: `codeguard`, `secure-code-review`, `secrets-scan`, `owasp-top-10-web`, `agent-security-audit`.
- **Developer Workflows**: `commit-work`, `reducing-entropy`, `naming-analyzer`, `session-handoff`.
```

---

## 🧭 6. Comprehensive Skill Routing & Prompt Mapping Guide

> **The "Zero Idle Skills" Mandate**: With 169 installed skills, an agent should **never guess or use basic patterns**. Whenever a user prompt expresses a specific requirement, the AI agent must read and activate the corresponding skill.

Below is the complete reference mapping every user prompt and requirement to its exact skill, action, and paired MCP tool:

---

### Category A: UI/UX, Design Engineering & Motion

| User Prompt / Keyword Intent | Exact Skill to Trigger | Project Requirement / Scenario | Agent Action & Paired Tools |
| :--- | :--- | :--- | :--- |
| *"Build a new landing page", "Redesign this UI", "Make it look modern", "Design hero section"* | **`anti-slop-web-design`** | Building any front-facing web page or component from scratch. | Enforces named typography pair, semantic color tokens, asymmetric 12-column grid, real assets. Query `21st` MCP for components. |
| *"Design full user flow", "Create checkout UX", "Multi-step modal", "Improve user experience"* | **`ui-ux-pro-max`** | End-to-end UX flow design, journey mapping, modal dialogs, and conversion optimization. | Generates wireframes, state transition diagrams, user flow specs. |
| *"Clean up spacing", "Fix alignment", "Tighten padding", "UI looks messy", "Quick polish pass"* | **`baseline-ui`** | Fast visual cleanup of spacing, margins, visual hierarchy, and font sizing. | Audits CSS spacing scales, aligns flex/grid containers, cleans up line heights. |
| *"Extract design system", "Create DESIGN.md", "Document our color palette and tokens"* | **`create-design-md`** | Creating persistent design token documentation from existing UI code. | Scans CSS/tailwind files, extracts tokens into persistent `DESIGN.md`. |
| *"Refine this UI without changing brand", "Fix design drift", "Make this look more cohesive"* | **`improve-ui`** | Improving an existing interface strictly following its existing design system. | Audits product surface against design evidence, fixes inconsistencies without identity drift. |
| *"Add animations", "Smooth page transitions", "Spring motion", "Staggered fade-in"* | **`transitions-dev`** | Implementing fluid layout transitions, spring physics, and entrance animations. | Applies Framer Motion or CSS spring curves, coordinates load sequences. |
| *"Polish micro-interactions", "Button hover effect", "Interactive card flip"* | **`transitions-polish`** | Adding fine micro-motion and responsive hover states. | Pairs with `transitions-dev` for physics-based easing curves and touch feedback. |
| *"Animation feels laggy", "Fix scroll stutter", "Prevent layout jank"* | **`fixing-motion-performance`** | Eliminating FPS drops, paint thrashing, and jank in CSS/JS animations. | Replaces `top`/`left`/`width` animations with `transform` and `opacity` composited layers. |
| *"Create design tokens", "Set up 3-layer CSS variables", "Component styling architecture"* | **`design-system`** | Setting up scalable token architecture (primitive → semantic → component). | Writes CSS custom properties and theme tokens. |
| *"What font is used in this image?", "Match this typography from screenshot"* | `identify_font` (MCP) | Reverse-engineering fonts from screenshots or client branding assets. | Calls WhatFontIs MCP to detect font family and recommend Google Fonts match. |
| *"Find modern navbar component", "Get pricing card block", "Need testimonials component"* | `21st` (MCP) | Sourcing production-ready, beautiful React/Tailwind blocks. | Calls `21st` MCP (`video_search_blocks` or `get_component`) for clean UI code. |
| *"I left notes on the webpage", "Check browser annotations", "Fix UI as per my comments"* | `agentation` (MCP) | Reading live on-page user visual annotations. | Calls `agentation_get_all_pending()`, reads selectors and coordinates, edits code, resolves. |
| *"Generate marketing banner", "Hero promotional graphics"* | **`banner-design`** | Responsive marketing banners and high-converting CTA headers. | Formats responsive banner hierarchy and CTA contrast. |
| *"Create generative art", "Interactive particle background", "Canvas visual art"* | **`algorithmic-art`** / **`canvas-design`** | Building creative coded visuals using p5.js or high-resolution canvas. | Generates original parametric or particle code avoiding copyright duplication. |

---

### Category B: SEO, Accessibility & Quality Assurance

| User Prompt / Keyword Intent | Exact Skill to Trigger | Project Requirement / Scenario | Agent Action & Paired Tools |
| :--- | :--- | :--- | :--- |
| *"Audit accessibility", "Make keyboard accessible", "Check contrast", "Screen reader support", "WCAG audit"* | **`fixing-accessibility`** | Ensuring WCAG 2.1 AA compliance across all web views and interactive elements. | Adds ARIA roles, tabindex, focus-visible rings, checks 4.5:1 color contrast. |
| *"Add SEO tags", "Social share preview", "OpenGraph image", "Google rich snippet", "JSON-LD schema"* | **`fixing-metadata`** | Configuring comprehensive search engine optimization and social share previews. | Injects `<title>`, description, canonical links, OpenGraph, Twitter cards, and Schema.org JSON-LD. |
| *"Test app in browser", "Run Playwright test", "Verify form submission with screenshot"* | **`webapp-testing`** | Automating browser validation, capturing screenshots, and inspecting live console logs. | Executes headless Playwright automation and captures DOM/screenshot proofs. |
| *"Generate QA test cases", "Edge cases checklist", "Write test matrix for checkout"* | **`qa-test-planner`** | Creating comprehensive QA test suites, regression plans, and edge-case coverage. | Outputs functional, regression, and exploratory test matrices. |

---

### Category C: System Design, Architecture & Distributed Systems

| User Prompt / Keyword Intent | Exact Skill to Trigger | Project Requirement / Scenario | Agent Action & Paired Tools |
| :--- | :--- | :--- | :--- |
| *"Design distributed architecture", "How to handle 100k requests/sec?", "High-level system design"* | **`system-design`** | Designing scalable microservices, capacity estimations, and trade-off matrices. | Calculates QPS/IOPS capacity, draws component diagrams, defines SLAs and bottlenecks. |
| *"Write an ADR", "Architecture Decision Record", "Should we use PostgreSQL or MongoDB?"* | **`architecture-designer`** | Documenting major architectural decisions with alternatives and consequences. | Formats ADRs following industry standard (Context, Decision, Consequences, Compliance). |
| *"Draw C4 model", "System context diagram", "Container architecture map"* | **`c4-architecture`** | Creating structured 4-tier architectural maps (Context, Container, Component, Code). | Generates clean Mermaid C4 diagrams with data flows. |
| *"Design REST API", "Create OpenAPI spec", "GraphQL schema design", "API versioning"* | **`api-design`** | Defining robust, backward-compatible API contracts, error schemas, and versioning. | Designs `/api/v1/` REST or GraphQL schemas with strict status codes and idempotency keys. |
| *"Document API for frontend team", "Backend-to-frontend handoff", "API contract"* | **`backend-to-frontend-handoff-docs`** | Creating unambiguous endpoint documentation for client-side engineers. | Produces endpoint tables with headers, request/response JSON schemas, and error states. |
| *"What endpoints does this UI need?", "Document frontend data requirements"* | **`frontend-to-backend-requirements`** | Specifying data needs from UI components to backend engineers. | Extracts required props, query params, mutations, and cache invalidation needs. |
| *"Design database schema", "Create SQL tables", "Indexes and foreign keys", "Normalize DB"* | **`database-schema-designer`** | Designing relational or NoSQL database schemas with optimal indexing and relations. | Generates DDL scripts, 3NF normalization, composite indexes, and migration plans. Pairs with `supabase`. |
| *"Implement caching", "Add Redis cache", "Cache invalidation strategy", "TTL and eviction"* | **`caching`** | Designing low-latency caching layers and preventing cache stampedes. | Defines cache-aside / write-through patterns, key naming conventions, TTLs, and Redis eviction. |
| *"Scale database", "Sharding strategy", "Partitioning data across nodes"* | **`scaling-evolution`** | Scaling beyond single-node database limitations. | Defines shard key selection, range/hash partitioning, read-replicas, and failover topologies. |
| *"Add circuit breaker", "Retry with exponential backoff", "Graceful degradation"* | **`resilience-failure`** | Preventing cascading failures across microservices. | Implements bulkhead patterns, circuit breakers, jittered retries, and fallback fallbacks. |
| *"Setup message queue", "Kafka event streaming", "RabbitMQ dead-letter queue", "Event-driven"* | **`messaging-streaming`** | Asynchronous decoupled message processing and event buses. | Defines topic partitions, consumer group offsets, idempotency, and DLQ handling. |
| *"Distributed lock", "Consensus algorithm", "Prevent double booking/spending"* | **`consistency-coordination`** | Ensuring data consistency under concurrent distributed operations. | Applies Redlock, distributed leasing, Raft semantics, and optimistic locking patterns. |
| *"Calculate QPS capacity", "How much storage for 10 million users?", "Back-of-the-envelope"* | **`back-of-the-envelope`** | Rapid mathematical estimations for hardware, bandwidth, memory, and storage. | Breaks down reads/writes per second, payload size, daily GB ingestion, and server sizing. |
| *"Analyze codebase architecture", "Map AST dependencies", "Explain codebase"* | `graphify` (CLI/MCP) | Understanding class hierarchies and module dependencies without token bloat. | Runs `graphify ./` to create AST knowledge graph and Louvain community maps. |

---

### Category D: Enterprise Security, Vulnerability Auditing & AI Safety

| User Prompt / Keyword Intent | Exact Skill to Trigger | Project Requirement / Scenario | Agent Action & Paired Tools |
| :--- | :--- | :--- | :--- |
| *"Security code review", "Check this PR for vulnerabilities", "Is this code safe?"* | **`secure-code-review`** / **`codeguard`** | Pre-merge security gate check against OWASP ASVS 4.0 and CWE Top 25. | Scans for injection, auth bypasses, CSRF, insecure deserialization, and provides remediation. |
| *"Scan for leaked secrets", "Check for exposed API keys", "Audit .env"* | **`secrets-scan`** | Detecting hardcoded credentials, JWT private keys, and tokens before committing. | Scans diffs and repo files with regex entropy checkers; protects `.mcp.json`. |
| *"Audit web application", "OWASP Top 10 check", "Prevent SQL injection & XSS"* | **`owasp-top-10-web`** | Reviewing web application against OWASP Top 10:2021 vulnerability categories. | Produces structured findings mapped to A01-A10 with CWE references and fix diffs. |
| *"Audit API security", "BOLA / IDOR check", "Rate limiting review"* | **`api-security`** | Auditing REST/GraphQL endpoints against OWASP API Security Top 10:2023. | Inspects object-level authorization (BOLA/BFLA), token validation, CORS, and rate limits. |
| *"Audit AI agent", "Is this MCP server safe?", "Review agent permissions and tools"* | **`agent-security-audit`** / **`mcp-server-review`** | Auditing AI agent orchestration code, MCP server privileges, and tool access. | Evaluates least privilege, command injection risks, file system access boundaries. |
| *"Check agent for OWASP risks", "Agentic AI risk assessment", "Autonomous agent safety"* | **`agentic-ai-risk-assess`** | Assessing autonomous multi-agent systems against OWASP Agentic Top 10 (2026). | Reviews goal hijacking, runaway tool misuse, privilege abuse, and rogue agent behavior. |
| *"Test prompt injection", "Red team system prompt", "Can this bot be jailbroken?"* | **`prompt-injection-test`** | Stress-testing system prompts against indirect injection, jailbreaks, and evasion. | Tests prompts with Arcanum PI taxonomy; writes input sanitization guardrails. |
| *"Audit RAG pipeline", "LLM security review", "Check LLM application risks"* | **`llm-risk-assess`** | Threat modeling LLM applications against OWASP LLM Top 10 (2025). | Checks training data poisoning, excessive agency, vector DB leakage, and hallucination guardrails. |
| *"Audit Terraform / CloudFormation", "Kubernetes security review", "IaC misconfigurations"* | **`iac-security-review`** | Auditing Infrastructure-as-Code for exposed ports, open S3 buckets, and unencrypted volumes. | Maps IaC definitions to CIS benchmarks and least-privilege cloud IAM. |
| *"Design RBAC roles", "Least privilege model", "User permissions architecture"* | **`rbac-design`** | Designing role-based access control and attribute-based access control (ABAC). | Generates role-permission matrices, prevents role explosion, maps to NIST RBAC model. |
| *"SOC 2 gap analysis", "Prepare for SOC 2 Type II audit", "Compliance readiness"* | **`soc2-gap`** | Auditing security program against AICPA Trust Services Criteria (CC1-CC9). | Scores control maturity, identifies compliance gaps, generates 90-day remediation roadmap. |
| *"ISO 27001 readiness", "Audit ISMS controls", "Statement of Applicability"* | **`iso27001-gap`** | Performing ISO 27001:2022 gap analysis across Clauses 4-10 and Annex A controls. | Produces maturity ratings and actionable compliance tasks. |
| *"Triage CVEs", "Should we patch this vulnerability?", "Prioritize security scan results"* | **`cve-triage`** | Prioritizing vulnerability patching using CVSS 4.0, SSVC, and CISA KEV catalog. | Recommends remediation timelines (immediate vs scheduled) based on exploit probability (EPSS). |

---

### Category E: Developer Productivity, Git Workflows & Maintenance

| User Prompt / Keyword Intent | Exact Skill to Trigger | Project Requirement / Scenario | Agent Action & Paired Tools |
| :--- | :--- | :--- | :--- |
| *"Commit my work", "Stage changes", "Write a commit message", "Create PR"* | **`commit-work`** | Reviewing git diffs, staging logical hunks, and writing Conventional Commits. | Formats clean commit messages (`feat:`, `fix:`, `refactor:`); uses `github` MCP for PRs. |
| *"Remove dead code", "Clean up codebase", "Delete unused files", "Minimize code"* | **`reducing-entropy`** | Aggressive dead-code elimination, removing zombie dependencies, minimizing codebase size. | Safely removes unused exports, files, and dead logic with verification. |
| *"Suggest better names", "Variable naming review", "Clean up function names"* | **`naming-analyzer`** | Improving code readability through expressive, domain-aligned identifier naming. | Audits variable, function, and class names against established conventions. |
| *"Handoff to next agent", "Summarize session", "What did we do today?"* | **`session-handoff`** | Compiling session state, completed items, open blockers, and architecture context. | Writes structured handoff markdown for seamless agent-to-agent transitions. |
| *"Write a README", "Document how to run this project", "Create setup instructions"* | **`crafting-effective-readmes`** | Creating clear, developer-friendly project documentation matched to the target audience. | Generates project overview, quickstart commands, architecture overview, and environment setup. |
| *"Update dependencies", "Fix outdated packages", "Resolve npm audit warnings"* | **`dependency-updater`** | Safely updating npm, pip, or cargo packages while diagnosing breaking changes. | Checks version compatibility, upgrades safe semver ranges, prompts for breaking majors. |
| *"Create a Claude command", "Make a slash command", "Automate this workflow"* | **`command-creator`** | Creating reusable Claude Code slash commands. | Writes optimized markdown command definitions with execution parameters. |
| *"Create an agent skill", "Package this workflow into a skill", "Build a new skill"* | **`skill-creator`** | Creating new portable agent skills with `SKILL.md` and test fixtures. | Packages skill instructions with frontmatter, prompts, and evaluation evals. |

---

## 🔄 7. How to Replicate in a New Project (Complete 5-Step Master Checklist)

Follow these exact 5 steps whenever you start or clone a new software repository:

### Step 1: Agent Ecosystem Discovery & Selection
Identify which AI pair-programming tools will be used on the project:
- Antigravity / Google Gemini
- Anthropic Claude Code
- Cursor IDE / Windsurf Cascade
- OpenAI Codex

### Step 2: Initialize & Configure Agent Instruction Markdown Files
Check if instruction files exist in the project root:
- **`AGENTS.md`**: If missing, **CREATE IT** using the template from [Section 5](#ready-to-copy-master-template-agentsmd). If present, update its framework, tech stack, and design tokens.
- **`GEMINI.md`**: If using Antigravity or Gemini, ensure it is created and points to the project's specific MCP tools and quick triggers.
- **`CLAUDE.md`**: If using Claude Code, configure custom slash commands and permissions.

### Step 3: Copy Configuration & Security Files
- Copy `.mcp.json` into the root directory (configure API tokens for GitHub, 21st, WhatFontIs).
- Ensure `.gitignore` is in place and explicitly ignores sensitive files:
  ```gitignore
  node_modules/
  .mcp.json
  .env*
  dist/
  build/
  ```

### Step 4: Run the One-Click Bootstrap Script
Run the automated command for your platform:
- **Windows (PowerShell)**: Run the script from [Section 1 (Windows)](#-windows-powershell).
- **macOS / Linux (Bash)**: Run the script from [Section 1 (macOS / Linux)](#-macos--linux-bash).
This installs `agentation`, memory CLIs, and all 169 curated skills into `.agents/skills/`.

### Step 5: Verification & Health Check
1. **Agentation Health**: Run `npx -y agentation-mcp doctor` to confirm SQLite and local annotation server are running.
2. **Git Secrets Check**: Run `git status` to verify `.mcp.json` and credentials are safely untracked.
3. **Agent Launch**: Open the project in Antigravity, Cursor, or Claude Code. Your AI assistant will automatically read `AGENTS.md` / `GEMINI.md` on its very first prompt and orchestrate all 169 skills seamlessly!

---

## 🎯 8. Master Project Initialization Prompt (Prompt #1 for Blank Folders)

> **How to use this**:
> 1. Create a brand-new, empty directory on your machine.
> 2. Copy only this file (`list-of-all-skills-mcp-tools-setup.md`) into that folder.
> 3. Open the folder in your AI IDE (Antigravity, Cursor, Windsurf, or Claude Code CLI).
> 4. Copy and paste the prompt block below as your **very first prompt**. The AI will autonomously initialize the entire 169-skill ecosystem, setup agent instructions, configure MCPs, and prepare your project!

```markdown
You are an expert full-stack engineer and AI coding assistant operating in this workspace.

I am starting a brand-new project in this repository. Currently, this folder only contains `list-of-all-skills-mcp-tools-setup.md`.

Please execute the complete environment initialization and project setup by following these exact steps:

1. 📖 READ THE MASTER PLAYBOOK:
   - Read `list-of-all-skills-mcp-tools-setup.md` thoroughly to understand our complete architectural stack, configured MCP servers, agent instruction standards, and the 169 installed skills across 11 packs.

2. ⚡ EXECUTE ONE-CLICK BOOTSTRAP:
   - Detect my operating system (Windows PowerShell / macOS / Linux Bash).
   - Execute the bootstrap commands from Section 1:
     a. Initialize npm (`npm init -y`) and install `agentation` as a dev dependency.
     b. Install global CLI engines: `memvid-cli` and `graphify-mcp` (via uv).
     c. Install all 11 curated skill packs (169 skills total) into `.agents/skills/`.

3. 🤖 INITIALIZE AGENT INSTRUCTION FILES:
   - Identify which AI agent(s) we are using (Antigravity, Gemini, Cursor, Claude Code).
   - Generate `AGENTS.md` and `GEMINI.md` in the project root using the production master templates in Section 5.
   - Enforce all 5 Mandatory Pillars:
     * Core Architectural & Safety Invariants (Docker-free GitHub, Git safety, strict TypeScript with zero `any`, zero unhandled states).
     * Anti-Slop Web Design protocol (named display/body typography, tokenized CSS variables, asymmetric 12-column layout, orchestrated spring motion, real media assets).
     * MCP Server Usage Protocols (`github`, `agentation`, `21st`, `ui-skills`, `whatfontis`, `supabase`, `vercel`, `posthog`).
     * Skill Orchestration Decision Matrix (Prompt-to-skill routing so all 169 installed skills are actively utilized).
     * Agentation live visual feedback integration.

4. 🔒 SETUP CONFIGURATION & SECURITY FILES:
   - Create `.gitignore` to protect sensitive files (`.mcp.json`, `node_modules/`, `.env*`, build outputs).
   - Create `.mcp.json` matching the template from Section 2 so MCP servers are pre-configured.

5. 🩺 VERIFICATION & READINESS REPORT:
   - Run `npx -y agentation-mcp doctor` to confirm SQLite and local annotation servers are healthy.
   - Run `git status` to ensure all secret files are safely untracked.
   - Provide a concise readiness report summarizing:
     * Installed skills and memory engines
     * Active agent instruction files
     * Configured MCP servers
   - Finally, ask me what application/project we are building so we can begin coding using our complete skill stack!
```


