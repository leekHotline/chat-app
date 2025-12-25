// src/components/chat/MessageList.tsx
'use client';

import { useEffect, useRef } from 'react';
import { User, Bot, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils/cn';
import { useState } from 'react';

interface MessagePart {
  type: string;
  text?: string;
  [key: string]: unknown;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content?: string;
  parts?: MessagePart[];
}

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((message, index) => (
          <MessageBubble 
            key={message.id} 
            message={message} 
            index={index} 
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function MessageBubble({ message, index }: { message: Message; index: number }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  
  const content = message.parts
    ?.filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('') || message.content || '';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{ animationDelay: `${index * 0.05}s` }}
      className={cn(
        'flex gap-4 animate-fade-in-up opacity-0',
        isUser ? 'flex-row-reverse' : ''
      )}
    >
      {/* 头像 */}
      <div
        className={cn(
          'flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-sm',
          isUser
            ? 'bg-gradient-to-br from-indigo-500 to-purple-500'
            : 'bg-gradient-to-br from-emerald-500 to-teal-500'
        )}
      >
        {isUser ? (
          <User size={16} className="text-white" />
        ) : (
          <Bot size={16} className="text-white" />
        )}
      </div>

      {/* 消息内容 */}
      <div className={cn('flex-1 group', isUser ? 'flex justify-end' : '')}>
        <div
          className={cn(
            'relative rounded-2xl px-4 py-3 max-w-[90%]',
            'transition-all duration-200',
            isUser
              ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'bg-white border border-gray-100 text-gray-700 shadow-sm hover:shadow-md'
          )}
        >
          {/* 复制按钮 */}
          {!isUser && (
            <button
              onClick={handleCopy}
              className={cn(
                'absolute -right-2 -top-2 w-7 h-7 rounded-lg',
                'bg-white border border-gray-200 shadow-sm',
                'flex items-center justify-center',
                'opacity-0 group-hover:opacity-100 transition-all duration-200',
                'hover:bg-gray-50 hover-scale'
              )}
            >
              {copied ? (
                <Check size={12} className="text-green-500" />
              ) : (
                <Copy size={12} className="text-gray-400" />
              )}
            </button>
          )}

          <div className={cn(
            'prose prose-sm max-w-none',
            isUser ? 'prose-invert' : ''
          )}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                pre: ({ children }) => (
                  <pre className="bg-gray-900 rounded-xl p-4 overflow-x-auto my-3 text-sm">
                    {children}
                  </pre>
                ),
                code: ({ className, children, ...props }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code 
                      className={cn(
                        'px-1.5 py-0.5 rounded-md text-sm font-mono',
                        isUser 
                          ? 'bg-white/20 text-white' 
                          : 'bg-indigo-50 text-indigo-600'
                      )} 
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <code className={className} {...props}>{children}</code>
                  );
                },
                p: ({ children }) => (
                  <p className="leading-relaxed mb-2 last:mb-0">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>

          {/* 工具调用 */}
          {message.parts?.filter((p) => p.type.startsWith('tool-')).map((part, i) => (
            <div key={i} className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs">
              <span className="text-amber-600 font-medium">
                🔧 {part.type.replace('tool-', '')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
