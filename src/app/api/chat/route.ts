// src/app/api/chat/route.ts
import { streamText } from 'ai';
import { getModel } from '@/lib/ai/providers/factory';
import { mcpTools } from '@/lib/ai/mcp/tools';
import { decrypt } from '@/lib/utils/encryption';
import { AIProvider } from '@/types';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages, model, provider, encryptedApiKey } = await req.json();

    // 解密 API Key
    const apiKey = decrypt(encryptedApiKey);

    // 获取模型实例
    const aiModel = getModel(provider as AIProvider, model, apiKey);

    // 流式响应 - AI SDK v6 语法
    const result = streamText({
      model: aiModel,
      messages: messages,
      tools: mcpTools,
      maxSteps: 5,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}