// src/components/chat/ChatInput.tsx
'use client';

import { KeyboardEvent, useRef, useEffect } from 'react';
import { Send, Square, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  onStop?: () => void;
}

export function ChatInput({ input, setInput, onSend, isLoading, onStop }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动调整高度
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
    <div 
      className="p-6 animate-fade-in-up" 
      style={{ animationDelay: '0.25s' }}
    >
      <div className="max-w-3xl mx-auto">
        {/* 输入框容器 */}
        <div 
          className={cn(
            'relative bg-white rounded-2xl border transition-all duration-300',
            'shadow-sm hover:shadow-md',
            input.trim() 
              ? 'border-indigo-200 shadow-indigo-100/50' 
              : 'border-gray-200'
          )}
        >
          {/* 装饰渐变 */}
          {input.trim() && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none" />
          )}

          <div className="relative flex items-end p-2">
            {/* AI 图标 */}
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mr-2 shadow-sm">
              <Sparkles size={18} className="text-white" />
            </div>

            {/* 文本输入 */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息，Shift + Enter 换行..."
              rows={1}
              className={cn(
                'flex-1 bg-transparent text-gray-800 placeholder-gray-400',
                'resize-none outline-none py-2.5 px-1 text-sm leading-relaxed',
                'min-h-[40px] max-h-[160px]'
              )}
              disabled={isLoading}
            />

            {/* 发送按钮 */}
            <button
              onClick={isLoading ? onStop : handleSubmit}
              disabled={!isLoading && !input.trim()}
              className={cn(
                'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center',
                'transition-all duration-200 btn-press',
                isLoading
                  ? 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500'
                  : input.trim()
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/25 hover:shadow-lg hover-scale'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              )}
            >
              {isLoading ? <Square size={16} /> : <Send size={16} />}
            </button>
          </div>
        </div>

        {/* 底部提示 */}
        <p className="text-center text-xs text-gray-400 mt-3">
          AI 生成内容仅供参考，请注意核实
        </p>
      </div>
    </div>
  );
}
