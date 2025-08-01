export interface ModelProvider {
  id: string;
  name: string;
  models: ModelInfo[];
}

export interface ModelInfo {
  id: string;
  name: string;
  description: string;
  contextLength: number;
  pricing: {
    input: number;
    output: number;
  };
  capabilities: string[];
  bestFor: string[];
}

export const MODEL_PROVIDERS: ModelProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: [
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: 'Fast and efficient for basic conversational tasks',
        contextLength: 16385,
        pricing: { input: 0.0015, output: 0.002 },
        capabilities: ['chat', 'text-generation'],
        bestFor: ['quick responses', 'basic questions', 'cost-effective solutions']
      },
      {
        id: 'gpt-4',
        name: 'GPT-4',
        description: 'Advanced reasoning and complex problem solving',
        contextLength: 8192,
        pricing: { input: 0.03, output: 0.06 },
        capabilities: ['chat', 'reasoning', 'analysis'],
        bestFor: ['complex analysis', 'detailed explanations', 'creative tasks']
      },
      {
        id: 'gpt-4.1',
        name: 'GPT-4.1',
        description: 'Enhanced version with improved reasoning capabilities',
        contextLength: 32768,
        pricing: { input: 0.035, output: 0.07 },
        capabilities: ['chat', 'advanced-reasoning', 'analysis'],
        bestFor: ['complex challenges', 'multi-step reasoning', 'technical analysis']
      },
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        description: 'Optimized for real-time conversations and interactions',
        contextLength: 128000,
        pricing: { input: 0.025, output: 0.05 },
        capabilities: ['chat', 'real-time', 'multimodal'],
        bestFor: ['real-time chat', 'conversational AI', 'interactive experiences']
      }
    ]
  },
  {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    models: [
      {
        id: 'claude-3.5-haiku',
        name: 'Claude 3.5 Haiku',
        description: 'Fast and efficient Claude model for quick tasks',
        contextLength: 200000,
        pricing: { input: 0.0008, output: 0.004 },
        capabilities: ['chat', 'analysis', 'writing'],
        bestFor: ['quick analysis', 'writing assistance', 'cost-effective solutions']
      },
      {
        id: 'claude-4-sonnet',
        name: 'Claude 4 Sonnet',
        description: 'Balanced performance for most conversational needs',
        contextLength: 200000,
        pricing: { input: 0.015, output: 0.075 },
        capabilities: ['chat', 'reasoning', 'writing', 'analysis'],
        bestFor: ['balanced conversations', 'thoughtful responses', 'content creation']
      },
      {
        id: 'claude-4-opus',
        name: 'Claude 4 Opus',
        description: 'Most capable Claude model for complex, nuanced tasks',
        contextLength: 200000,
        pricing: { input: 0.075, output: 0.225 },
        capabilities: ['advanced-reasoning', 'nuanced-analysis', 'creative-writing'],
        bestFor: ['complex analysis', 'nuanced conversations', 'creative projects']
      }
    ]
  },
  {
    id: 'google',
    name: 'Google Gemini',
    models: [
      {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        description: 'Google\'s flagship model for general tasks',
        contextLength: 32768,
        pricing: { input: 0.00125, output: 0.00375 },
        capabilities: ['chat', 'reasoning', 'multimodal'],
        bestFor: ['general conversations', 'web reasoning', 'multimodal tasks']
      },
      {
        id: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash',
        description: 'Fast and efficient for quick responses',
        contextLength: 1000000,
        pricing: { input: 0.00075, output: 0.003 },
        capabilities: ['chat', 'fast-processing', 'web-reasoning'],
        bestFor: ['quick responses', 'web search', 'real-time interactions']
      },
      {
        id: 'gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        description: 'Advanced capabilities with enhanced reasoning',
        contextLength: 2000000,
        pricing: { input: 0.0035, output: 0.0105 },
        capabilities: ['advanced-reasoning', 'multimodal', 'web-reasoning'],
        bestFor: ['complex reasoning', 'multimodal analysis', 'research tasks']
      }
    ]
  }
];

export function getAllModels(): ModelInfo[] {
  return MODEL_PROVIDERS.flatMap(provider => provider.models);
}

export function getModelById(modelId: string): ModelInfo | undefined {
  return getAllModels().find(model => model.id === modelId);
}

export function selectOptimalModel(
  taskType: 'quick' | 'complex' | 'creative' | 'analytical' | 'conversational',
  availableModels: string[] = []
): string {
  const allModels = getAllModels();
  const available = availableModels.length > 0 
    ? allModels.filter(m => availableModels.includes(m.id))
    : allModels;

  switch (taskType) {
    case 'quick':
      return available.find(m => m.id === 'gpt-3.5-turbo')?.id || 
             available.find(m => m.id === 'claude-3.5-haiku')?.id ||
             available[0]?.id || 'gpt-3.5-turbo';
    
    case 'complex':
      return available.find(m => m.id === 'gpt-4.1')?.id ||
             available.find(m => m.id === 'claude-4-opus')?.id ||
             available.find(m => m.id === 'gpt-4')?.id ||
             available[0]?.id || 'gpt-4';
    
    case 'creative':
      return available.find(m => m.id === 'claude-4-opus')?.id ||
             available.find(m => m.id === 'claude-4-sonnet')?.id ||
             available.find(m => m.id === 'gpt-4')?.id ||
             available[0]?.id || 'claude-4-sonnet';
    
    case 'analytical':
      return available.find(m => m.id === 'claude-4-sonnet')?.id ||
             available.find(m => m.id === 'gemini-2.5-pro')?.id ||
             available.find(m => m.id === 'gpt-4')?.id ||
             available[0]?.id || 'claude-4-sonnet';
    
    case 'conversational':
      return available.find(m => m.id === 'gpt-4o')?.id ||
             available.find(m => m.id === 'claude-4-sonnet')?.id ||
             available.find(m => m.id === 'gpt-4')?.id ||
             available[0]?.id || 'gpt-4o';
    
    default:
      return available[0]?.id || 'gpt-3.5-turbo';
  }
}

export function analyzeTaskType(message: string): 'quick' | 'complex' | 'creative' | 'analytical' | 'conversational' {
  const lowerMessage = message.toLowerCase();
  
  // Quick tasks
  if (lowerMessage.length < 50 || 
      /^(hi|hello|hey|what|who|when|where|how much|price|cost)/.test(lowerMessage)) {
    return 'quick';
  }
  
  // Complex tasks
  if (/\b(analyze|compare|evaluate|explain in detail|step by step|comprehensive|thorough)\b/.test(lowerMessage) ||
      lowerMessage.length > 200) {
    return 'complex';
  }
  
  // Creative tasks
  if (/\b(write|create|design|imagine|story|poem|creative|brainstorm|generate ideas)\b/.test(lowerMessage)) {
    return 'creative';
  }
  
  // Analytical tasks
  if (/\b(data|statistics|research|study|report|analysis|insights|trends)\b/.test(lowerMessage)) {
    return 'analytical';
  }
  
  // Default to conversational
  return 'conversational';
}