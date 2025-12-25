// src/components/layout/MainLayout.tsx
'use client';

import { Sidebar } from './Sidebar';
import { ApiKeyManager } from '../settings/ApiKeyManager';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="h-screen flex overflow-hidden bg-[#fafafa]">
      {/* 装饰背景 */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-40" />
      </div>

      {/* 侧边栏 */}
      <Sidebar />

      {/* 主内容区 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部栏 */}
        <header 
          className="flex justify-end px-6 py-4 animate-fade-in-up"
          style={{ animationDelay: '0.1s' }}
        >
          <ApiKeyManager />
        </header>

        {/* 内容 */}
        <div className="flex-1 overflow-hidden">{children}</div>
      </main>
    </div>
  );
}
