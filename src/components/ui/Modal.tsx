// src/components/ui/Modal.tsx
'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // ESC 关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fade-in-up"
        style={{ animationDuration: '0.2s' }}
      />

      {/* 模态框 */}
      <div
        className={cn(
          'relative w-full max-w-lg bg-white rounded-2xl shadow-2xl',
          'animate-scale-in overflow-hidden'
        )}
      >
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center',
              'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
              'transition-all duration-200 hover-scale'
            )}
          >
            <X size={18} />
          </button>
        </div>

        {/* 内容 */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
