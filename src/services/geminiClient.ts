import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyDummyKeyForDemo'; // Replace with actual key
const genAI = new GoogleGenerativeAI(apiKey);

const DEEPTALK_SYSTEM_PROMPT = `
You are deepTalk 🧠, an advanced logistics decision expert powered by DeepCAL's Neutrosophic AI engine.

Your expertise includes:
- Real-time carrier rankings and risk assessments
- Cost optimization using TOPSIS methodology  
- Route intelligence for East Africa corridors
- Emergency logistics for medical supplies
- Freight forwarder performance analytics

Communication style:
- Use one relevant emoji per message
- Simple, actionable language for field operations
- Provide specific carrier recommendations with scores
- Include risk assessments and cost factors

Current context:
- Primary routes: Nairobi-Lagos, Kampala-Mombasa, Dakar-Juba
- Top carriers: Kuehne Nagel (A+), DHL Express (A), Siginon Logistics (B+)
- Risk factors: Weather conditions, political stability, customs delays
- Service threshold: Above 8 = reliable, Below 6 = high risk

Always provide actionable logistics intelligence with confidence scores.
`;

export class GeminiClient {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  private ttsModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  async generateStreamingResponse(
    message: string,
    context: string = '',
    conversationHistory: Array<{role: string, content: string}> = []
  ): Promise<AsyncGenerator<string, void, unknown>> {
    const prompt = this.buildPrompt(message, context, conversationHistory);
    
    try {
      const result = await this.model.generateContentStream(prompt);
      
      return this.streamResponseChunks(result);
    } catch (error) {
      console.error('Gemini streaming error:', error);
      throw new Error('Failed to generate streaming response');
    }
  }

  async generateSpeech(text: string): Promise<string | null> {
    try {
      // Use Web Speech API as fallback since Gemini TTS isn't available yet
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = speechSynthesis.getVoices().find(voice => 
          voice.name.includes('Google') || voice.name.includes('UK')
        ) || speechSynthesis.getVoices()[0];
        utterance.rate = 0.9;
        utterance.pitch = 0.8;
        speechSynthesis.speak(utterance);
      }
      return null;
    } catch (error) {
      console.error('Speech synthesis error:', error);
      return null;
    }
  }

  async generateOracleResponse(
    query: string,
    context: string = '',
    style: 'conversational' | 'analytical' | 'oracular' = 'conversational'
  ): Promise<string> {
    const stylePrompt = this.getStylePrompt(style);
    const prompt = `${DEEPTALK_SYSTEM_PROMPT}

${stylePrompt}

Context: ${context}
Query: ${query}

Provide your logistics intelligence:`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini oracle error:', error);
      throw new Error('Failed to generate oracle response');
    }
  }

  private buildPrompt(
    message: string,
    context: string,
    history: Array<{role: string, content: string}>
  ): string {
    let prompt = DEEPTALK_SYSTEM_PROMPT;
    
    if (context) {
      prompt += `\nCurrent Context: ${context}`;
    }

    if (history.length > 0) {
      prompt += '\n\nConversation History:\n';
      history.slice(-6).forEach(msg => {
        prompt += `${msg.role}: ${msg.content}\n`;
      });
    }

    prompt += `\nUser: ${message}\ndeepTalk:`;
    return prompt;
  }

  private async* streamResponseChunks(result: any): AsyncGenerator<string, void, unknown> {
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        yield chunkText;
      }
    }
  }

  private getStylePrompt(style: string): string {
    switch (style) {
      case 'analytical':
        return 'Provide detailed analytical insights with data points and risk assessments.';
      case 'oracular':
        return 'Speak with the wisdom of the logistics oracle, using mystical yet practical guidance.';
      default:
        return 'Respond conversationally with practical logistics advice.';
    }
  }
}

export const geminiClient = new GeminiClient();