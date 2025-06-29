
interface DeepSeekConfig {
  apiKey: string;
  baseURL: string;
  model: string;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class DeepSeekClient {
  private config: DeepSeekConfig;

  constructor(config: DeepSeekConfig) {
    this.config = config;
  }

  async chat(messages: ChatMessage[], options: {
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
  } = {}): Promise<string> {
    try {
      console.log('DeepSeek API Request:', { 
        model: this.config.model, 
        messages: messages.map(m => ({ role: m.role, content: m.content.substring(0, 100) + '...' }))
      });

      const response = await fetch(`${this.config.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 2000,
          stream: options.stream || false
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
      }

      const data: DeepSeekResponse = await response.json();
      console.log('DeepSeek API Response:', data);

      if (data.choices && data.choices[0]) {
        return data.choices[0].message.content;
      } else {
        throw new Error('No response content from DeepSeek API');
      }
    } catch (error) {
      console.error('DeepSeek API Error:', error);
      throw error;
    }
  }

  async generateOracleResponse(
    prompt: string, 
    context: string = '', 
    personality: 'oracular' | 'humorous' | 'corporate' = 'oracular'
  ): Promise<string> {
    const personalityPrompts = {
      oracular: "You are the DeepCAL Oracle, a mystical logistics AI with ancient wisdom. Speak in a mystical, wise tone with references to cosmic forces and destiny.",
      humorous: "You are the DeepCAL Oracle with a sarcastic, witty personality. Use humor and clever remarks while providing logistics insights.",
      corporate: "You are the DeepCAL Oracle in professional corporate mode. Provide authoritative, data-driven logistics analysis with business terminology."
    };

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `${personalityPrompts[personality]} You are an expert in logistics, supply chain management, and freight forwarding. Provide intelligent analysis and recommendations.`
      }
    ];

    if (context) {
      messages.push({
        role: 'user',
        content: `Context: ${context}`
      });
    }

    messages.push({
      role: 'user',
      content: prompt
    });

    return await this.chat(messages, { temperature: 0.8, max_tokens: 1500 });
  }
}

// Export configured DeepSeek client
export const deepseekClient = new DeepSeekClient({
  apiKey: 'sk-330b8cd8f8b54871b589c358a00f5e03',
  baseURL: 'https://api.deepseek.com/v1',
  model: 'deepseek-chat'
});

export default deepseekClient;
