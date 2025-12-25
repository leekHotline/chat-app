// src/components/layout/MainLayout.tsx
'use client';

import { Sidebar } from './Sidebar';
import { ApiKeyManager } from '../settings/ApiKeyManager';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* 侧边栏 */}
      <Sidebar />

      {/* 主内容区 */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部栏 */}
        <header className="flex justify-end px-6 py-4 border-b border-border animate-fade-in">
          <ApiKeyManager />
        </header>

        <div className="flex-1 overflow-hidden">{children}</div>
      </main>
    </div>
  );
}
