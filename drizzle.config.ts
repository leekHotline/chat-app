// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';

// 显式加载 .env.local
dotenvConfig({ path: resolve(__dirname, '.env.local') });

// 调试：打印是否加载到
console.log('✅ DATABASE_URL loaded:', !!process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL is missing in .env.local');
}

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});