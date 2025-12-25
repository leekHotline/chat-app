#!/bin/bash 
# 记得给sh脚本添加excute执行权限 chmod +x xxx.sh

# 创建目录结构
mkdir -p src/app/api/chat
mkdir -p src/components/{ui,chat,layout,settings}
mkdir -p src/lib/{db,ai/providers,ai/mcp,utils}
mkdir -p src/hooks
mkdir -p src/stores
mkdir -p src/types

# 创建所有文件（如果不存在则创建）
touch src/app/api/chat/route.ts
touch src/app/{layout.tsx,page.tsx,globals.css}
touch src/components/ui/{Button.tsx,GlassCard.tsx,Modal.tsx}
touch src/components/chat/{ChatContainer.tsx,ChatInput.tsx,MessageBubble.tsx,MessageList.tsx,ModelSelector.tsx}
touch src/components/layout/{MainLayout.tsx,Sidebar.tsx}
touch src/components/settings/ApiKeyManager.tsx
touch src/lib/db/{index.ts,schema.ts}
touch src/lib/ai/providers/factory.ts
touch src/lib/ai/mcp/tools.ts
touch src/lib/utils/{cn.ts,encryption.ts}
touch src/hooks/useChat.ts
touch src/stores/chatStore.ts
touch src/types/index.ts
touch drizzle.config.ts tailwind.config.ts next.config.js .env.local

echo "✅ 项目结构创建完成！"