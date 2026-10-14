import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';

    const variants = {
      primary:
        'bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] shadow-sm',
      secondary:
        'bg-[var(--bg-muted)] text-[var(--text-ink)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)]',
      accent:
        'bg-[var(--brand-accent)] text-white hover:brightness-105 shadow-sm',
      destructive:
        'bg-rose-500 text-white hover:bg-rose-600 shadow-sm',
      outline:
        'border border-[var(--border-strong)] bg-white text-[var(--text-body)] hover:bg-[var(--bg-muted)]',
      ghost:
        'text-[var(--text-body)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-ink)]',
    };

    const sizes = {
      sm: 'h-9 px-3 text-xs min-h-[36px]',
      md: 'h-11 px-4 text-sm min-h-[44px]', // 44px mobile touch target
      lg: 'h-13 px-6 text-base min-h-[48px]',
      icon: 'h-11 w-11 min-h-[44px] min-w-[44px] p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
