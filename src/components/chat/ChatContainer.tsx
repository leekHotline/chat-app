// src/components/chat/ChatContainer.tsx
'use client';

import { useChat } from '@/hooks/useChat';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { ModelSelector } from './ModelSelector';
import { AlertCircle, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* 头部 */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-border animate-fade-in">
        <ModelSelector />
        {error && (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle size={12} />
            {error}
          </Badge>
        )}
      </header>

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
      <div className="text-center animate-fade-in">
        {/* 图标 */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center animate-float">
          <Sparkles size={28} className="text-primary" />
        </div>
        
        <h2 className="text-xl font-semibold text-foreground mb-2">
          开始新对话
        </h2>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          支持 GPT、Claude、Gemini 等多种 AI 模型
        </p>

        {/* 快捷提示 */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {['写一首诗', '解释代码', '翻译文本', '头脑风暴'].map((text, i) => (
            <Badge 
              key={text}
              variant="secondary"
              className="cursor-pointer hover:bg-accent transition-colors"
              style={{ animationDelay: `${0.2 + i * 0.05}s` }}
            >
              {text}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
