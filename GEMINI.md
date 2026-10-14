# 🤖 Gemini & Antigravity Operating Instructions (GEMINI.md)

> **Antigravity Rule**: Automatically loaded by Google Antigravity and Gemini agents operating within this repository.

---

## 📚 1. Mandatory Context Reference: The 9 Master Context Files
Before executing any prompt, task, or file modification, read and follow the authoritative context files:

1. **[`project-overview.md`](file:///c:/Users/AARAV%20SONI/Documents/food-delivery-singlevendor/project-overview.md)**: The WHAT — Grocery Delivery Platform vision, Customer PWA, Admin Panel, Rider App, TEA State architecture, and PostHog analytics.
2. **[`architecture.md`](file:///c:/Users/AARAV%20SONI/Documents/food-delivery-singlevendor/architecture.md)**: The HOW — Next.js 16 + React 19 stack, Supabase PostgreSQL schema with RLS, Server Actions, and Realtime channels.
3. **[`build-plan.md`](file:///c:/Users/AARAV%20SONI/Documents/food-delivery-singlevendor/build-plan.md)**: The WHEN & ORDER — Phased execution roadmap (Phases 0–6).
4. **[`code-standards.md`](file:///c:/Users/AARAV%20SONI/Documents/food-delivery-singlevendor/code-standards.md)**: Code Quality — Zero `any`, strict TypeScript, naming rules, 4-state screens (Loading/Success/Empty/Error).
5. **[`library-docs.md`](file:///c:/Users/AARAV%20SONI/Documents/food-delivery-singlevendor/library-docs.md)**: Tool Recipes — Verified patterns for Supabase, Razorpay, Cloudinary, and PostHog.
6. **[`ui-tokens.md`](file:///c:/Users/AARAV%20SONI/Documents/food-delivery-singlevendor/ui-tokens.md)**: UI Layer 1 — 3-layer tokens, master CSS variables, and white-label theme engine.
7. **[`ui-rules.md`](file:///c:/Users/AARAV%20SONI/Documents/food-delivery-singlevendor/ui-rules.md)**: UI Layer 2 — Anti-Slop protocol, 44px mobile touch targets, card anatomy, and spring motion.
8. **[`ui-registry.md`](file:///c:/Users/AARAV%20SONI/Documents/food-delivery-singlevendor/ui-registry.md)**: UI Layer 3 — Living component catalog. Check to avoid duplication; register new UI components here.
9. **[`progress-tracker.md`](file:///c:/Users/AARAV%20SONI/Documents/food-delivery-singlevendor/progress-tracker.md)**: Living State — Master progress checklist across all phases.

---

## 🛡️ 2. Core Invariants & Safety Rules
1. **Docker-Free GitHub**: Use Node/NPX-based `@modelcontextprotocol/server-github` via `.mcp.json`. Never prompt or spawn Docker containers.
2. **Git Integrity**: Never execute `git clean -fd` or destructive resets without verifying clean backups.
3. **Strict TypeScript**: Zero `any` types. Strongly-typed interfaces for all component props, API payloads, and state.
4. **Zero Client Price Trust**: Order subtotals, delivery fees, and discounts must be authoritatively calculated on the server in `actions/cart-actions.ts`.
5. **Anti-Slop Web Design**:
   - Distinctive typography pair (`Plus Jakarta Sans` Display + `Inter` Body).
   - Token-based semantic CSS properties; no generic purple gradients.
   - Asymmetric layout rhythm with real Cloudinary grocery media assets.
   - Orchestrated transitions using spring physics (`transitions-dev`).

---

## 🔌 3. Primary MCP Tools
- **`supabase`**: Database queries, migrations, RLS checks, Edge functions.
- **`agentation`**: Read live visual feedback via `agentation_get_all_pending()`.
- **`21st`**: Retrieve modern React / Tailwind / shadcn components via `video_search_blocks` and `get_component`.
- **`ui-skills`**: Query design and accessibility standards via `get_skill`.
- **`whatfontis`**: Identify fonts from images via `identify_font`.
- **`github`**: Repository synchronization, PRs, branch management.
- **`brainsync`**: Inter-agent synchronized memory and rules enforcement (`sys_core_*`).

---

## 🧭 4. Skill Decision Matrix (Quick Triggers)
- **Reverse Engineering**: `reverse-engineer-anything`, `api-design`.
- **Storefront & UI/UX**: `anti-slop-web-design`, `ui-ux-pro-max`, `baseline-ui`, `transitions-dev`, `fixing-accessibility`, `fixing-metadata`.
- **Architecture & System Design**: `system-design`, `architecture-designer`, `c4-architecture`, `api-design`, `database-schema-designer`.
- **Database & Supabase**: `database-schema-designer`, `postgres-pro`, `database-optimizer`, `caching`.
- **Security & Vulnerability Auditing**: `codeguard`, `secure-code-review`, `secrets-scan`, `owasp-top-10-web`, `agent-security-audit`.
- **Developer Workflows**: `commit-work`, `reducing-entropy`, `naming-analyzer`, `session-handoff`.
