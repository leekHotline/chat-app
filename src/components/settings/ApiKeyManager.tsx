// src/components/settings/ApiKeyManager.tsx
'use client';

import { useState } from 'react';
import { Eye, EyeOff, Trash2, Check, Plus, Settings } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { PROVIDERS, AIProvider } from '@/types';
import CryptoJS from 'crypto-js';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';

const encryptKey = (key: string) => CryptoJS.AES.encrypt(key, 'client-secret').toString();
const decryptKey = (encrypted: string) => {
  try {
    return CryptoJS.AES.decrypt(encrypted, 'client-secret').toString(CryptoJS.enc.Utf8);
  } catch {
    return '';
  }
};

export function ApiKeyManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<AIProvider | null>(null);
  const [inputKey, setInputKey] = useState('');
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});

  const { apiKeys, setApiKey, removeApiKey } = useChatStore();

  const handleSave = () => {
    if (editingProvider && inputKey.trim()) {
      setApiKey(editingProvider, encryptKey(inputKey.trim()));
      setEditingProvider(null);
      setInputKey('');
    }
  };

  const configuredCount = Object.values(apiKeys).filter(Boolean).length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings size={14} />
          API Keys
          {configuredCount > 0 && (
            <Badge variant="default" className="h-5 w-5 p-0 justify-center">
              {configuredCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>API Key 管理</DialogTitle>
          <DialogDescription>
            配置各 AI 服务商的 API Key
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {Object.entries(PROVIDERS).map(([providerKey, config], index) => {
            const hasKey = !!apiKeys[providerKey as AIProvider];

            return (
              <div
                key={providerKey}
                style={{ animationDelay: `${index * 0.05}s` }}
                className={cn(
                  'p-4 rounded-lg border transition-all duration-200 animate-fade-in',
                  hasKey ? 'bg-green-50 border-green-200' : 'bg-card border-border hover:border-primary/30'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{config.name}</span>
                    {hasKey && (
                      <Badge variant="default" className="bg-green-500 text-xs">已配置</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {hasKey ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setShowKey(p => ({ ...p, [providerKey]: !p[providerKey] }))}
                        >
                          {showKey[providerKey] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => removeApiKey(providerKey as AIProvider)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-primary"
                        onClick={() => setEditingProvider(providerKey as AIProvider)}
                      >
                        <Plus size={14} />
                      </Button>
                    )}
                  </div>
                </div>

                {hasKey ? (
                  <p className="text-sm text-muted-foreground font-mono truncate">
                    {showKey[providerKey] 
                      ? decryptKey(apiKeys[providerKey as AIProvider]) || '解密失败' 
                      : '••••••••••••••••'}
                  </p>
                ) : editingProvider === providerKey ? (
                  <div className="flex gap-2 animate-fade-in">
                    <Input
                      type="password"
                      value={inputKey}
                      onChange={(e) => setInputKey(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                      placeholder={`输入 ${config.name} API Key`}
                      className="flex-1"
                      autoFocus
                    />
                    <Button size="sm" onClick={handleSave}>
                      <Check size={14} />
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">未配置</p>
                )}

                {/* 模型标签 */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {config.models.slice(0, 3).map((model) => (
                    <Badge key={model} variant={hasKey ? 'default' : 'secondary'} className="text-xs">
                      {model}
                    </Badge>
                  ))}
                  {config.models.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{config.models.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}

          <p className="text-xs text-muted-foreground text-center pt-2">
            🔒 API Key 加密存储在本地浏览器
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
