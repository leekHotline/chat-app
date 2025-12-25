// src/components/ui/GlassCard.tsx
'use client';

import { cn } from '@/lib/utils/cn';
import { HTMLAttributes } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'outlined';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function GlassCard({
  variant = 'solid',
  hover = false,
  padding = 'md',
  className,
  children,
  ...props
}: GlassCardProps) {
  const variants = {
    glass: 'bg-white/80 backdrop-blur-xl border border-white/60 shadow-lg',
    solid: 'bg-white border border-gray-100 shadow-sm',
    outlined: 'bg-transparent border border-gray-200',
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      className={cn(
        'rounded-2xl animate-fade-in-up',
        variants[variant],
        paddings[padding],
        hover && 'hover-lift cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
