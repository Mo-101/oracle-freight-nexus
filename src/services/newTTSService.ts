
interface TTSOptions {
  voice?: string;
  emotion?: string;
  useRandomSeed?: boolean;
  specificSeed?: number;
}

class NewTTSService {
  private gradioApiUrl = 'https://nihal-sahoo-text-to-speech-unlimited.hf.space';
  
  // Available voices from the new TTS system
  private availableVoices = [
    'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer', 
    'coral', 'verse', 'ballad', 'ash', 'sage', 'amuch', 'dan'
  ];

  async generateSpeech(
    text: string,
    options: TTSOptions = {}
  ): Promise<string | null> {
    const {
      voice = 'ballad',
      emotion = 'natural and engaging',
      useRandomSeed = true,
      specificSeed = 12345
    } = options;

    console.log('🎵 New TTS: Starting speech generation...');
    console.log('🎵 Text:', text.substring(0, 100) + (text.length > 100 ? '...' : ''));
    console.log('🎵 Options:', { voice, emotion, useRandomSeed, specificSeed });

    try {
      const response = await fetch(`${this.gradioApiUrl}/call/text_to_speech_app`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [
            text,
            voice,
            emotion,
            useRandomSeed,
            specificSeed
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('🎵 API Response:', data);

      if (data.event_id) {
        // Poll for the result
        const audioUrl = await this.pollForResult(data.event_id);
        return audioUrl;
      }

      return null;
    } catch (error) {
      console.error('🎵 TTS Error:', error);
      
      // Fallback to browser speech synthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text.substring(0, 200));
        utterance.rate = 0.8;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
        return 'browser-speech';
      }
      
      return null;
    }
  }

  private async pollForResult(eventId: string): Promise<string | null> {
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds timeout
    
    while (attempts < maxAttempts) {
      try {
        const response = await fetch(`${this.gradioApiUrl}/call/text_to_speech_app/${eventId}`);
        const data = await response.json();
        
        if (data.event_data && data.event_data[0]) {
          console.log('🎵 Audio generated successfully');
          return data.event_data[0]; // Audio file URL
        }
        
        if (data.success === false) {
          throw new Error('Generation failed');
        }
        
        // Wait 1 second before next poll
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      } catch (error) {
        console.error('🎵 Polling error:', error);
        break;
      }
    }
    
    throw new Error('Timeout waiting for audio generation');
  }

  getVoiceForPersonality(personality: 'oracular' | 'humorous' | 'corporate'): string {
    const voiceMap = {
      oracular: 'ballad',     // Mystical, deep voice
      humorous: 'coral',      // Friendly, conversational
      corporate: 'onyx'       // Professional, authoritative
    };
    return voiceMap[personality];
  }

  getEmotionForPersonality(personality: 'oracular' | 'humorous' | 'corporate'): string {
    const emotionMap = {
      oracular: 'mystical, ancient wisdom with reverent and mysterious tone',
      humorous: 'witty, sarcastic and playful with conversational energy',
      corporate: 'professional, authoritative and confident business tone'
    };
    return emotionMap[personality];
  }

  getAvailableVoices(): string[] {
    return [...this.availableVoices];
  }
}

export const newTTSService = new NewTTSService();
