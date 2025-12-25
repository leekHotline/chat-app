// src/components/chat/ModelSelector.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Cpu } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { PROVIDERS, AIProvider } from '@/types';
import { cn } from '@/lib/utils/cn';

export function ModelSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentProvider, currentModel, apiKeys, setProvider, setModel } = useChatStore();

  const availableProviders = Object.entries(PROVIDERS).filter(
    ([key]) => apiKeys[key as AIProvider]
  );

  const currentProviderConfig = PROVIDERS[currentProvider];

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl',
          'bg-white border border-gray-200 shadow-sm',
          'text-gray-700 text-sm font-medium',
          'transition-all duration-200 hover:border-gray-300 hover:shadow-md',
          'hover-scale btn-press',
          isOpen && 'border-indigo-300 shadow-md'
        )}
      >
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
          <Cpu size={12} className="text-white" />
        </div>
        <span className="max-w-[120px] truncate">
          {currentModel}
        </span>
        <ChevronDown 
          size={14} 
          className={cn(
            'text-gray-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )} 
        />
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div 
          className={cn(
            'absolute top-full mt-2 right-0 z-50',
            'w-64 bg-white rounded-2xl border border-gray-100',
            'shadow-xl shadow-gray-200/50',
            'animate-scale-in origin-top-right',
            'overflow-hidden'
          )}
        >
          {availableProviders.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-gray-500 text-sm">请先配置 API Key</p>
            </div>
          ) : (
            <div className="py-2 max-h-[320px] overflow-y-auto">
              {availableProviders.map(([providerKey, config]) => (
                <div key={providerKey}>
                  {/* Provider 标题 */}
                  <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {config.name}
                  </div>
                  
                  {/* 模型列表 */}
                  {config.models.map((model) => {
                    const isSelected = currentProvider === providerKey && currentModel === model;
                    return (
                      <button
                        key={model}
                        onClick={() => {
                          setProvider(providerKey as AIProvider);
                          setModel(model);
                          setIsOpen(false);
                        }}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2.5',
                          'text-sm text-left transition-all duration-150',
                          isSelected
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        )}
                      >
                        <span className="font-medium">{model}</span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                            <Check size={12} className="text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
