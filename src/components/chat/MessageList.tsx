// src/components/chat/MessageList.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { User, Bot, Copy, Check, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
    <ScrollArea className="flex-1">
      <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
        {messages.map((message, index) => (
          <MessageBubble key={message.id} message={message} index={index} />
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
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
      className={cn('flex gap-4 animate-fade-in', isUser ? 'flex-row-reverse' : '')}
    >
      {/* 头像 */}
      <Avatar className="h-8 w-8">
        <AvatarFallback className={cn(
          isUser ? 'bg-primary text-primary-foreground' : 'bg-emerald-500 text-white'
        )}>
          {isUser ? <User size={14} /> : <Bot size={14} />}
        </AvatarFallback>
      </Avatar>

      {/* 消息内容 */}
      <div className={cn('flex-1 group', isUser ? 'flex justify-end' : '')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-3 max-w-[85%]',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground'
          )}
        >
          <div className={cn('prose prose-sm max-w-none', isUser ? 'prose-invert' : '')}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                pre: ({ children }) => (
                  <pre className="bg-background/50 rounded-lg p-3 overflow-x-auto my-2 text-sm border">
                    {children}
                  </pre>
                ),
                code: ({ className, children, ...props }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code 
                      className={cn(
                        'px-1.5 py-0.5 rounded text-sm font-mono',
                        isUser ? 'bg-primary-foreground/20' : 'bg-primary/10 text-primary'
                      )} 
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <code className={className} {...props}>{children}</code>
                  );
                },
                p: ({ children }) => <p className="leading-relaxed mb-2 last:mb-0">{children}</p>,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>

          {/* 工具调用 */}
          {message.parts?.filter((p) => p.type.startsWith('tool-')).map((part, i) => (
            <div key={i} className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs">
              <span className="text-amber-600 font-medium">🔧 {part.type.replace('tool-', '')}</span>
            </div>
          ))}
        </div>

        {/* AI 消息操作栏 */}
        {!isUser && (
          <TooltipProvider>
            <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy}>
                    {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>复制</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <ThumbsUp size={12} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>有帮助</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <ThumbsDown size={12} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>没帮助</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <RotateCcw size={12} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>重新生成</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}
