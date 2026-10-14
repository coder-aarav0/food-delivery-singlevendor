# 🎨 UI Design Tokens: Master Style System

> **Document Type:** Context File 6 of 9 (UI Layer 1)  
> **Core Focus:** The Visual Tokens — Semantic CSS Custom Properties, Named Typography, 4px Spacing Scale, Radius, Shadows, and White-Label Theme Variables.  
> **Rule for AI Agents:** Never write hardcoded hex color codes (e.g., `#22c55e`, `#8b5cf6`) or arbitrary pixel values in component code. Always reference these CSS variables via `var(--token-name)` or mapped Tailwind semantic utilities.

---

## 🏛️ 1. Three-Layer Token Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       3-LAYER DESIGN TOKEN ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. PRIMITIVE LAYER (Raw Scales: Slate, Emerald, Amber, Rose, Neutral)       │
│    └── e.g. --color-emerald-700: #15803d;                                   │
│                                                                             │
│ 2. SEMANTIC LAYER (Purpose-Mapped: Brand, Surface, Text, Border, Status)   │
│    └── e.g. --primary: var(--brand-primary, var(--color-emerald-700));     │
│                                                                             │
│ 3. COMPONENT LAYER (Component-Specific Binding)                            │
│    └── e.g. --btn-primary-bg: var(--primary);                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 2. Master CSS Variables (`app/globals.css`)

```css
:root {
  /* =========================================================================
     1. WHITE-LABEL REBRANDING HOOKS (Injected from Store Database Settings)
     ========================================================================= */
  --brand-primary: #15803D;        /* Primary Supermarket Brand Green */
  --brand-primary-hover: #166534;  /* Darker Shade for Active/Hover */
  --brand-primary-light: #DCFCE7;  /* 10% Tint for Badges & Accents */
  --brand-accent: #EA580C;         /* High-Contrast Accent (Orange/Amber for CTAs) */
  --brand-accent-hover: #C2410C;
  --brand-accent-light: #FFEDD5;

  /* =========================================================================
     2. SEMANTIC SURFACE & BACKGROUND TOKENS (Light Mode Default)
     ========================================================================= */
  --bg-app: #F8FAFC;               /* Clean Hyperlocal Canvas (Slate 50) */
  --bg-surface: #FFFFFF;           /* Card & Sheet Background */
  --bg-surface-elevated: #FFFFFF;  /* Modals & Popovers */
  --bg-muted: #F1F5F9;             /* Skeletons, Pills, Secondary Chips */
  --bg-input: #FFFFFF;             /* Text Inputs & Search Bars */

  /* =========================================================================
     3. SEMANTIC TEXT & INK TOKENS
     ========================================================================= */
  --text-ink: #0F172A;             /* Slate 900 (High contrast headers & titles) */
  --text-body: #334155;            /* Slate 700 (Readable descriptions & labels) */
  --text-muted: #64748B;           /* Slate 500 (Timestamps, units, grammage) */
  --text-inverse: #FFFFFF;         /* White text on dark/brand backgrounds */

  /* =========================================================================
     4. SEMANTIC BORDERS & DIVIDERS
     ========================================================================= */
  --border-subtle: #E2E8F0;        /* Card Outlines & Dividers (Slate 200) */
  --border-strong: #CBD5E1;        /* Form Inputs & Active Outlines */
  --border-focus: var(--brand-primary);

  /* =========================================================================
     5. FEEDBACK & ORDER STATUS PALETTE
     ========================================================================= */
  --status-pending-bg: #FEF3C7;    --status-pending-text: #92400E; /* Amber */
  --status-preparing-bg: #E0E7FF;  --status-preparing-text: #3730A3; /* Indigo */
  --status-ready-bg: #CFFAFE;      --status-ready-text: #155E75; /* Cyan */
  --status-dispatched-bg: #FCE7F3; --status-dispatched-text: #9D174D; /* Pink */
  --status-delivered-bg: #DCFCE7;  --status-delivered-text: #166534; /* Emerald */
  --status-cancelled-bg: #FEE2E2;  --status-cancelled-text: #991B1B; /* Rose */

  /* =========================================================================
     6. TYPOGRAPHY SCALES (Named Pairing)
     ========================================================================= */
  --font-display: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;

  --text-xs: 0.75rem;     /* 12px - Badges, grammage tags */
  --text-sm: 0.875rem;    /* 14px - Body secondary, button labels */
  --text-base: 1.000rem;  /* 16px - Body default, prices */
  --text-lg: 1.125rem;    /* 18px - Subheaders, card titles */
  --text-xl: 1.250rem;    /* 20px - Section headers */
  --text-2xl: 1.500rem;   /* 24px - Modal headers, order status */
  --text-3xl: 1.875rem;   /* 30px - Hero banners, storefront titles */

  /* =========================================================================
     7. 4PX SPACING SCALE
     ========================================================================= */
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.50rem;  /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1.00rem;  /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.50rem;  /* 24px */
  --space-8: 2.00rem;  /* 32px */
  --space-10: 2.50rem; /* 40px */
  --space-12: 3.00rem; /* 48px */
  --space-16: 4.00rem; /* 64px */

  /* =========================================================================
     8. RADII & ELEVATIONS
     ========================================================================= */
  --radius-sm: 6px;    /* Chips & Micro badges */
  --radius-md: 10px;   /* Buttons, Form Inputs */
  --radius-lg: 16px;   /* Product Cards, Containers */
  --radius-xl: 24px;   /* Modals, Floating Bottom Sheets */
  --radius-full: 9999px; /* Round Pills & Avatars */

  --shadow-subtle: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03);
  --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04);
  --shadow-elevated: 0 12px 24px -4px rgba(0, 0, 0, 0.10), 0 4px 8px -2px rgba(0, 0, 0, 0.05);
  --shadow-sticky-bar: 0 -4px 16px rgba(0, 0, 0, 0.08);
}

/* =========================================================================
   DARK MODE OVERRIDES (Optional / Rider Night Delivery Mode)
   ========================================================================= */
.dark, [data-theme='dark'] {
  --bg-app: #090D16;
  --bg-surface: #111827;
  --bg-surface-elevated: #1F2937;
  --bg-muted: #1F2937;
  --bg-input: #111827;

  --text-ink: #F8FAFC;
  --text-body: #CBD5E1;
  --text-muted: #94A3B8;

  --border-subtle: #1E293B;
  --border-strong: #334155;
}
```

---

## 🏷️ 3. White-Label Rebranding Engine

To white-label the software for any supermarket client in under 60 seconds:
1. Update `stores` table row with the client's `brand_primary_hex` and `brand_accent_hex`.
2. The root server layout injects these values directly into the `:root` style tag on render:

```tsx
// app/layout.tsx
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const store = await getStoreConfiguration();

  const dynamicThemeStyles = `
    :root {
      --brand-primary: ${store.brand_primary_hex || '#15803D'};
      --brand-accent: ${store.brand_accent_hex || '#EA580C'};
    }
  `;

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: dynamicThemeStyles }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```
Result: All buttons, icons, active category pills, checkout triggers, and banners adapt automatically across Customer, Admin, and Rider views with **zero code recompilation**.
