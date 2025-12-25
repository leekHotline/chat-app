// src/components/chat/ChatInput.tsx
'use client';

import { KeyboardEvent, useRef, useEffect } from 'react';
import { Send, Square, Paperclip, Image, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  onStop?: () => void;
}

export function ChatInput({ input, setInput, onSend, isLoading, onStop }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px';
    }
  }, [input]);

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSend();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-6 border-t border-border animate-fade-in">
      <div className="max-w-3xl mx-auto">
        {/* 输入框容器 */}
        <div className={cn(
          'relative rounded-xl border bg-card shadow-sm transition-all duration-200',
          input.trim() ? 'border-primary/50 ring-1 ring-primary/20' : 'border-border'
        )}>
          <div className="flex items-end p-2 gap-2">
            {/* 左侧工具按钮 */}
            <TooltipProvider>
              <div className="flex items-center gap-1 pb-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Paperclip size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>附件</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Image size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>图片</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>

            {/* 文本输入 */}
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息，Shift + Enter 换行..."
              rows={1}
              className={cn(
                'flex-1 border-0 bg-transparent shadow-none resize-none',
                'focus-visible:ring-0 min-h-[40px] max-h-[160px] py-2'
              )}
              disabled={isLoading}
            />

            {/* 右侧按钮 */}
            <TooltipProvider>
              <div className="flex items-center gap-1 pb-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mic size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>语音</TooltipContent>
                </Tooltip>
                
                {isLoading ? (
                  <Button variant="destructive" size="icon" onClick={onStop} className="h-9 w-9">
                    <Square size={16} />
                  </Button>
                ) : (
                  <Button 
                    size="icon" 
                    onClick={handleSubmit}
                    disabled={!input.trim()}
                    className="h-9 w-9"
                  >
                    <Send size={16} />
                  </Button>
                )}
              </div>
            </TooltipProvider>
          </div>
        </div>

        {/* 底部提示 */}
        <p className="text-center text-xs text-muted-foreground mt-3">
          AI 生成内容仅供参考，请注意核实
        </p>
      </div>
    </div>
  );
}
