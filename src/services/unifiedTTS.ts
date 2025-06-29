
import { elevenLabsTTS } from './elevenLabsTTS';
import { advancedTTS } from './advancedTTS';

interface TTSConfig {
  voice?: string;
  emotion?: string;
  useRandomSeed?: boolean;
  specificSeed?: number;
}

class UnifiedTTS {
  private preferElevenLabs: boolean = true;

  async generateSpeech(
    text: string,
    config: TTSConfig = {}
  ): Promise<string | null> {
    console.log('🎵 Unified TTS: Starting speech generation...');
    console.log('🎵 Text length:', text.length);
    console.log('🎵 Config:', config);

    // Try ElevenLabs first if API key is available
    if (this.preferElevenLabs) {
      try {
        console.log('🎵 Trying ElevenLabs TTS...');
        const audioUrl = await elevenLabsTTS.generateSpeech(text, {
          voice: config.voice || '9BWtsMINqrJLrRacOk9x', // Aria
          model: 'eleven_multilingual_v2'
        });
        
        if (audioUrl) {
          console.log('🎵 ElevenLabs TTS successful');
          return audioUrl;
        }
      } catch (error) {
        console.warn('🎵 ElevenLabs TTS failed, falling back to F5-TTS:', error);
      }
    }

    // Fallback to F5-TTS
    try {
      console.log('🎵 Trying F5-TTS fallback...');
      const audioUrl = await advancedTTS.generateSpeech(text, config);
      if (audioUrl) {
        console.log('🎵 F5-TTS fallback successful');
        return audioUrl;
      }
    } catch (error) {
      console.warn('🎵 F5-TTS also failed:', error);
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
    if (this.preferElevenLabs) {
      return elevenLabsTTS.getVoiceForPersonality(personality);
    }
    return advancedTTS.getEmotionForPersonality(personality);
  }

  setProvider(preferElevenLabs: boolean) {
    this.preferElevenLabs = preferElevenLabs;
    console.log('🎵 TTS Provider changed to:', preferElevenLabs ? 'ElevenLabs' : 'F5-TTS');
  }
}

export const unifiedTTS = new UnifiedTTS();
