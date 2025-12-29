// src/components/chat/ChatContainer.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { ModelSelector } from './ModelSelector';
import { AlertCircle, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import gsap from 'gsap';

export function ChatContainer() {
  const {
    messages,
    input,
    setInput,
    isLoading,
    error,
    sendMessage,
    stop,
  } = useChat();

  const containerRef = useRef<HTMLDivElement>(null);

  // 入场动画
  useEffect(() => {
    if (containerRef.current) {
      const header = containerRef.current.querySelector('.chat-header');
      const content = containerRef.current.querySelector('.chat-content');
      const inputArea = containerRef.current.querySelector('.chat-input-area');

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      tl.fromTo(header, 
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5 }
      )
      .fromTo(content,
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.6 },
        '-=0.3'
      )
      .fromTo(inputArea,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5 },
        '-=0.4'
      );
    }
  }, []);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div ref={containerRef} className="flex-1 flex flex-col h-full bg-gradient-to-b from-background to-background/95">
      {/* 头部 */}
      <header className="chat-header flex items-center justify-between px-6 py-3 border-b border-border/50 bg-white/30 backdrop-blur-sm">
        <ModelSelector />
        {error && (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle size={12} />
            {error}
          </Badge>
        )}
      </header>

      {/* 消息列表 - 扩大区域 */}
      <div className="chat-content flex-1 overflow-hidden">
        {messages.length > 0 ? (
          <MessageList messages={messages} />
        ) : (
          <EmptyState />
        )}
      </div>

      {/* 输入框 - 扩大 */}
      <div className="chat-input-area">
        <ChatInput
          input={input}
          setInput={setInput}
          onSend={handleSend}
          isLoading={isLoading}
          onStop={stop}
        />
      </div>
    </div>
  );
}

function EmptyState() {
  const emptyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (emptyRef.current) {
      const icon = emptyRef.current.querySelector('.empty-icon');
      const title = emptyRef.current.querySelector('.empty-title');
      const desc = emptyRef.current.querySelector('.empty-desc');
      const badges = emptyRef.current.querySelectorAll('.quick-badge');

      const tl = gsap.timeline({ defaults: { ease: 'back.out(1.7)' }, delay: 0.3 });
      
      tl.fromTo(icon,
        { opacity: 0, scale: 0, rotation: -180 },
        { opacity: 1, scale: 1, rotation: 0, duration: 0.6 }
      )
      .fromTo(title,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4 },
        '-=0.2'
      )
      .fromTo(desc,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4 },
        '-=0.2'
      )
      .fromTo(badges,
        { opacity: 0, scale: 0.8, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, stagger: 0.08 },
        '-=0.2'
      );

      // 图标浮动动画
      gsap.to(icon, {
        y: -8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }
  }, []);

  return (
    <div ref={emptyRef} className="flex-1 h-full flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* 图标 */}
        <div className="empty-icon w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-lg shadow-primary/10">
          <Sparkles size={36} className="text-primary" />
        </div>
        
        <h2 className="empty-title text-2xl font-semibold text-foreground mb-3">
          开始新对话
        </h2>
        <p className="empty-desc text-muted-foreground text-base max-w-sm mx-auto leading-relaxed">
          支持 GPT、Claude、Gemini 等多种 AI 模型，选择你喜欢的开始对话
        </p>

        {/* 快捷提示 */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {['写一首诗', '解释代码', '翻译文本', '头脑风暴'].map((text) => (
            <Badge 
              key={text}
              variant="secondary"
              className="quick-badge cursor-pointer px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 hover:shadow-md"
            >
              {text}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
