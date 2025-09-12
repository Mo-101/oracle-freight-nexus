interface TTSOptions {
  voice?: string;
  emotion?: string;
  useRandomSeed?: boolean;
}

class UnifiedTTS {
  async generateSpeech(text: string, options: TTSOptions = {}): Promise<string | null> {
    try {
      // Fallback to browser Speech Synthesis API
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        window.speechSynthesis.speak(utterance);
        return 'browser-speech';
      }
      
      return null;
    } catch (error) {
      console.error('TTS Error:', error);
      return null;
    }
  }

  getVoiceForPersonality(personality: string): string {
    const voiceMap: Record<string, string> = {
      'oracular': 'af_sarah',
      'analytical': 'en_us_male',
      'conversational': 'af_sarah'
    };
    return voiceMap[personality] || 'af_sarah';
  }

  getEmotionForPersonality(personality: string): string {
    const emotionMap: Record<string, string> = {
      'oracular': 'mystical and wise',
      'analytical': 'clear and professional',
      'conversational': 'friendly and warm'
    };
    return emotionMap[personality] || 'friendly and clear';
  }
}

export const unifiedTTS = new UnifiedTTS();