// src/components/ui/Button.tsx
'use client';

import { cn } from '@/lib/utils/cn';
import { ReactNode } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  onClick,
  type = 'button',
  children,
}: ButtonProps) {
  const baseStyles = cn(
    'inline-flex items-center justify-center gap-2 font-medium',
    'rounded-xl transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    'hover-scale btn-press'
  );

  const variants = {
    primary: cn(
      'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white',
      'shadow-md shadow-indigo-500/25',
      'hover:shadow-lg hover:shadow-indigo-500/30',
      'focus:ring-indigo-500'
    ),
    secondary: cn(
      'bg-white text-gray-700 border border-gray-200',
      'shadow-sm',
      'hover:bg-gray-50 hover:border-gray-300',
      'focus:ring-gray-500'
    ),
    ghost: cn(
      'text-gray-600',
      'hover:bg-gray-100 hover:text-gray-900',
      'focus:ring-gray-500'
    ),
    danger: cn(
      'bg-red-500 text-white',
      'shadow-md shadow-red-500/25',
      'hover:bg-red-600',
      'focus:ring-red-500'
    ),
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
    >
      {loading && (
        <svg 
          className="w-4 h-4 animate-spin" 
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle 
            className="opacity-25" 
            cx="12" cy="12" r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
