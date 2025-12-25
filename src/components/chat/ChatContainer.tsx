// src/components/chat/ChatContainer.tsx
'use client';

import { useChat } from '@/hooks/useChat';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { ModelSelector } from './ModelSelector';
import { Plus, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ChatContainer() {
  const {
    messages,
    input,
    setInput,
    isLoading,
    error,
    sendMessage,
    createNewChat,
    stop,
  } = useChat();

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* 头部 */}
      <header 
        className="flex items-center justify-between px-6 py-3 animate-fade-in-up"
        style={{ animationDelay: '0.15s' }}
      >
        <Button variant="secondary" size="sm" onClick={createNewChat}>
          <Plus size={16} />
          新对话
        </Button>
        <ModelSelector />
      </header>

      {/* 错误提示 */}
      {error && (
        <div className="mx-6 mt-2 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-scale-in">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle size={16} />
          </div>
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* 消息列表 */}
      {messages.length > 0 ? (
        <MessageList messages={messages} />
      ) : (
        <EmptyState />
      )}

      {/* 输入框 */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSend={handleSend}
        isLoading={isLoading}
        onStop={stop}
      />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <div 
        className="text-center animate-fade-in-up max-w-md"
        style={{ animationDelay: '0.2s' }}
      >
        {/* 动画图标 */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl rotate-6 opacity-20 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg animate-float">
            <Sparkles size={32} className="text-white" />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          开始新对话
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          支持 GPT、Claude、Gemini 等多种 AI 模型
        </p>

        {/* 快捷提示 */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {['写一首诗', '解释代码', '翻译文本'].map((text, i) => (
            <span 
              key={text}
              className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
              style={{ animationDelay: `${0.3 + i * 0.1}s` }}
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
