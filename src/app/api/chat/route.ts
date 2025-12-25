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

    const apiKey = decrypt(encryptedApiKey);
    const aiModel = getModel(provider as AIProvider, model, apiKey);

    const result = streamText({
      model: aiModel,
      messages: messages,
      tools: mcpTools,
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