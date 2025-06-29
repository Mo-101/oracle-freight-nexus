
interface TTSConfig {
  voice: string;
  emotion: string;
  useRandomSeed: boolean;
  specificSeed?: number;
}

class AdvancedTTS {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://nihal-gazi-io-advanced-openai-text-to-speech-unlimited.hf.space') {
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
      formData.append('data', JSON.stringify([
        text,                           // prompt
        config.voice,                   // voice
        config.emotion,                 // emotion
        config.useRandomSeed,           // use_random_seed
        config.specificSeed || 12345    // specific_seed
      ]));

      console.log('Sending TTS request:', { text: text.substring(0, 50) + '...', config });

      const response = await fetch(`${this.baseUrl}/api/predict`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('TTS API Response:', result);

      // The Gradio API returns data in the format: { data: [audioFileUrl, statusMessage] }
      if (result.data && result.data[0]) {
        const audioUrl = result.data[0];
        console.log('Generated audio URL:', audioUrl);
        return audioUrl;
      } else {
        console.error('No audio URL in response:', result);
        return null;
      }
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

  // Get available voices from the service
  getAvailableVoices(): string[] {
    return [
      "alloy", "echo", "fable", "onyx", "nova", "shimmer",
      "coral", "verse", "ballad", "ash", "sage", "amuch", "dan"
    ];
  }
}

export const advancedTTS = new AdvancedTTS();
