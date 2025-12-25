// src/components/layout/Sidebar.tsx
'use client';

import { useState } from 'react';
import { MessageSquare, Trash2, ChevronLeft, ChevronRight, Search, Plus, Sparkles } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

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
        'h-full flex flex-col animate-slide-in',
        'bg-sidebar border-r border-sidebar-border',
        'transition-[width] duration-300 ease-out',
        isCollapsed ? 'w-[60px]' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles size={16} className="text-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground">AI Chat</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      {/* 新建 & 搜索 */}
      {!isCollapsed && (
        <div className="px-3 pb-3 space-y-2 animate-fade-in">
          <Button className="w-full justify-start gap-2">
            <Plus size={16} />
            新建对话
          </Button>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="搜索对话" className="pl-9 h-9" />
          </div>
        </div>
      )}

      {/* 分类标题 */}
      {!isCollapsed && conversations.length > 0 && (
        <div className="px-4 py-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            所有对话
          </span>
        </div>
      )}

      {/* 对话列表 */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1">
          {conversations.map((conv, index) => (
            <button
              key={conv.id}
              onClick={() => setCurrentConversation(conv.id)}
              style={{ animationDelay: `${index * 0.03}s` }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left',
                'transition-all duration-200 group animate-fade-in',
                currentConversationId === conv.id
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
              )}
            >
              <MessageSquare size={16} className={cn(
                'flex-shrink-0',
                currentConversationId === conv.id ? 'text-primary' : ''
              )} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 truncate text-sm">{conv.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                    }}
                  >
                    <Trash2 size={12} className="text-destructive" />
                  </Button>
                </>
              )}
            </button>
          ))}
        </div>

        {conversations.length === 0 && !isCollapsed && (
          <div className="text-center py-12 animate-fade-in">
            <MessageSquare size={24} className="mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground text-sm">暂无对话</p>
          </div>
        )}
      </ScrollArea>
    </aside>
  );
}
