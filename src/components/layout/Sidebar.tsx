// src/components/layout/Sidebar.tsx
'use client';

import { useState } from 'react';
import { MessageSquare, Trash2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { cn } from '@/lib/utils/cn';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { 
    conversations, 
    currentConversationId, 
    setCurrentConversation,
    deleteConversation 
  } = useChatStore();

  return (
    <aside
      className={cn(
        'h-full bg-white border-r border-gray-100 flex flex-col animate-slide-in-left',
        'transition-[width] duration-300 ease-out',
        isCollapsed ? 'w-[68px]' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2 animate-fade-in-up">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-semibold text-gray-800">AI Chat</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center',
            'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
            'transition-all duration-200 hover-scale btn-press'
          )}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* 对话列表 */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <div className="space-y-1">
          {conversations.map((conv, index) => (
            <button
              key={conv.id}
              onClick={() => setCurrentConversation(conv.id)}
              style={{ animationDelay: `${index * 0.05}s` }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left',
                'transition-all duration-200 group animate-fade-in-up opacity-0',
                'hover-bg btn-press',
                currentConversationId === conv.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <MessageSquare 
                size={18} 
                className={cn(
                  'flex-shrink-0 transition-colors',
                  currentConversationId === conv.id ? 'text-indigo-500' : 'text-gray-400'
                )} 
              />
              {!isCollapsed && (
                <>
                  <span className="flex-1 truncate text-sm font-medium">{conv.title}</span>
                  <button
                    className={cn(
                      'opacity-0 group-hover:opacity-100 p-1.5 rounded-lg',
                      'text-gray-400 hover:text-red-500 hover:bg-red-50',
                      'transition-all duration-200'
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </button>
          ))}
        </div>

        {conversations.length === 0 && !isCollapsed && (
          <div className="text-center py-12 animate-fade-in-up">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
              <MessageSquare size={20} className="text-gray-400" />
            </div>
            <p className="text-gray-400 text-sm">暂无对话</p>
          </div>
        )}
      </div>
    </aside>
  );
}
