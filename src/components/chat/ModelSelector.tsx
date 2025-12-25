// src/components/chat/ModelSelector.tsx
'use client';

import { Zap, Check, ChevronDown } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { PROVIDERS, AIProvider } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ModelSelector() {
  const { currentProvider, currentModel, apiKeys, setProvider, setModel } = useChatStore();

  const availableProviders = Object.entries(PROVIDERS).filter(
    ([key]) => apiKeys[key as AIProvider]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
            <Zap size={12} className="text-primary-foreground" />
          </div>
          <span className="max-w-[140px] truncate">{currentModel}</span>
          <ChevronDown size={14} className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="start" className="w-64">
        {availableProviders.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            请先配置 API Key
          </div>
        ) : (
          availableProviders.map(([providerKey, config], index) => (
            <div key={providerKey}>
              {index > 0 && <DropdownMenuSeparator />}
              <DropdownMenuLabel>{config.name}</DropdownMenuLabel>
              {config.models.map((model) => {
                const isSelected = currentProvider === providerKey && currentModel === model;
                return (
                  <DropdownMenuItem
                    key={model}
                    onClick={() => {
                      setProvider(providerKey as AIProvider);
                      setModel(model);
                    }}
                    className={cn(
                      'flex items-center justify-between cursor-pointer',
                      isSelected && 'bg-accent'
                    )}
                  >
                    <span>{model}</span>
                    {isSelected && <Check size={14} className="text-primary" />}
                  </DropdownMenuItem>
                );
              })}
            </div>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
