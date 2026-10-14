# 👁️ UI Rules & Visual Behavioral Guidelines

> **Document Type:** Context File 7 of 9 (UI Layer 2)  
> **Core Focus:** How the UI Behaves — Layout Rhythm, Component Anatomy, Mobile Touch Ergonomics, Orchestrated Motion, and Anti-Slop Enforcement.  
> **Rule for AI Agents:** Every page, modal, and drawer must adhere strictly to these visual patterns to guarantee that all three portals (Customer PWA, Admin Panel, Rider App) feel like a unified, world-class product.

---

## 🚫 1. Anti-Slop Web Design Protocol

When building interfaces, AI agents are strictly prohibited from generating generic statistical defaults. Enforce these five mandatory rules:

1. **Named Typography Pairing:**
   - **Display / Headers:** `Plus Jakarta Sans` (Font weight: 700 / 800 for storefront heroes, product titles, and modal headers).
   - **Body / Numbers / UI:** `Inter` (Font weight: 400 for descriptions, 500 for labels, 600 for prices and order numbers).
   - **Banned:** Generic browser fallbacks (Arial, Times New Roman, unstyled Helvetica).
2. **Tokenized Semantic Palette (No Purple Gradients):**
   - Use curated supermarket colors (Fresh Emerald Greens `--brand-primary`, Warm Amber/Orange `--brand-accent` for CTAs, Slate `--bg-app` for crisp contrast).
   - **Banned:** Generic AI purple/cyan linear-gradients (`bg-gradient-to-r from-purple-500 to-indigo-500`).
3. **Asymmetric Layout Rhythm:**
   - Banners and hero shelves must have visual hierarchy: prominent featured product spotlight, horizontal scrollable category rails, and 2-column mobile grid.
   - **Banned:** Repetitive rows of 3 identical rectangular cards with no focal point.
4. **Orchestrated Spring Motion (`transitions-dev`):**
   - Single coordinated entrance: 80ms stagger on product shelves and category icons.
   - Fluid spring physics on button press: `scale(0.97)` on tap with instant 150ms spring release.
5. **Real Photography & Visual Assets:**
   - Every product card must show a crisp, high-resolution grocery asset via Cloudinary or optimized SVG.
   - **Banned:** Gray blank placeholder rectangles or generic `<div>Image</div>` boxes.

---

## 📱 2. Mobile Ergonomics & Touch Target Guidelines

Because the **Customer PWA** and **Delivery Rider App** are operated one-handed on mobile devices:

1. **44px Minimum Touch Targets:**
   - Every clickable button, quantity stepper (`+` / `-`), category pill, and back arrow must measure at least **44x44px** in interactive hitbox area.
2. **Bottom-Screen "Thumb Zone" Prioritization:**
   - Critical purchase triggers (Sticky Cart bar, "Proceed to Pay", "Accept Order", "Verify Delivery OTP") must be anchored to the bottom of the mobile viewport with safe area padding (`pb-safe`).
3. **Sticky Cart Indicator:**
   - When items exist in the customer cart, a persistent floating bottom bar must appear showing:
     - Left: Item count badge + Total price (`₹420`)
     - Right: Prominent "View Cart →" action button.
4. **Haptic & Visual Feedback:**
   - Active press state on all interactive buttons: `active:scale-[0.98] active:brightness-95 transition-transform`.

---

## 📦 3. Core Component Anatomy Rules

### 3.1 Product Cards (Grid & Shelf)
- **Aspect Ratio:** Image container must be strictly **1:1 square** (`aspect-square`) with `object-cover`.
- **Card Padding:** `p-3` (12px) on mobile; `p-4` (16px) on desktop.
- **Border & Background:** `bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl`.
- **Grammage Chip:** Always display weight/unit (e.g. `500 ml`, `1 kg`) directly above product name in `text-xs text-[var(--text-muted)] font-medium`.
- **Price Hierarchy:** Current price in bold (`text-base font-bold text-[var(--text-ink)]`); original price in strikethrough (`text-xs text-[var(--text-muted)] line-through ml-1.5`).
- **Stock State:** If `stock_quantity <= 0`, disable Add button, apply `opacity-60` to image, and show a red "Out of Stock" badge on the top-left of the image.

### 3.2 Buttons & Action Triggers
- **Primary Action (Brand Green / Amber):**
  `bg-[var(--brand-primary)] text-white font-semibold rounded-xl px-4 py-2.5 hover:bg-[var(--brand-primary-hover)] shadow-sm`
- **Secondary Action (Subtle Outline):**
  `bg-white border border-[var(--border-strong)] text-[var(--text-body)] font-medium rounded-xl px-4 py-2.5 hover:bg-[var(--bg-muted)]`
- **Destructive Action (Cancel / Out of Stock):**
  `bg-rose-50 border border-rose-200 text-rose-700 font-medium rounded-xl px-4 py-2.5 hover:bg-rose-100`
- **Floating Cart Action (High Contrast):**
  `bg-[var(--brand-accent)] text-white font-bold rounded-2xl shadow-elevated px-5 py-3.5 flex items-center justify-between`

### 3.3 Status Badges & Pills
- Status badges must always pair a light tinted background with dark text for high readability (AA contrast ratio):
  - **PENDING:** `bg-amber-100 text-amber-900 border border-amber-200`
  - **ACCEPTED / PACKING:** `bg-indigo-100 text-indigo-900 border border-indigo-200`
  - **READY FOR PICKUP:** `bg-cyan-100 text-cyan-900 border border-cyan-200`
  - **OUT FOR DELIVERY:** `bg-pink-100 text-pink-900 border border-pink-200`
  - **DELIVERED:** `bg-emerald-100 text-emerald-900 border border-emerald-200`
  - **CANCELLED:** `bg-rose-100 text-rose-900 border border-rose-200`

---

## ♿ 4. Accessibility (WCAG 2.1 AA) Rules

1. **Color Contrast:** All body text (`--text-body`) and headers (`--text-ink`) against `--bg-app` and `--bg-surface` must achieve at least **4.5:1 contrast ratio**.
2. **Screen Reader Labels:** All icon-only buttons (Cart close button, Search clear `×`, Stepper `+` and `-`) must include explicit `aria-label` attributes.
3. **Visible Focus Rings:** Every interactive control must have an accessible focus indicator for keyboard users: `focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:outline-none`.
4. **Form Inputs:** Every text input must have an associated semantic `<label>` or `aria-labelledby` reference.
