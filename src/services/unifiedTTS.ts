
import { newTTSService } from './newTTSService';

interface TTSConfig {
  voice?: string;
  emotion?: string;
  useRandomSeed?: boolean;
  specificSeed?: number;
}

class UnifiedTTS {
  async generateSpeech(
    text: string,
    config: TTSConfig = {}
  ): Promise<string | null> {
    console.log('🎵 Unified TTS: Using new TTS service...');
    console.log('🎵 Text length:', text.length);
    console.log('🎵 Config:', config);

    try {
      const audioUrl = await newTTSService.generateSpeech(text, {
        voice: config.voice || 'ballad',
        emotion: config.emotion || 'natural and engaging',
        useRandomSeed: config.useRandomSeed ?? true,
        specificSeed: config.specificSeed
      });

      if (audioUrl) {
        console.log('🎵 New TTS successful');
        return audioUrl;
      }
    } catch (error) {
      console.warn('🎵 New TTS failed:', error);
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
        return 'browser-speech';
      }
    } catch (fallbackError) {
      console.error('🎵 All TTS methods failed:', fallbackError);
    }

    return null;
  }

  getVoiceForPersonality(personality: 'oracular' | 'humorous' | 'corporate'): string {
    return newTTSService.getVoiceForPersonality(personality);
  }

  getEmotionForPersonality(personality: 'oracular' | 'humorous' | 'corporate'): string {
    return newTTSService.getEmotionForPersonality(personality);
  }

  getAvailableVoices(): string[] {
    return newTTSService.getAvailableVoices();
  }
}

export const unifiedTTS = new UnifiedTTS();
