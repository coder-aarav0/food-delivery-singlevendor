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
| **`LiveRiderMap`** | `components/customer/LiveRiderMap.tsx` | 🟢 `READY` | 100% Free Leaflet + OpenStreetMap road map with animated rider marker & telemetry |
| **`AddressSelectModal`** | `components/customer/AddressSelectModal.tsx` | 🟢 `READY` | Modal to switch saved delivery addresses or add a new address during checkout |
| **`CheckoutCrossSell`** | `components/customer/CheckoutCrossSell.tsx` | 🟢 `READY` | Impulse cross-sell grocery shelf ("You Might Also Like") with 1-tap cart integration |
| **`PackagingSelector`** | `components/customer/PackagingSelector.tsx` | 🟢 `READY` | Packaging preferences (Eco Bag, Zero Waste, Premium Gift Wrap + personalized note) |

---

## 🏪 4. Store Admin Components (`components/admin/`)

| Component Name | File Path | Status | Key Props / Purpose |
| :--- | :--- | :--- | :--- |
| **`AdminSidebar`** | `components/admin/AdminSidebar.tsx` | 🟢 `READY` | Navigation sidebar with live store open/closed toggle switch |
| **`LiveDispatchKanban`** | `components/admin/LiveDispatchKanban.tsx` | 🟢 `READY` | 4-column packing station with audio chime on `INSERT` |
| **`KanbanOrderCard`** | `components/admin/KanbanOrderCard.tsx` | 🟢 `READY` | Elapsed timer, item checklist, Accept button, Rider picker |
| **`ThermalSlipDialog`** | `components/admin/ThermalSlipDialog.tsx` | 🟢 `READY` | Printable 80mm thermal receipt format for store packing staff |
| **`SKUTable`** | `components/admin/SKUTable.tsx` | 🟢 `READY` | Paginated product table with one-click `In Stock` / `Out of Stock` |
| **`RiderFleetManager`** | `components/admin/RiderFleetManager.tsx` | 🟢 `READY` | Active fleet status (Online/Busy), coordinates, cash in hand settlement |
| **`GeofenceManager`** | `components/admin/GeofenceManager.tsx` | 🟢 `READY` | Interactive delivery radius slider, base fee, and free delivery thresholds |
| **`StoreSettingsForm`** | `components/admin/StoreSettingsForm.tsx` | 🟢 `READY` | Color pickers for primary/accent, store identity, operating hours |

---

## 🛵 5. Delivery Rider Components (`components/rider/`)

| Component Name | File Path | Status | Key Props / Purpose |
| :--- | :--- | :--- | :--- |
| **`DutyToggleHeader`** | `components/rider/DutyToggleHeader.tsx` | 🟢 `READY` | High-contrast `Go Online` / `Go Offline` switch + GPS broadcaster + battery gauge |
| **`IncomingOrderModal`** | `components/rider/IncomingOrderModal.tsx` | 🟢 `READY` | 60-second countdown alert with synthesized chime, distance, and one-tap Accept |
| **`DeliveryNavigationCard`**| `components/rider/DeliveryNavigationCard.tsx`| 🟢 `READY` | Turn-by-turn navigation, packing checklist, call customer, and Google Maps deep-links |
| **`OtpVerificationModal`**| `components/rider/OtpVerificationModal.tsx`| 🟢 `READY` | 4-digit PIN keypad to enter customer delivery OTP + COD cash collection prompt |
| **`RiderDashboard`** | `components/rider/RiderDashboard.tsx` | 🟢 `READY` | Active delivery card, live dispatch feed, and Supabase Realtime dispatch listener |
| **`RiderBottomNav`** | `components/rider/RiderBottomNav.tsx` | 🟢 `READY` | Mobile bottom navigation between Deliveries feed and Shift Earnings ledger |

---

## 📝 6. Component Registration Workflow
Whenever an agent creates a new component:
1. Verify it does not duplicate an existing entry in the table above.
2. Build the component matching `ui-tokens.md` and `ui-rules.md`.
3. Update this file: change status from `PLANNED` to `READY` and confirm the file path.
