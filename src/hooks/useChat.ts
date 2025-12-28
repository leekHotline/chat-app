// src/hooks/useChat.ts
'use client';

import { Chat, useChat as useAIChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useCallback, useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { Conversation } from '@/types';

// 创建 Chat 实例
function createChat(model: string, provider: string, encryptedApiKey: string) {
  const transport = new DefaultChatTransport({
    api: '/api/chat',
    body: {
      model,
      provider,
      encryptedApiKey,
    },
  });
  return new Chat({ transport });
}

export function useChat() {
  const {
    currentConversationId,
    currentProvider,
    currentModel,
    apiKeys,
    _hasHydrated,
    addConversation,
    setCurrentConversation,
  } = useChatStore();

  const [input, setInput] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  
  const apiKey = apiKeys[currentProvider] || '';

  // 使用 useRef 存储 Chat 实例
  const chatRef = useRef<Chat<any> | null>(null);
  
  // 追踪上一次的配置
  const prevConfigRef = useRef({ provider: '', model: '', apiKey: '' });

  // 当配置变化或 hydration 完成时重新创建 Chat 实例
  useEffect(() => {
    if (!_hasHydrated) return;
    
    const configChanged = 
      prevConfigRef.current.provider !== currentProvider ||
      prevConfigRef.current.model !== currentModel ||
      prevConfigRef.current.apiKey !== apiKey;

    if (configChanged || !chatRef.current) {
      prevConfigRef.current = { provider: currentProvider, model: currentModel, apiKey };
      chatRef.current = createChat(currentModel, currentProvider, apiKey);
    }
  }, [_hasHydrated, currentProvider, currentModel, apiKey]);

  // 确保有一个初始 Chat 实例（用于 useAIChat）
  if (!chatRef.current) {
    chatRef.current = createChat(currentModel, currentProvider, apiKey);
  }

  const {
    messages,
    status,
    error: chatError,
    sendMessage,
    stop,
    clearError,
  } = useAIChat({ chat: chatRef.current });

  const isLoading = status === 'submitted' || status === 'streaming';
  const error = chatError?.message || localError;

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!_hasHydrated) {
        setLocalError('正在加载配置，请稍候...');
        return;
      }
      
      if (!apiKey) {
        setLocalError(`请先配置 ${currentProvider} 的 API Key`);
        return;
      }

      setLocalError(null);
      clearError();

      if (!currentConversationId) {
        const newConv: Conversation = {
          id: crypto.randomUUID(),
          title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
          model: currentModel,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        addConversation(newConv);
      }

      sendMessage({ text: content });
    },
    [_hasHydrated, apiKey, currentProvider, currentConversationId, currentModel, addConversation, sendMessage, clearError]
  );

  const createNewChat = useCallback(() => {
    chatRef.current = createChat(currentModel, currentProvider, apiKey);
    setCurrentConversation(null);
  }, [currentModel, currentProvider, apiKey, setCurrentConversation]);

  return {
    messages,
    input,
    setInput,
    isLoading,
    error,
    sendMessage: handleSendMessage,
    createNewChat,
    stop,
    isReady: _hasHydrated,
  };
}
