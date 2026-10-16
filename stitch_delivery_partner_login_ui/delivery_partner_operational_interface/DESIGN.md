---
name: Delivery Partner Operational Interface
colors:
  surface: '#f8f9ff'
  surface-dim: '#d1dbec'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dfe9fa'
  surface-container-highest: '#d9e3f4'
  on-surface: '#121c28'
  on-surface-variant: '#4d4633'
  inverse-surface: '#27313e'
  inverse-on-surface: '#eaf1ff'
  outline: '#7e7761'
  outline-variant: '#d0c6ac'
  surface-tint: '#715d00'
  primary: '#715d00'
  on-primary: '#ffffff'
  primary-container: '#f7d02c'
  on-primary-container: '#6c5900'
  inverse-primary: '#e9c31c'
  secondary: '#575e70'
  on-secondary: '#ffffff'
  secondary-container: '#d9dff5'
  on-secondary-container: '#5c6274'
  tertiary: '#006d30'
  on-tertiary: '#ffffff'
  tertiary-container: '#86e898'
  on-tertiary-container: '#00692e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe176'
  primary-fixed-dim: '#e9c31c'
  on-primary-fixed: '#221b00'
  on-primary-fixed-variant: '#554500'
  secondary-fixed: '#dce2f7'
  secondary-fixed-dim: '#c0c6db'
  on-secondary-fixed: '#141b2b'
  on-secondary-fixed-variant: '#404758'
  tertiary-fixed: '#95f8a7'
  tertiary-fixed-dim: '#79db8d'
  on-tertiary-fixed: '#00210a'
  on-tertiary-fixed-variant: '#005323'
  background: '#f8f9ff'
  on-background: '#121c28'
  surface-variant: '#d9e3f4'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system is engineered for delivery partners navigating high-intensity, time-critical physical logistics. The emotional tone is reassuring, ultra-legible, prompt, and tactile. Operational safety and rapid glanceability under harsh direct sunlight dictate every visual decision. 

The aesthetic fuses utilitarian minimalism with modern tactile micro-feedback:
- **Direct Sunlight Visibility:** Stark chromatic contrast between dark ink text (`#111827`) and immaculate white cards (`#FFFFFF`) against a cooling cloud-gray operational canvas (`#F4F6F8`).
- **Tactile Utility:** Solid, physical touch targets featuring generous radii (`rounded-2xl` through `rounded-3xl`) designed for one-handed operation on motorcycle mounts, handling while wearing gloves, and peripheral attention scanning.
- **Urgent Clarity:** Blinkit Sunshine Yellow (`#F7D02C`) signals readiness, pending runs, acceptance actions, and status escalations without resorting to aggressive alert red unless safety or failure occurs.

## Colors

The palette balances intense sun-glare legibility with immediate hierarchy.

- **Primary Canvas (`#F4F6F8`):** An anti-glare, cool light-gray bedrock that cuts down optical eye fatigue during day-long shifts while establishing clear delineation for elevated white modules.
- **Surface Elevation (`#FFFFFF`):** Pure white container surfaces that maximize contrast ratios against the canvas and display ink.
- **Primary / Brand Accent (`#F7D02C`):** High-luminance Sunshine Yellow. Utilized for prime functional drivers (Accept Order, Start Trip, Slide to Deliver) and highlighted badges. Paired exclusively with dark ink text (`#111827`) to maintain AAA-grade contrast compliance.
- **Key Foreground / Ink (`#111827`):** Deep Obsidian Gray for primary text, directional iconography, and maximum optical weight.
- **Secondary Neutral (`#4B5563`):** Neutral slate for metadata, order IDs, timestamps, and route milestones.
- **Structural Outlines (`#E5E7EB`):** Crisp 1px structural definition for dividers and low-elevation resting states.
- **System States:**
  - Success/Active Earnings: `#15803D` (Forest Green)
  - Critical/Urgent Delay: `#DC2626` (Safety Crimson)
  - Informational/Navigation: `#1D4ED8` (Signal Blue)

## Typography

The typography pairing uses **Plus Jakarta Sans** for numerical metrics, trip status headings, and payout statistics to deliver a geometric, assertive display presence. **Inter** is deployed for body copy, address strings, instructions, and labels due to its tall x-height and exceptional legibility when viewed in motion or under direct sunlight.

Numerical figures—specifically distances, earnings (`₹`), countdown timers, and unit item counts—must always utilize tabular figures (`font-variant-numeric: tabular-nums`) to prevent layout shifts during live delivery updates.

## Layout & Spacing

This layout system is optimized primarily for vertical mobile screens mounted on handlebars or operated handheld.

- **Grid Architecture:** 4-column fluid mobile grid with 16px (`1rem`) outer margins and 16px gutters.
- **Rhythm & Touch Density:** Strict 4px base increment. Minimum target dimensions for interactive touch nodes must never drop below 48px by 48px, expanding to 56px–64px height for primary floating action panels and verification triggers.
- **Safe Zones:** Pinned bottom interaction trays require a minimum padding-bottom of 24px above system navigation bars to prevent accidental home-indicator gestures during rapid transit updates.

## Elevation & Depth

To remain fully legible in high-lux outdoor environments, depth is achieved through **tonal separation coupled with soft, high-clarity structural shadows** rather than faint diffuse blurs, which wash out in daylight.

1. **Base Level (Canvas):** `#F4F6F8` background.
2. **Surface Level 1 (Static Cards, Info Modules):** `#FFFFFF` surface with a 1px solid border in `#E5E7EB` and subtle ambient grounding: `0px 1px 3px rgba(17, 24, 39, 0.05)`.
3. **Surface Level 2 (Interactive Cards, Action Sheets, Floating Trays):** `#FFFFFF` surface with `box-shadow: 0px 8px 24px -4px rgba(17, 24, 39, 0.10), 0px 2px 6px -1px rgba(17, 24, 39, 0.04)`.
4. **Primary Floating Trigger (Sticky Accept/Deliver):** Grounded by a focused downward directional cast: `0px 10px 20px -3px rgba(247, 208, 44, 0.45)`.

## Shapes

The design features friendly, approachable, and ergonomic geometry:
- **Base Surfaces & Modules:** `rounded-2xl` (16px / `1rem`) for order item cards, metric blocks, and inputs.
- **Primary Hero Sheets & Critical Modals:** `rounded-3xl` (24px / `1.5rem`) for bottom task sheets, incoming dispatch alerts, and store pickup checklists.
- **Pills & Chips:** Fully rounded (`rounded-full` / `9999px`) for order stage badges, phone dialer actions, and active navigation status indicators.

## Components

### Action Buttons & Primary Controls
- **Sunshine Action Button:** Solid `#F7D02C` background, `#111827` semibold text, 56px height, `rounded-2xl`. Employs tactile physical feedback: on tap, button scales down to `0.98` with an inner border `#E2BC20`.
- **Slide-to-Confirm Bar:** Outer pill capsule `#FFFFFF` with `#E5E7EB` border. Inner circular puck in `#F7D02C` containing an obsidian direction chevron (`#111827`), requiring an uninterrupted swipe across the screen width to confirm order handoff.
- **Secondary Dark Utility Button:** Solid `#111827` background with pure white text, 48px height, for secondary actions like "Call Dark Store" or "Open Maps".

### Order & Task Cards
- **Structure:** Clean white `#FFFFFF` surface, `rounded-2xl` geometry, encased in a 1px border (`#E5E7EB`). 
- **Internal Rhythm:** 16px internal padding. Pickup information and drop destination are separated by an explicit dashed connector line, visually anchored by a green origin dot and a red drop-off pin.

### Status Chips & Badges
- **Active / Pending Chips:** Fully rounded pills (`rounded-full`) with a 6px internal colored indicator ring. 
- **Palette Rules:**
  - Prepared: `#FEF9C3` background with `#854D0E` text.
  - Delivering: `#DCFCE7` background with `#166534` text.
  - Delay Warning: `#FEE2E2` background with `#991B1B` text.

### Form Inputs & OTP Verification
- **OTP Input Cells:** 56px × 56px individual numeric blocks with `rounded-xl`, `#FFFFFF` background, and 2px `#E5E7EB` border. Upon focus, shifts directly to a high-contrast 2px `#111827` border with a subtle `#F7D02C` ambient glow.
- **Checkbox & Task Checklist:** 24px × 24px square with `rounded-lg` corners. Unchecked state: `#FFFFFF` with 2px `#D1D5DB`. Checked state: `#111827` fill with crisp white `#FFFFFF` checkmark.

### Live Metric Tiles (Earnings & Deliveries)
- Split 2-column or 3-column modular cards (`rounded-2xl`) with secondary gray labels (`body-sm`, `#4B5563`) stacked above extra-bold display metrics (`Plus Jakarta Sans`, 24px, `#111827`).