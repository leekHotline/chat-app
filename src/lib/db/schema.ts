// src/lib/db/schema.ts
import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';

// 用户表
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

// API Keys 表（加密存储）
export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  provider: text('provider').notNull(), // openai, anthropic, google, deepseek, qwen
  encryptedKey: text('encrypted_key').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 对话表
export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  title: text('title').default('New Chat'),
  model: text('model').default('gpt-4'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 消息表
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').references(() => conversations.id),
  role: text('role').notNull(), // user, assistant, system, tool
  content: text('content').notNull(),
  toolCalls: jsonb('tool_calls'), // MCP 工具调用
  createdAt: timestamp('created_at').defaultNow(),
});