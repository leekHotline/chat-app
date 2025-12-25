// src/components/settings/ApiKeyManager.tsx
'use client';

import { useState } from 'react';
import { Eye, EyeOff, Trash2, Check, Plus, Key } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useChatStore } from '@/stores/chatStore';
import { PROVIDERS, AIProvider } from '@/types';
import CryptoJS from 'crypto-js';
import { cn } from '@/lib/utils/cn';

const encryptKey = (key: string) => {
  return CryptoJS.AES.encrypt(key, 'client-secret').toString();
};

const decryptKey = (encrypted: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, 'client-secret');
    return bytes.toString(CryptoJS.enc.Utf8);
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
      const encrypted = encryptKey(inputKey.trim());
      setApiKey(editingProvider, encrypted);
      setEditingProvider(null);
      setInputKey('');
    }
  };

  const toggleShowKey = (provider: string) => {
    setShowKey((prev) => ({ ...prev, [provider]: !prev[provider] }));
  };

  const getMaskedKey = (encrypted: string, provider: string) => {
    if (showKey[provider]) {
      const decrypted = decryptKey(encrypted);
      return decrypted || '解密失败';
    }
    return '••••••••••••••••';
  };

  const configuredCount = Object.values(apiKeys).filter(Boolean).length;

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setIsOpen(true)}>
        <Key size={14} />
        API Keys
        {configuredCount > 0 && (
          <span className="ml-1 w-5 h-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">
            {configuredCount}
          </span>
        )}
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="API Key 管理">
        <div className="space-y-3">
          {Object.entries(PROVIDERS).map(([providerKey, config], index) => {
            const hasKey = !!apiKeys[providerKey as AIProvider];

            return (
              <div
                key={providerKey}
                style={{ animationDelay: `${index * 0.05}s` }}
                className={cn(
                  'p-4 rounded-xl border transition-all duration-200 animate-fade-in-up opacity-0',
                  hasKey 
                    ? 'bg-green-50 border-green-100' 
                    : 'bg-gray-50 border-gray-100 hover:border-gray-200'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">{config.name}</span>
                    {hasKey && (
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {hasKey ? (
                      <>
                        <button
                          onClick={() => toggleShowKey(providerKey)}
                          className={cn(
                            'p-2 rounded-lg transition-all duration-200',
                            'text-gray-400 hover:text-gray-600 hover:bg-white',
                            'hover-scale'
                          )}
                        >
                          {showKey[providerKey] ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          onClick={() => removeApiKey(providerKey as AIProvider)}
                          className={cn(
                            'p-2 rounded-lg transition-all duration-200',
                            'text-gray-400 hover:text-red-500 hover:bg-red-50',
                            'hover-scale'
                          )}
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditingProvider(providerKey as AIProvider)}
                        className={cn(
                          'p-2 rounded-lg transition-all duration-200',
                          'text-indigo-500 hover:bg-indigo-50',
                          'hover-scale'
                        )}
                      >
                        <Plus size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {hasKey ? (
                  <p className="text-sm text-gray-500 font-mono truncate">
                    {getMaskedKey(apiKeys[providerKey as AIProvider], providerKey)}
                  </p>
                ) : editingProvider === providerKey ? (
                  <div className="flex gap-2 animate-fade-in-up">
                    <input
                      type="password"
                      value={inputKey}
                      onChange={(e) => setInputKey(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                      placeholder={`输入 ${config.name} API Key`}
                      className={cn(
                        'flex-1 bg-white border border-gray-200 rounded-xl',
                        'px-3 py-2 text-sm text-gray-800 placeholder-gray-400',
                        'focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100',
                        'transition-all duration-200'
                      )}
                      autoFocus
                    />
                    <Button size="sm" onClick={handleSave}>
                      <Check size={16} />
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">未配置</p>
                )}

                {/* 支持的模型 */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {config.models.slice(0, 3).map((model) => (
                    <span
                      key={model}
                      className={cn(
                        'text-xs px-2 py-1 rounded-lg',
                        hasKey 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-500'
                      )}
                    >
                      {model}
                    </span>
                  ))}
                  {config.models.length > 3 && (
                    <span className="text-xs text-gray-400 px-2 py-1">
                      +{config.models.length - 3} 更多
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          <p className="text-xs text-gray-400 text-center pt-2">
            🔒 API Key 加密存储在本地浏览器
          </p>
        </div>
      </Modal>
    </>
  );
}
