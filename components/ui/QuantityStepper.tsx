'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Plus, Minus, Trash2 } from 'lucide-react';

export interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  allowDeleteOnZero?: boolean;
  className?: string;
}

export function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  min = 0,
  max = 99,
  size = 'md',
  allowDeleteOnZero = true,
  className,
}: QuantityStepperProps) {
  const isMin = quantity <= min;
  const isMax = quantity >= max;

  const sizeStyles = {
    sm: 'h-8 text-xs',
    md: 'h-11 text-sm', // 44px mobile thumb target
    lg: 'h-13 text-base',
  };

  const buttonSizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-13 h-13',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center justify-between bg-[var(--brand-primary)] text-white rounded-xl shadow-sm overflow-hidden select-none',
        sizeStyles[size],
        className
      )}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDecrement();
        }}
        disabled={isMin && !allowDeleteOnZero}
        aria-label="Decrease quantity"
        className={cn(
          'flex items-center justify-center transition-colors hover:bg-[var(--brand-primary-hover)] active:scale-95 disabled:opacity-40 disabled:pointer-events-none',
          buttonSizeStyles[size]
        )}
      >
        {quantity === 1 && allowDeleteOnZero ? (
          <Trash2 className="w-4 h-4" />
        ) : (
          <Minus className="w-4 h-4 stroke-[2.5]" />
        )}
      </button>

      <span className="font-bold px-2 text-center min-w-[28px] tabular-nums">
        {quantity}
      </span>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onIncrement();
        }}
        disabled={isMax}
        aria-label="Increase quantity"
        className={cn(
          'flex items-center justify-center transition-colors hover:bg-[var(--brand-primary-hover)] active:scale-95 disabled:opacity-40 disabled:pointer-events-none',
          buttonSizeStyles[size]
        )}
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
      </button>
    </div>
  );
}
