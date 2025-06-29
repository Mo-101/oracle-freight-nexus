
interface TTSConfig {
  voice: string;
  emotion: string;
  useRandomSeed: boolean;
  specificSeed?: number;
}

class AdvancedTTS {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://mrfakename-f5-tts.hf.space') {
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
      // F5-TTS API format
      const payload = {
        data: [
          text,           // Text to synthesize
          null,           // No reference audio (for voice cloning)
          "F5-TTS_v1"     // Model name
        ]
      };

      console.log('Sending F5-TTS request:', { text: text.substring(0, 50) + '...', config });

      const response = await fetch(`${this.baseUrl}/run/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`F5-TTS API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('F5-TTS API Response:', result);

      // The F5-TTS API returns data in the format: { data: [audioFileUrl] }
      if (result.data && result.data[0]) {
        const audioUrl = result.data[0];
        console.log('Generated audio URL:', audioUrl);
        return audioUrl;
      } else {
        console.error('No audio URL in response:', result);
        return null;
      }
    } catch (error) {
      console.error('F5-TTS Error:', error);
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

  // Available voices for F5-TTS (simplified since F5-TTS uses text-to-speech without specific voice IDs)
  getAvailableVoices(): string[] {
    return [
      "default", "natural", "expressive"
    ];
  }
}

export const advancedTTS = new AdvancedTTS();
