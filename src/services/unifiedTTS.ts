
import { newTTSService } from './newTTSService';

export type VoicePersonality = 'oracular' | 'humorous' | 'corporate';

export interface TTSOptions {
  voice: string;
  emotion: string;
  useRandomSeed?: boolean;
}

class UnifiedTTSService {
  async generateSpeech(text: string, options: TTSOptions): Promise<string | null> {
    try {
      return await newTTSService.generateSpeech(text, options);
    } catch (error) {
      console.error('TTS generation failed:', error);
      return null;
    }
  }

  getVoiceForPersonality(personality: VoicePersonality): string {
    const voiceMap = {
      oracular: 'alloy',
      humorous: 'nova',
      corporate: 'echo'
    };
    return voiceMap[personality] || 'nova';
  }

  getEmotionForPersonality(personality: VoicePersonality): string {
    const emotionMap = {
      oracular: 'mystical and wise, ancient knowledge keeper',
      humorous: 'sarcastic and witty, casual and fun',
      corporate: 'professional and authoritative, business-like'
    };
    return emotionMap[personality] || 'neutral and helpful';
  }
}

export const unifiedTTS = new UnifiedTTSService();
