'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  hideHeader?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  contentClassName,
  maxWidth = 'md',
  hideHeader,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    full: 'max-w-full m-4',
  };

  const showHeader = !hideHeader && (Boolean(title) || Boolean(description));

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          'relative w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150',
          maxWidthStyles[maxWidth],
          className
        )}
      >
        {/* Floating close button when no header is shown */}
        {!showHeader && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-full bg-slate-900/10 hover:bg-slate-900/20 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-slate-950 transition active:scale-95 cursor-pointer shadow-xs"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}

        {/* Header */}
        {showHeader && (
          <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)]">
            <div>
              {title && (
                <h2 className="text-lg font-bold text-[var(--text-ink)] leading-snug">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-ink)] hover:bg-[var(--bg-muted)] transition-colors active:scale-95 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className={cn('p-5 max-h-[85vh] overflow-y-auto', contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}
