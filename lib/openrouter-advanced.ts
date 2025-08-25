import { analyzeTaskType, selectOptimalModel, getModelById } from './models';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  message: string;
  model: string;
  tokensUsed: number;
  cost: number;
}

export async function chatWithAdvancedRouting(
  apiKey: string,
  messages: ChatMessage[],
  options: {
    preferredModel?: string;
    autoModelSelection?: boolean;
    fallbackModels?: string[];
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<ChatResponse> {
  const {
    preferredModel,
    autoModelSelection = false,
    fallbackModels = ['gpt-3.5-turbo', 'claude-3.5-haiku'],
    temperature = 0.7,
    maxTokens = 2000
  } = options;

  let selectedModel = preferredModel || 'gpt-3.5-turbo';

  // Auto model selection based on user message
  if (autoModelSelection && messages.length > 0) {
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (lastUserMessage) {
      const taskType = analyzeTaskType(lastUserMessage.content);
      selectedModel = selectOptimalModel(taskType);
    }
  }

  const modelsToTry = [selectedModel, ...fallbackModels].filter((model, index, arr) => 
    arr.indexOf(model) === index // Remove duplicates
  );

  let lastError: Error | null = null;

  for (const model of modelsToTry) {
    try {
      console.log(`Attempting to use model: ${model}`);
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.SITE_URL || 'https://yvexanchatbots.netlify.app',
          'X-Title': 'Yvexan ChatBot Platform',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from model');
      }

      const modelInfo = getModelById(model);
      const tokensUsed = data.usage?.total_tokens || 0;
      const cost = modelInfo 
        ? (data.usage?.prompt_tokens || 0) * modelInfo.pricing.input + 
          (data.usage?.completion_tokens || 0) * modelInfo.pricing.output
        : tokensUsed * 0.000001; // Fallback cost estimate

      return {
        message: data.choices[0].message.content,
        model,
        tokensUsed,
        cost
      };

    } catch (error) {
      console.error(`Model ${model} failed:`, error);
      lastError = error as Error;
      continue;
    }
  }

  throw new Error(`All models failed. Last error: ${lastError?.message || 'Unknown error'}`);
}

export async function getAvailableModels(apiKey: string) {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching OpenRouter models:', error);
    return [];
  }
}