# 📚 Library Docs & Tool Integration Playbook

> **Document Type:** Context File 5 of 9  
> **Core Focus:** How to Use the Tools — Concrete, Project-Tailored Implementations for Supabase, Razorpay, Cloudinary, PostHog, GraphQL Yoga, Agentation, and MCP Server Integrations.  
> **Rule for AI Agents:** Before using or modifying any third-party integration, check this document for verified patterns and environment variable mappings.

---

## ⚡ 1. Master Tool & Environment Variables Matrix

| Tool / Library | Primary Package | Role in Single-Vendor Platform | Associated MCP Tool / Command |
| :--- | :--- | :--- | :--- |
| **Supabase** | `@supabase/ssr`, `@supabase/supabase-js` | PostgreSQL, Auth, Realtime Orders & Rider Tracking | `supabase` MCP (`list_tables`, `execute_sql`) |
| **Razorpay** | `razorpay` | UPI, Debit/Credit Card, NetBanking Payment Gateway | Webhook Route: `/api/webhooks/razorpay` |
| **Cloudinary** | `cloudinary` | High-res grocery photography, auto WebP compression | `lib/cloudinary.ts` |
| **GraphQL Yoga** | `graphql-yoga` | Enatega Drop-in Compatible GraphQL API | Route: `/api/graphql` |
| **PostHog** | `posthog-js`, `posthog-node` | Customer order funnels, rider delivery SLAs | Server & Client Event Instrumentation |
| **Agentation** | `agentation`, `agentation-mcp` | On-page visual annotations & feedback loop | `agentation_get_all_pending`, `agentation_resolve` |
| **21st.dev** | Remote MCP | Production React/Tailwind UI components | `video_search_blocks`, `get_component` |
| **UI Skills** | Remote MCP | Accessibility rules & token extraction | `get_skill`, `list_skills` |

---

## 🗄️ 2. Supabase Integration Patterns

### 2.1 Server Action Client (`@supabase/ssr`)
Used in Server Components and Next.js 16 Server Actions to execute queries with the user's authenticated cookie session:

```typescript
// lib/supabase/server.ts
import { createServerClient as createClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/database.types';

export async function createServerClient() {
  const cookieStore = await cookies();

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from Server Component; ignore if read-only
          }
        },
      },
    }
  );
}
```

### 2.2 Privileged Admin Client (Service Role)
Used **exclusively** inside Webhook route handlers (e.g. Razorpay webhook) or background jobs where no user cookie is present:

```typescript
// lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
```

### 2.3 Browser Client & Realtime Subscriptions
Used in Client Components to subscribe to live orders and rider GPS positions:

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

#### Realtime Order Status Subscription Hook
```tsx
// hooks/useRealtimeOrder.ts
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Order } from '@/types/models';

export function useRealtimeOrder(initialOrder: Order) {
  const [order, setOrder] = useState<Order>(initialOrder);

  useEffect(() => {
    const channel = supabase
      .channel(`order-${initialOrder.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${initialOrder.id}`,
        },
        (payload) => {
          setOrder((prev) => ({ ...prev, ...(payload.new as Partial<Order>) }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialOrder.id]);

  return order;
}
```

---

## 💳 3. Razorpay Payment Gateway Integration

### 3.1 Server-Side Order Initialization
```typescript
// lib/razorpay.ts
import Razorpay from 'razorpay';

export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createRazorpayOrder(amountInRupees: number, receiptId: string) {
  const options = {
    amount: Math.round(amountInRupees * 100), // Convert ₹ to Paise
    currency: 'INR',
    receipt: receiptId,
    payment_capture: true,
  };

  return await razorpayInstance.orders.create(options);
}
```

### 3.2 Webhook Signature Verification (`/api/webhooks/razorpay`)
```typescript
// app/api/webhooks/razorpay/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid HMAC signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;

      // Update database status via admin client
      await supabaseAdmin
        .from('orders')
        .update({
          payment_status: 'PAID',
          status: 'PAID',
          razorpay_payment_id: payment.id,
          updated_at: new Date().toISOString(),
        })
        .eq('razorpay_order_id', razorpayOrderId);
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    console.error('Razorpay Webhook Error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
```

---

## 🖼️ 4. Cloudinary Image Optimization Pipeline

Cloudinary delivers high-conversion product visuals without bandwidth bloat:

```typescript
// lib/cloudinary.ts
export function getOptimizedImageUrl(
  publicIdOrUrl: string,
  options?: { width?: number; height?: number; quality?: string }
): string {
  if (!publicIdOrUrl) return '/placeholder-grocery.png';
  if (!publicIdOrUrl.includes('res.cloudinary.com')) return publicIdOrUrl;

  const width = options?.width || 600;
  const quality = options?.quality || 'auto';
  const transformations = `f_auto,q_${quality},w_${width},c_limit`;

  return publicIdOrUrl.replace('/upload/', `/upload/${transformations}/`);
}
```

---

## 📈 5. PostHog Product Analytics Client

```typescript
// lib/posthog.ts
import posthog from 'posthog-js';

export function initPostHog() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      capture_pageview: true,
      persistence: 'localStorage',
    });
  }
}

export function trackEvent<K extends keyof import('@/types/events').PostHogEvents>(
  eventName: K,
  properties: import('@/types/events').PostHogEvents[K]
) {
  if (typeof window !== 'undefined') {
    posthog.capture(eventName, properties);
  }
}
```

---

## 💬 6. Live Agentation Visual Feedback Integration

In development, the `<Agentation />` widget is mounted into root layouts:

```tsx
// app/layout.tsx (Conditional development injection)
import { Agentation } from 'agentation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {process.env.NODE_ENV === 'development' && (
          <Agentation endpoint="http://localhost:4747" />
        )}
        {children}
      </body>
    </html>
  );
}
```

### Agent Inspection & Resolution Protocol
1. User clicks any UI element in browser to leave a visual comment (e.g. *"Increase padding around Buy button"*).
2. Agent runs: `agentation_get_all_pending()`.
3. Agent reads the selector, screenshot snippet, and user prompt.
4. Agent executes `replace_file_content` on the component.
5. Agent calls `agentation_resolve({ id: '<annotation_id>' })`.
