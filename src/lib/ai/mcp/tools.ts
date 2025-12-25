// src/lib/ai/mcp/tools.ts
import { tool } from 'ai';
import { z } from 'zod';

export const mcpTools = {
  getCurrentTime: tool({
    description: 'Get the current date and time',
    parameters: z.object({
      timezone: z.string().optional(),
    }),
    execute: async ({ timezone = 'UTC' }) => {
      const now = new Date();
      return {
        time: now.toLocaleString('en-US', { timeZone: timezone }),
        timezone,
        timestamp: now.toISOString(),
      };
    },
  }),

  calculate: tool({
    description: 'Perform mathematical calculations',
    parameters: z.object({
      expression: z.string(),
    }),
    execute: async ({ expression }) => {
      try {
        const sanitized = expression.replace(/[^0-9+\-*/().%\s]/g, '');
        const result = Function(`"use strict"; return (${sanitized})`)();
        return { expression, result };
      } catch {
        return { expression, error: 'Invalid expression' };
      }
    },
  }),

  webSearch: tool({
    description: 'Search the web for information',
    parameters: z.object({
      query: z.string(),
    }),
    execute: async ({ query }) => {
      return {
        query,
        message: 'Web search placeholder',
        results: [],
      };
    },
  }),
};