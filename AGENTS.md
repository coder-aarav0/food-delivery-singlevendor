# 🤖 Universal AI Agent System Instructions (AGENTS.md)

> **Authority**: This document is the supreme constitutional instruction file for all AI coding agents operating in this repository (Google Antigravity, Gemini, Claude Code, Cursor, Windsurf, Codex). Every AI assistant MUST read this document and the referenced 9 Master Context Files before analyzing, writing, or modifying any code.

---

## 📚 1. Mandatory Context Architecture: The 9 Core Project Files

Before performing any action, code generation, or architectural decision, you **MUST** consult and adhere to the relevant 9 context files:

| File | Focus | When to Read / Apply |
| :--- | :--- | :--- |
| **[`project-overview.md`](file:///c:/Users/AARAV%20SONI/Documents/food-delivery-singlevendor/project-overview.md)** | **The WHAT** | Product vision, 3 portals (Customer PWA, Admin Station, Rider App), TEA State separation, PostHog events, and scope boundaries. |
| **[`architecture.md`](file:///c:/Users/AARAV%20SONI/Documents/food-delivery-singlevendor/architecture.md)** | **The HOW** | Next.js 16 + React 19 stack, route groups, data flows, authoritative Supabase PostgreSQL schema, RLS policies, and Realtime channels. |
| **[`build-plan.md`](file:///c:/Users/AARAV%20SONI/Documents/food-delivery-singlevendor/build-plan.md)** | **The WHEN & ORDER** | Phased implementation schedule (Phases 0 through 6). Never guess what to build next; follow this roadmap. |
| **[`code-standards.md`](file:///c:/Users/AARAV%20SONI/Documents/food-delivery-singlevendor/code-standards.md)** | **Code Quality** | Strict TypeScript (zero `any`), naming conventions, Server Actions standards, and 4-state screen requirements (Loading, Success, Empty, Error). |
| **[`library-docs.md`](file:///c:/Users/AARAV%20SONI/Documents/food-delivery-singlevendor/library-docs.md)** | **Tool Recipes** | Project-tailored implementations for Supabase (`@supabase/ssr`), Razorpay HMAC webhooks, Cloudinary WebP helpers, and PostHog tracking. |
| **[`ui-tokens.md`](file:///c:/Users/AARAV%20SONI/Documents/food-delivery-singlevendor/ui-tokens.md)** | **UI Layer 1** | Master CSS custom properties (`--brand-primary`, `--brand-accent`, `--bg-app`), white-label re-skinning engine, and typography scales. |
| **[`ui-rules.md`](file:///c:/Users/AARAV%20SONI/Documents/food-delivery-singlevendor/ui-rules.md)** | **UI Layer 2** | Anti-Slop design guidelines, 44px mobile touch targets, card anatomy, status badges, and orchestrated spring motion. |
| **[`ui-registry.md`](file:///c:/Users/AARAV%20SONI/Documents/food-delivery-singlevendor/ui-registry.md)** | **UI Layer 3** | Living component catalog. Check before creating new components to avoid duplicates; register newly created components here. |
| **[`progress-tracker.md`](file:///c:/Users/AARAV%20SONI/Documents/food-delivery-singlevendor/progress-tracker.md)** | **Living State** | Master progress checklist across all phases. Mark tasks complete as you finish them; read on session start to resume work. |

---

## 🏛️ 2. Core Architectural & Safety Invariants

1. **Strict Docker-Free Operations**:
   - Never spawn or require Docker containers for GitHub operations or Git sync. All GitHub MCP interactions use `@modelcontextprotocol/server-github` via standard Node/NPX.
2. **Strict Git Safety Protocols**:
   - NEVER run `git clean -fd` or `git reset --hard` blindly without checking `git status`.
   - Protect credentials and tokens (`.gitignore` must protect `.mcp.json`, `node_modules/`, `.env*`, and private keys).
3. **TypeScript & Code Quality Standards**:
   - **Zero `any` Types**: Always define strict TypeScript interfaces or types. Use discriminated unions for async UI states.
   - **Zero Unhandled States**: Always provide explicit loading skeletons, empty states, and retryable error states.
   - **Modern APIs Only**: Never introduce deprecated APIs or legacy class components. React 19 Server Components by default; push `'use client'` to leaves.
   - **Zero Client Price Trust**: All order subtotals, delivery fees, and discounts must be authoritatively calculated on the server in `actions/cart-actions.ts`.

---

## 🎨 3. Frontend Design Standard: "Anti-Slop" Protocol

When designing or coding web interfaces, you are strictly prohibited from generating generic AI statistical defaults (interchangeable hero sections, random purple gradients, 3 identical cards, rounded-xl everywhere).

Enforce the **Five Mandatory Design Decisions**:
1. **Named Typography Pairing**: Pair `Plus Jakarta Sans` (Display & Titles) with `Inter` (Body & Numbers). Never use unstyled browser fallbacks.
2. **Tokenized Semantic Palette**: Use semantic CSS custom properties (`--brand-primary`, `--brand-accent`, `--bg-app`, `--text-ink`). Ban generic purple/rainbow gradients.
3. **Asymmetric Structural Layout**: 12-column desktop grid with offset hero copy and 2-column mobile card layout with fluid horizontal category pill rails.
4. **Orchestrated Spring Motion**: Single-coordinated load entrances (80ms stagger fade-up) and fluid spring micro-interactions (`transitions-dev`).
5. **Real Visual Assets**: Integrate actual, high-resolution grocery photography via Cloudinary rather than gray blank placeholder boxes.

---

## 🔌 4. MCP (Model Context Protocol) Server Usage Protocols

Prioritize specialized MCP tools over manual or generic terminal commands:

| MCP Server | When to Call | What Tool to Use |
| :--- | :--- | :--- |
| **`supabase`** | Managing database schema, running migrations, inspecting tables. | `list_tables`, `execute_sql`, `apply_migration` |
| **`agentation`** | Visual feedback and on-page browser annotations left by the user. | `agentation_get_all_pending`, `agentation_resolve`, `agentation_reply` |
| **`21st`** | Sourcing modern React / Tailwind / shadcn components. | `video_search_blocks`, `get_component`, `get_theme` |
| **`ui-skills`** | Live design guidelines, accessibility checklists, and layout rules. | `get_skill`, `list_skills` |
| **`whatfontis`** | Reverse-engineering typography and fonts from images or screenshots. | `identify_font` |
| **`github`** | Managing PRs, reviewing branches, opening issues, and syncing repos. | `mcp_github_*` (create_pull_request, search_repositories) |
| **`brainsync`** | Inter-agent synchronized memory across IDEs. | `sys_core_01` (search), `sys_core_02` (save note) |

---

## 🧭 5. Master Skill Orchestration Decision Matrix (239 Skills Active)

This workspace contains **239 installed skills** located in [`.agents/skills/`](file:///c:/Users/AARAV%20SONI/Documents/food-delivery-singlevendor/.agents/skills).
You MUST activate the appropriate skill before executing domain-specific tasks:

- **Reverse Engineering & Code Extraction**: Activate `reverse-engineer-anything` (scan `reference/enatega-singlevendor` to extract GraphQL SDL, Apollo operations, and API contracts).
- **UI & Storefront Design**: Activate `anti-slop-web-design`, `ui-ux-pro-max`, `baseline-ui`, `transitions-dev`, `transitions-polish`, `banner-design`.
- **System & API Architecture**: Activate `system-design`, `architecture-designer`, `c4-architecture`, `api-design`, `backend-to-frontend-handoff-docs`, `frontend-to-backend-requirements`.
- **Database & Schemas**: Activate `database-schema-designer`, `postgres-pro`, `database-optimizer`, `caching`.
- **Security & Quality Auditing**: Activate `codeguard`, `secure-code-review`, `secrets-scan`, `owasp-top-10-web`, `api-security`, `code-review-security`.
- **Agent & MCP Security**: Activate `agent-security-audit`, `agentic-ai-risk-assess`, `prompt-injection-test`, `mcp-server-review`.
- **Accessibility & SEO**: Activate `fixing-accessibility` (WCAG 2.1 AA check) and `fixing-metadata` (PWA meta tags, OpenGraph).
- **Git & Workflows**: Activate `commit-work`, `reducing-entropy`, `naming-analyzer`, `session-handoff`, `qa-test-planner`.

---

## 🔄 6. Live Feedback Workflow (Agentation Integration)

1. The developer navigates to their running app with `<Agentation />` embedded in development.
2. The user clicks on any element on the page to leave a visual note or bug report.
3. The AI agent executes: `agentation_get_all_pending()`.
4. The AI inspects the element selector, screenshot, and user comment.
5. The AI modifies the relevant component using `replace_file_content`.
6. The AI resolves the annotation: `agentation_resolve({ "id": "<annotation_id>" })`.
