# 📐 Engineering Code Standards & Conventions

> **Document Type:** Context File 4 of 9  
> **Core Focus:** How to Write Code — TypeScript Rules, Naming Conventions, Next.js 16 / React 19 Patterns, Component Structures, Server Action Standards, and Error Handling.  
> **Rule for AI Agents:** Enforce these rules across every file, component, action, and database query. Do not introduce alternative patterns or legacy syntax.

---

## 🛡️ 1. TypeScript Strictness & Type Safety Rules

### 1.1 The Zero-`any` Invariant
- **Rule:** The `any` keyword is **strictly banned** across the entire codebase.
- Use explicit interfaces, generics, `unknown` with runtime type narrowing, or discriminated unions.
- If handling untyped external API payloads (e.g., third-party webhooks), validate via `Zod` or custom TypeScript type guards before consumption.

```typescript
// ❌ UNACCEPTABLE: Generic or implicit any
async function handleWebhook(payload: any) {
  console.log(payload.orderId);
}

// ✅ MANDATORY: Strongly typed with Discriminated Union
interface RazorpayPaymentCapturedPayload {
  entity: 'event';
  event: 'payment.captured';
  payload: {
    payment: {
      entity: {
        id: string;
        order_id: string;
        amount: number;
        status: 'captured';
      };
    };
  };
}

function isPaymentCapturedEvent(event: unknown): event is RazorpayPaymentCapturedPayload {
  return (
    typeof event === 'object' &&
    event !== null &&
    (event as { event?: string }).event === 'payment.captured'
  );
}
```

### 1.2 State Discriminated Unions (No Boolean Explosion)
Avoid multiple separate booleans like `isLoading`, `isError`, `isSuccess`, `isEmpty`. Model complex component data lifecycles as a single discriminated union:

```typescript
// ❌ BAD: Can produce impossible states (e.g. isLoading=true AND isError=true)
const [isLoading, setIsLoading] = useState(false);
const [isError, setIsError] = useState(false);
const [data, setData] = useState<Order | null>(null);

// ✅ GOOD: Mathematically impossible invalid states
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'empty'; message: string }
  | { status: 'error'; error: string; retry: () => void };
```

---

## 🏷️ 2. Naming Conventions Matrix

| Category | Convention | Examples |
| :--- | :--- | :--- |
| **Components** | `PascalCase` | `ProductCard.tsx`, `LiveDispatchKanban.tsx`, `CartDrawer.tsx` |
| **Files & Directories** | `kebab-case` | `product-actions.ts`, `cart-drawer/`, `order-status-badge.tsx` |
| **Server Actions** | `camelCase` + verb | `calculateCartTotal()`, `placeOrder()`, `verifyDeliveryOtp()` |
| **Interfaces & Types** | `PascalCase` | `Product`, `OrderRecord`, `CartItem`, `StoreConfig` |
| **Database Tables** | `snake_case` plural | `stores`, `product_variations`, `order_status_logs` |
| **Database Columns** | `snake_case` | `store_id`, `is_in_stock`, `created_at`, `total_amount` |
| **Constants & Enums** | `UPPER_SNAKE_CASE` | `DEFAULT_DELIVERY_RADIUS_KM`, `MAX_OTP_ATTEMPTS` |
| **Custom Hooks** | `camelCase` + `use` prefix | `useStoreConfig()`, `useRealtimeOrder()`, `useGeolocation()` |

---

## ⚡ 3. Next.js 16 & React 19 Architectural Conventions

### 3.1 Server Components by Default
- Every page (`page.tsx`) and layout (`layout.tsx`) is a **Server Component** by default.
- Never add `'use client'` at the top of a file unless it strictly requires:
  - React state hooks (`useState`, `useReducer`)
  - Browser lifecycle hooks (`useEffect`, `useCallback`)
  - Browser window/navigator APIs (Geolocation, Audio playback, LocalStorage)
  - Interactive event listeners (`onClick`, `onChange`, `onSubmit`)
- Push `'use client'` down to the smallest possible leaf component.

```tsx
// app/(customer)/page.tsx (Server Component)
import { getFeaturedProducts } from '@/actions/product-actions';
import { ProductShelf } from '@/components/customer/ProductShelf';

export default async function HomePage() {
  const products = await getFeaturedProducts(); // Fast direct database fetch
  return (
    <main className="space-y-6 pb-24">
      <HeroBanner />
      {/* Client interactivity is encapsulated inside ProductShelf */}
      <ProductShelf initialProducts={products} />
    </main>
  );
}
```

### 3.2 Server Actions Convention (`'use server'`)
All data mutations (creating orders, updating inventory, updating store settings) must be executed via Next.js Server Actions placed in `actions/*.ts`:

- Always begin file with `'use server'`.
- Return a standardized Result object:
  ```typescript
  type ActionResult<T> =
    | { success: true; data: T }
    | { success: false; error: string; code?: string };
  ```
- Always validate session & authorization before modifying data.
- Always validate inputs using schema checkers or type guards.

```typescript
// actions/order-actions.ts
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { ActionResult } from '@/types/models';

export async function cancelOrder(orderId: string, reason: string): Promise<ActionResult<{ orderId: string }>> {
  const supabase = await createServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Unauthorized: Please log in.', code: 'UNAUTHORIZED' };
  }

  // Validate ownership or admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const { error: updateError } = await supabase
    .from('orders')
    .update({
      status: 'CANCELLED',
      cancellation_reason: reason,
      cancelled_at: new Date().toISOString()
    })
    .eq('id', orderId)
    .select()
    .single();

  if (updateError) {
    return { success: false, error: updateError.message, code: 'DB_ERROR' };
  }

  return { success: true, data: { orderId } };
}
```

---

## 🎨 4. Component Structure & Template Standard

Every component in `components/` must follow this uniform structure:

```tsx
// components/customer/ProductCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { ProductWithVariations } from '@/types/models';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

// 1. Props Interface
export interface ProductCardProps {
  product: ProductWithVariations;
  onAddToCart?: (variationId: string) => void;
  className?: string;
}

// 2. Component Implementation
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  className = '',
}) => {
  const defaultVariation = product.variations[0];
  const isInStock = defaultVariation?.is_in_stock ?? false;

  return (
    <article
      data-testid={`product-card-${product.id}`}
      className={`group relative flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 transition-all duration-200 hover:shadow-md ${className}`}
    >
      {/* Media with Cloudinary responsive image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[var(--bg-muted)]">
        <Image
          src={product.image_url || '/placeholder-grocery.png'}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {!isInStock && (
          <span className="absolute left-2 top-2 rounded-md bg-rose-600 px-2 py-0.5 text-xs font-semibold text-white">
            Out of Stock
          </span>
        )}
      </div>

      {/* Content */}
      <div className="mt-3 flex flex-1 flex-col justify-between">
        <div>
          <span className="text-xs font-medium text-[var(--text-muted)]">
            {defaultVariation?.title}
          </span>
          <h3 className="line-clamp-2 text-sm font-semibold text-[var(--text-ink)]">
            {product.name}
          </h3>
        </div>

        {/* Pricing & Add Trigger */}
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
          <div className="flex flex-col">
            <span className="text-base font-bold text-[var(--text-ink)]">
              {formatCurrency(defaultVariation?.price ?? 0)}
            </span>
            {defaultVariation?.discounted_price && (
              <span className="text-xs text-[var(--text-muted)] line-through">
                {formatCurrency(defaultVariation.discounted_price)}
              </span>
            )}
          </div>

          <Button
            size="sm"
            variant="primary"
            disabled={!isInStock}
            onClick={() => defaultVariation && onAddToCart?.(defaultVariation.id)}
            aria-label={`Add ${product.name} to cart`}
          >
            Add
          </Button>
        </div>
      </div>
    </article>
  );
};
```

---

## 🚨 5. Error Handling & State Resilience Standards

### 5.1 Mandatory Four-State Screen Checklist
Every screen or container component that fetches data must explicitly handle all four states:

1. **Loading State:** Render animated skeletons (`SkeletonCard`, `SkeletonList`) that match the exact visual shape of incoming data. Never show an unstyled blank canvas.
2. **Success State:** Populated data view with fluid staggered entrance animation.
3. **Empty State:** Distinctive graphic or icon, descriptive message (e.g., *"Your cart is empty — explore our fresh produce to get started"*), and a clear Call to Action button.
4. **Error State:** Human-friendly explanation, non-technical message, and a **"Try Again"** button that re-executes the operation.

### 5.2 Server Action Error Wrapping
Server Actions must never throw unhandled exceptions to the client:
- Wrap async execution in `try / catch`.
- Log the technical stack trace on the server for debugging.
- Return a friendly error message to the client.

```typescript
try {
  // Database mutation...
  return { success: true, data: result };
} catch (err: unknown) {
  console.error('[Action Error: placeOrder]', err);
  const message = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
  return { success: false, error: message, code: 'INTERNAL_ERROR' };
}
```
