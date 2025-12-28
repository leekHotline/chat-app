// src/app/api/chat/route.ts
import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { decrypt } from '@/lib/utils/encryption';
import { AIProvider } from '@/types';

// export const runtime = 'edge';

function getModel(provider: AIProvider, modelId: string, apiKey: string) {
  switch (provider) {
    case 'openai':
      return createOpenAI({ apiKey })(modelId);
    case 'anthropic':
      return createAnthropic({ apiKey })(modelId);
    case 'google':
      return createGoogleGenerativeAI({ apiKey })(modelId);
    case 'deepseek':
      // DeepSeek 使用 OpenAI 兼容接口，指定 chat completions 端点
      return createOpenAI({ 
        apiKey, 
        baseURL: 'https://api.deepseek.com',
      }).chat(modelId);
    case 'qwen':
      return createOpenAI({ 
        apiKey, 
        baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      }).chat(modelId);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, model, provider, encryptedApiKey } = body as {
      messages: UIMessage[];
      model: string;
      provider: AIProvider;
      encryptedApiKey: string;
    };

    if (!messages || !model || !provider || !encryptedApiKey) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = decrypt(encryptedApiKey);
    console.log('Decrypted apiKey length:', apiKey?.length, 'isEmpty:', !apiKey);
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Invalid API key' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const aiModel = getModel(provider, model, apiKey);

    // ✅ 最简 AI SDK v6 调用（无 tools）
    const result = streamText({
      model: aiModel,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request', details: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}