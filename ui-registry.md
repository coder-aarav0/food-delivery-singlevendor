# 🗃️ Living UI Component Registry

> **Document Type:** Context File 8 of 9 (UI Layer 3)  
> **Core Focus:** Living Component Catalog — Prevention of Duplicate Code, Canonical Prop Interfaces, and Component Implementation Status.  
> **Rule for AI Agents:** Before building any new UI element, consult this registry. If a component already exists, reuse it or extend its props. When creating a new component, follow `ui-rules.md` and `ui-tokens.md`, then append it to this document.

---

## 📋 1. Registry Status Legend

| Status | Meaning |
| :--- | :--- |
| 🟡 `PLANNED` | Spec defined; implementation queued in `build-plan.md`. |
| 🔵 `IN_PROGRESS` | Currently being authored or refactored. |
| 🟢 `READY` | Authored, styled with CSS tokens, and verified against `ui-rules.md`. |
| 🟣 `TESTED` | End-to-end verified with Playwright or browser interaction. |

---

## 🧱 2. Atomic Base UI Components (`components/ui/`)

| Component Name | File Path | Status | Key Props / Purpose |
| :--- | :--- | :--- | :--- |
| **`Button`** | `components/ui/Button.tsx` | 🟢 `READY` | `variant` (`primary`, `secondary`, `accent`, `destructive`, `outline`, `ghost`), `size` (`sm`, `md`, `lg`), `isLoading` |
| **`Badge`** | `components/ui/Badge.tsx` | 🟢 `READY` | Status pill (`PENDING`, `PREPARING`, `DISPATCHED`, `DELIVERED`, `discount`, `outOfStock`) |
| **`Modal`** | `components/ui/Modal.tsx` | 🟢 `READY` | Accessible dialog with backdrop blur, focus trap, and close on escape |
| **`Skeleton`** | `components/ui/Skeleton.tsx` | 🟢 `READY` | Animated shimmer placeholder matching target element dimensions |
| **`QuantityStepper`** | `components/ui/QuantityStepper.tsx` | 🟢 `READY` | `+` and `-` quantity controls with 44px touch targets |

---

## 🛒 3. Customer PWA Components (`components/customer/`)

| Component Name | File Path | Status | Key Props / Purpose |
| :--- | :--- | :--- | :--- |
| **`ProductCard`** | `components/customer/ProductCard.tsx` | 🟢 `READY` | 1:1 image, title, grammage, pricing, stock check, Add trigger |
| **`CategoryPillBar`** | `components/customer/CategoryPillBar.tsx` | 🟢 `READY` | Fast horizontal scroll rail of circular category icons + label |
| **`StickyCartBar`** | `components/customer/StickyCartBar.tsx` | 🟢 `READY` | Floating bottom bar showing item count, total price, and "View Cart →" |
| **`ProductDetailModal`** | `components/customer/ProductDetailModal.tsx` | 🟢 `READY` | Full product view with grammage variation selector and details |
| **`StorefrontHero`** | `components/customer/StorefrontHero.tsx` | 🟢 `READY` | High-impact hero banner with copyable coupon pills & delivery SLA |
| **`StorefrontHeader`** | `components/customer/StorefrontHeader.tsx` | 🟢 `READY` | Top header with address badge, search input, and cart button |
| **`CartDrawer`** | `components/customer/CartDrawer.tsx` | 🟢 `READY` | Slide-over cart review with free delivery bar & substitution preferences |
| **`LiveOrderTracker`**| `components/customer/LiveOrderTracker.tsx` | 🟢 `READY` | Realtime status stepper, estimated arrival, and 4-digit OTP box |
| **`LiveRiderMap`** | `components/customer/LiveRiderMap.tsx` | 🟢 `READY` | Simulated route waypoint view connecting store, rider, and house |

---

## 🏪 4. Store Admin Components (`components/admin/`)

| Component Name | File Path | Status | Key Props / Purpose |
| :--- | :--- | :--- | :--- |
| **`LiveDispatchKanban`** | `components/admin/LiveDispatchKanban.tsx` | 🟡 `PLANNED` | 4-column packing station with audio chime on `INSERT` |
| **`KanbanOrderCard`** | `components/admin/KanbanOrderCard.tsx` | 🟡 `PLANNED` | Elapsed timer, item checklist, Accept button, Rider picker |
| **`ThermalSlipDialog`** | `components/admin/ThermalSlipDialog.tsx` | 🟡 `PLANNED` | Printable 80mm thermal receipt format for store packing staff |
| **`SKUTable`** | `components/admin/SKUTable.tsx` | 🟡 `PLANNED` | Paginated product table with one-click `In Stock` / `Out of Stock` |
| **`VariationEditor`** | `components/admin/VariationEditor.tsx` | 🟡 `PLANNED` | Add/edit pack sizes (500g, 1kg) and prices per product |
| **`RiderRosterTable`** | `components/admin/RiderRosterTable.tsx` | 🟡 `PLANNED` | Active fleet status (Online/Busy), battery level, cash in hand |
| **`GeofenceZoneMap`** | `components/admin/GeofenceZoneMap.tsx` | 🟡 `PLANNED` | Interactive delivery radius / polygon editor with fee sliders |
| **`BrandThemeCustomizer`**| `components/admin/BrandThemeCustomizer.tsx`| 🟡 `PLANNED` | Color pickers for primary/accent, logo upload, live preview |

---

## 🛵 5. Delivery Rider Components (`components/rider/`)

| Component Name | File Path | Status | Key Props / Purpose |
| :--- | :--- | :--- | :--- |
| **`DutyToggleHeader`** | `components/rider/DutyToggleHeader.tsx` | 🟡 `PLANNED` | High-contrast `Go Online` / `Go Offline` switch + GPS indicator |
| **`IncomingOrderModal`** | `components/rider/IncomingOrderModal.tsx` | 🟡 `PLANNED` | 60-second countdown alert with sound, distance, and Accept button |
| **`DeliveryNavigationCard`**| `components/rider/DeliveryNavigationCard.tsx`| 🟡 `PLANNED` | Customer address, phone call trigger, Google Maps navigation button |
| **`OtpVerificationModal`**| `components/rider/OtpVerificationModal.tsx`| 🟡 `PLANNED` | 4-digit PIN keypad to enter customer delivery OTP |
| **`CashHandoverLedger`** | `components/rider/CashHandoverLedger.tsx` | 🟡 `PLANNED` | Summary of today's completed orders and COD cash held |

---

## 📝 6. Component Registration Workflow
Whenever an agent creates a new component:
1. Verify it does not duplicate an existing entry in the table above.
2. Build the component matching `ui-tokens.md` and `ui-rules.md`.
3. Update this file: change status from `PLANNED` to `READY` and confirm the file path.
