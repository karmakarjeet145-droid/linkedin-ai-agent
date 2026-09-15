import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config';

const client = new Anthropic({
  apiKey: config.apiKey,
});

export async function callClaude(
  messages: Anthropic.Messages.MessageParam[],
  systemPrompt: string,
  maxTokens: number = config.maxTokens
): Promise<string> {
  try {
    const response = await client.messages.create({
      model: config.model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: messages,
    });

    if (response.content[0].type === 'text') {
      return response.content[0].text;
    }
    throw new Error('Unexpected response format from Claude');
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
}

export async function streamClaude(
  messages: Anthropic.Messages.MessageParam[],
  systemPrompt: string,
  onChunk: (chunk: string) => void,
  maxTokens: number = config.maxTokens
): Promise<void> {
  try {
    const stream = await client.messages.stream({
      model: config.model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: messages,
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        onChunk(chunk.delta.text);
      }
    }
  } catch (error) {
    console.error('Error streaming from Claude API:', error);
    throw error;
  }
}
