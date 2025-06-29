
interface TTSConfig {
  voice: string;
  emotion: string;
  useRandomSeed: boolean;
  specificSeed?: number;
}

interface TTSResponse {
  audioUrl: string;
  status: string;
}

class AdvancedTTS {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://huggingface.co/spaces/your-tts-space') {
    this.baseUrl = baseUrl;
  }

  async generateSpeech(
    text: string, 
    config: TTSConfig = {
      voice: 'ballad',
      emotion: 'mystical and wise',
      useRandomSeed: true
    }
  ): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('prompt', text);
      formData.append('voice', config.voice);
      formData.append('emotion', config.emotion);
      formData.append('use_random_seed', config.useRandomSeed.toString());
      if (config.specificSeed) {
        formData.append('specific_seed', config.specificSeed.toString());
      }

      const response = await fetch(`${this.baseUrl}/api/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data?.[0] || null;
    } catch (error) {
      console.error('Advanced TTS Error:', error);
      return null;
    }
  }

  getEmotionForPersonality(personality: 'oracular' | 'humorous' | 'corporate'): string {
    const emotionMap = {
      oracular: 'mystical, ancient wisdom with reverent tone',
      humorous: 'witty, sarcastic and playful',
      corporate: 'professional, authoritative and confident'
    };
    return emotionMap[personality];
  }
}

export const advancedTTS = new AdvancedTTS();
