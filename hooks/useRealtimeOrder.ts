'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Order } from '@/types/models';

export function useRealtimeOrder(initialOrder: Order) {
  const [order, setOrder] = useState<Order>(initialOrder);

  useEffect(() => {
    if (!initialOrder?.id) return;

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
          setOrder((prev) => ({
            ...prev,
            ...(payload.new as Partial<Order>),
          }));
        }
      )
      .subscribe();

    // Auto-polling fallback to guarantee customer tracking updates live
    const pollInterval = setInterval(async () => {
      try {
        const { data } = await supabase
          .from('orders')
          .select('*')
          .eq('id', initialOrder.id)
          .maybeSingle();

        if (data) {
          setOrder((prev) => ({
            ...prev,
            ...(data as Partial<Order>),
          }));
        }
      } catch (err) {
        console.warn('Order polling error:', err);
      }
    }, 3500);

    return () => {
      clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, [initialOrder.id]);

  return order;
}
