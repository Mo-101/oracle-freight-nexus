
import { advancedTTS } from './advancedTTS';

interface TTSConfig {
  voice?: string;
  emotion?: string;
  useRandomSeed?: boolean;
  specificSeed?: number;
}

class UnifiedTTS {
  private preferKokoro: boolean = true;

  async generateSpeech(
    text: string,
    config: TTSConfig = {}
  ): Promise<string | null> {
    console.log('🎵 Unified TTS: Starting speech generation...');
    console.log('🎵 Text length:', text.length);
    console.log('🎵 Config:', config);

    // Primary: Kokoro-TTS
    try {
      console.log('🎵 Trying Kokoro-TTS...');
      const audioUrl = await advancedTTS.generateSpeech(text, {
        voice: config.voice || 'af',
        emotion: config.emotion || 'neutral',
        useRandomSeed: config.useRandomSeed || false,
        specificSeed: config.specificSeed
      });
      if (audioUrl) {
        console.log('🎵 Kokoro-TTS successful');
        return audioUrl;
      }
    } catch (error) {
      console.warn('🎵 Kokoro-TTS failed, falling back to browser speech:', error);
    }

    // Final fallback to browser speech synthesis
    console.log('🎵 Attempting browser speech synthesis fallback...');
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text.substring(0, 200));
        utterance.rate = 0.8;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
        console.log('🎵 Browser speech synthesis triggered as fallback');
        return 'browser-speech'; // Special indicator for browser speech
      }
    } catch (fallbackError) {
      console.error('🎵 All TTS methods failed:', fallbackError);
    }

    return null;
  }

  getVoiceForPersonality(personality: 'oracular' | 'humorous' | 'corporate'): string {
    const voiceMap = {
      oracular: 'af_sarah',   // Clear, mystical
      humorous: 'af_nicole',  // Friendly, casual
      corporate: 'af'         // Professional default
    };
    return voiceMap[personality];
  }

  getAvailableVoices() {
    return advancedTTS.getAvailableVoices();
  }
}

export const unifiedTTS = new UnifiedTTS();
