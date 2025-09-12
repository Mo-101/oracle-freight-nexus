import { GoogleGenerativeAI } from '@google/generative-ai';

// DeepSeek-compatible client using Gemini API as backend
class DeepSeekClient {
  private genAI: GoogleGenerativeAI;

  constructor() {
    // Use the same API key as Gemini
    const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY || '';
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateOracleResponse(
    query: string, 
    context?: string, 
    style: 'conversational' | 'analytical' | 'oracular' = 'conversational'
  ): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `${context || ''}\n\nUser Query: ${query}\n\nRespond in ${style} style for freight logistics intelligence.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('DeepSeek client error:', error);
      return "I'm currently processing your logistics query. Please try again in a moment.";
    }
  }
}

export const deepseekClient = new DeepSeekClient();